import { Component, OnInit, HostListener, Input, OnChanges, AfterViewInit, Output, EventEmitter, ɵConsole } from '@angular/core';
import { Desk } from 'src/app/_models/desk';
import { Room } from 'src/app/_models/room';
import { DeskService } from 'src/app/_services/desk.service';
import { first } from 'rxjs/operators';
import { EmployeeService } from 'src/app/_services/employee.service';
import { Employee } from 'src/app/_models/employee';

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

  //----
  employees: Employee[] = [];
  selectedDesk: Desk = null;
  selectedEmployee: Employee = null;
  selectedDraggableCircle: Circle = null;
  highlightedDesk: Desk = null;

  constructor(
    private deskService: DeskService,
    private employeeService: EmployeeService
    ) { }

  ngOnInit() {
    this.employeeService.getEmployees()
      .pipe(first())
      .subscribe(e => this.employees = e);
  }

  ngOnChanges() {
    this.deskService.getAllDesksByRoomId(this.room.id)
      .pipe(first())
      .subscribe(desks => {
        this.desks = desks;
        this.initEmployeesCircles();
      });

    this.viewBox = '0 0 ' + this.room.width.toString() + ' ' + this.room.height.toString();
    this.setSvgScaledSize();
  }

  setSvgScaledSize() {
    if (this.room.height === this.room.width) {
      this.svgHeight = this.svgMaxHeight;
      this.svgWidth = this.svgMaxWidth;
    } else {
      if (this.room.height > this.room.width) {
        this.svgHeight = this.svgMaxHeight;
        this.svgWidth = Math.round((this.room.width / this.room.height) * this.svgMaxWidth);
      } else {
        this.svgWidth = this.svgMaxWidth;
        this.svgHeight = Math.round((this.room.height / this.room.width) * this.svgMaxHeight);
      }
    }
  }

  selectDesk(e?: MouseEvent, id?: number) {
    if(id) {
      const desk = this.desks.filter(x => x.id === id)[0];
      this.selectedDesk = desk;
      const employee = this.employees.filter(x => x.id === this.selectedDesk.employeeId)[0];
      this.selectedEmployee = employee;
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

  onSvgMouseUp(e: MouseEvent) {
    if (this.selectedDraggableCircle) {
      if (this.highlightedDesk) {
        const previousDesk = this.desks.filter(x => x.id === this.selectedDraggableCircle.id)[0];
        const desk = this.desks.filter(x => x.id === this.highlightedDesk.id)[0];
        if (desk.employeeId === -1) {
          desk.employeeId = this.selectedDraggableCircle.employeeId;
          previousDesk.employeeId = -1;
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
      const desk = this.desks.filter(x => x.employeeId === this.selectedEmployee.id)[0];
      desk.employeeId = -1;
      this.selectedDesk = null;
      this.selectedEmployee = null;
      this.selectedDraggableCircle = null;
      this.updateEmployeesCircles();
    }
  }
}

