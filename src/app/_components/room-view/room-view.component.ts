import { Component, OnInit, HostListener, Input, OnChanges, AfterViewInit, Output, EventEmitter, ɵConsole, OnDestroy } from '@angular/core';
import { Desk } from 'src/app/_models/desk';
import { Room } from 'src/app/_models/room';
import { DeskService } from 'src/app/_services/desk.service';
import { first } from 'rxjs/operators';
import { EmployeeService } from 'src/app/_services/employee.service';
import { Employee } from 'src/app/_models/employee';
import { FormControl } from '@angular/forms';

class Circle {

  id: number;
  employeeId: number;
  cx: number;
  cy: number;
  r: number;

  constructor (
    id: number,
    employeeId: number,
    cx: number,
    cy: number,
    r: number
  ) {
    this.id = id;
    this.employeeId = employeeId;
    this.cx = cx;
    this.cy = cy;
    this.r = r;
  }
}

@Component({
  selector: 'app-room-view',
  templateUrl: './room-view.component.html',
  styleUrls: ['./room-view.component.scss']
})
export class RoomViewComponent implements OnInit, OnChanges {

  // all desks in room
  desks: Desk[] = [];
  employeesCircles: Circle[] = [];

  // employee space properties
  spaceWidth = 200;
  spaceHeight = 200;

  // room properites
  @Input() room: Room;

  // -- svg max size
  svgMaxWidth = 400;
  svgMaxHeight = 400;
  // -- svg actual scaled size
  svgWidth: number;
  svgHeight: number;

  // SVG viewBox properties
  viewBox: string;

  //
  isColliding = false;
  @Output() collidingEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() refreshViewEvent: EventEmitter<any> = new EventEmitter<any>();

  //----
  employees: Employee[] = [];
  selectedDesk: Desk = null;
  selectedEmployee: Employee = null;
  selectedDraggableCircle: Circle = null;
  highlightedDesk: Desk = null;

  //--
  availableEmployees: Employee[] = [];
  employeeFormControl: FormControl;


  constructor(
    private deskService: DeskService,
    private employeeService: EmployeeService
    ) { }

  ngOnInit() {
    this.employeeService.getEmployees()
      .pipe(first())
      .subscribe(e => {
        this.employees = e;   
      });

    this.employeeFormControl = new FormControl('');
  }

  ngOnChanges() {
    this.nullDesksAndCircles();

    this.deskService.getAllDesksByRoomId(this.room.id)
      .pipe(first())
      .subscribe(desks => {
        this.desks = desks;
        this.initEmployeesCircles();
      });

    this.viewBox = '0 0 ' + this.room.width.toString() + ' ' + this.room.height.toString();
    this.setSvgScaledSize();
  }

  nullDesksAndCircles() {
    this.desks = [];
    this.employeesCircles = [];
    this.selectedEmployee = null;
    this.selectedDesk = null;
    this.selectedDraggableCircle = null;
    this.selectedDesk = null;
    this.highlightedDesk = null;
  }

  setSvgScaledSize() {
    const roomHeightAny: any = this.room.height;
    const roomWidthAny: any = this.room.width;

    const roomHeight = Number.parseInt(roomHeightAny);
    const roomWidth = Number.parseInt(roomWidthAny);

    if (roomHeight === roomWidth) {
      this.svgHeight = this.svgMaxHeight;
      this.svgWidth = this.svgMaxWidth;
    } else {
      if (roomHeight > roomWidth) {
        this.svgHeight = this.svgMaxHeight;
        this.svgWidth = Math.round((roomWidth / roomHeight) * this.svgMaxWidth);
      } else {
        this.svgWidth = this.svgMaxWidth;
        this.svgHeight = Math.round((roomHeight / roomWidth) * this.svgMaxHeight);
      }
    }

    console.log(this.svgWidth);
  }

  selectDesk(e?: MouseEvent, id?: number) {
    if(id) {
      const desk = this.desks.filter(x => x.id === id)[0];
      this.selectedDesk = desk;
      const employee = this.employees.filter(x => x.id === this.selectedDesk.employeeId)[0];
      this.selectedEmployee = employee;
      this.availableEmployees = this.employees.filter(e => e.room.id !== this.selectedDesk.roomId);
    } else if (!(e.target instanceof SVGCircleElement || e.target instanceof SVGRectElement)) {
      this.selectedEmployee = null;
      this.selectedDesk = null;
    }
  }

  initEmployeesCircles() {
    this.desks.forEach(desk => {
      if (desk.employeeId !== -1) {
        const circle = new Circle(desk.id, desk.employeeId, desk.positionX + 75, desk.positionY + 75, 30);
        this.employeesCircles.push(circle); 
      }
    });
  }

  updateEmployeesCircles() {
    this.employeesCircles = [];
    this.initEmployeesCircles();
  }

  // select circle to dragg
  selectDraggableCircle(e: MouseEvent, id: number) {
    const circle = this.employeesCircles.filter(x => x.id === id)[0];
    this.selectedDraggableCircle = circle;

    // highlight draggable circle and show info
    this.selectDesk(null, circle.id);
  }

  // dragg selectedCircle
  onSvgMouseMove(e: MouseEvent) {
    if (this.selectedDraggableCircle) {
      const svgElement = e.target as SVGElement;
      let svgSvgElement = e.target as SVGSVGElement;

      if (!(svgElement instanceof SVGSVGElement)) {
        svgSvgElement = svgElement.ownerSVGElement;
      }

      let point = svgSvgElement.createSVGPoint();

      // set coords of cords
      point.x = e.clientX;
      point.y = e.clientY;

      point = point.matrixTransform(svgSvgElement.getScreenCTM().inverse());

      this.selectedDraggableCircle.cx = point.x;
      this.selectedDraggableCircle.cy = point.y;
    }
  }

  highlightDesk(e: MouseEvent, id: number) {
    if (this.selectedDraggableCircle) {
      const desk = this.desks.filter(x => x.id === id)[0];
      if (desk.employeeId === -1) {
        desk.positionX -= 2;
        desk.positionY -= 2;
        desk.width += 4;
        desk.height += 4;
        this.highlightedDesk = desk;
      }  
    }
  }

  unhighlight(e?: MouseEvent, id?: number) {
    if (this.selectDraggableCircle) {
      const desk = this.desks.filter(x => x.id === id)[0];
      if (this.highlightedDesk && desk.id === this.highlightedDesk.id) {
        desk.positionX += 2;
        desk.positionY += 2;
        desk.width -= 4;
        desk.height -= 4;
        this.highlightedDesk = null;
      }
    }
  }

  // putDraggableCircleOnDesk(e: MouseEvent, id: number) {

  //   if (this.selectDraggableCircle) {
  //     const previousDesk = this.desks.filter(x => x.id === this.selectedDraggableCircle.id)[0];
  //     const desk = this.desks.filter(x => x.id === id)[0];
  //     if (desk.employeeId === -1) {
  //       desk.employeeId = this.selectedDraggableCircle.employeeId;
  //       previousDesk.employeeId = -1;
  //       this.selectedDraggableCircle = null;
  //       this.unhighlight(null, desk.id);
  //     }
  //   }
  // }

  updateDesk(id: number, desk: Desk) {
    this.deskService.update(id, desk)
      .pipe(first())
      .subscribe();
  }

  onSvgMouseUp(e: MouseEvent) {
    if (this.selectedDraggableCircle) {
      if (this.highlightedDesk) {
        const previousDesk = this.desks.filter(x => x.id === this.selectedDraggableCircle.id)[0];
        const desk = this.desks.filter(x => x.id === this.highlightedDesk.id)[0];
        if (desk.employeeId === -1) {
          desk.employeeId = this.selectedDraggableCircle.employeeId;
          previousDesk.employeeId = -1;
          // update previous desk and desk in db
          this.updateDesk(desk.id, desk);
          this.updateDesk(previousDesk.id, previousDesk);
          //---view update
          this.selectedDraggableCircle = null;
          this.unhighlight(null, desk.id);
          this.updateEmployeesCircles();
        }
      } else {
        this.selectedDraggableCircle = null;
        this.updateEmployeesCircles();
      }     
    }
  }

  removeEmployee() {
    if (this.selectedEmployee) {
      // remove employee from any room
      this.employeeService.removeFromAnyRoom(this.selectedEmployee.id)
        .pipe(first())
        .subscribe(() => this.availableEmployees =  this.employees.filter(e => e.room.id !== this.selectedDesk.roomId));
      // removee employee from selected desk
      this.selectedDesk.employeeId = -1;
      // update desk in db
      this.deskService.update(this.selectedDesk.id, this.selectedDesk)
        .pipe(first())
        .subscribe(() => {
          this.selectedDesk = null;
          this.selectedEmployee = null;
          this.selectedDraggableCircle = null;
          this.updateEmployeesCircles();
        });
        
      this.refreshViewEvent.emit(null);
    }
  }

  assignEmployeeToDesk() {
    if (this.employeeFormControl.value && this.selectedDesk) {
      
      // remove from desk in other room
      this.employeeService.removeFromPreviousDesk(this.employeeFormControl.value.id)
        .pipe(first())
        .subscribe();
      // assign employee to this room
      this.employeeService.assignToRoom(this.selectedDesk.roomId, this.employeeFormControl.value)
        .pipe(first())
        .subscribe(() => this.availableEmployees =  this.employees.filter(e => e.room.id !== this.selectedDesk.roomId));
      // assign employee to selected desk
      this.selectedDesk.employeeId = this.employeeFormControl.value.id;
      // update desk in db
      this.deskService.update(this.selectedDesk.id, this.selectedDesk)
        .pipe(first())
        .subscribe(() => {
          this.selectedDesk = null;
          this.updateEmployeesCircles();
        });
      
      this.refreshViewEvent.emit(null);
    }
  }
}

