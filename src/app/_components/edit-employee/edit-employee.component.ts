import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Room } from 'src/app/_models/room';
import { RoomService } from 'src/app/_services/room.service';
import { Position } from '../../_models/position';
import { PositionService } from 'src/app/_services/position.service';
import { EmployeeService } from 'src/app/_services/employee.service';
import { DataService } from 'src/app/_services/data.service';
import { EmployeeFormValidator } from 'src/app/_validators/employee-form-validator';
import { first } from 'rxjs/operators';
import { Employee } from 'src/app/_models/employee';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit, OnChanges {

  employeeEditForm: FormGroup;

  rooms: Room[];
  positions: Position[];
  choosenPosition: Position;
  choosenRoom: Room;

  @Input() employee: Employee;

  constructor(
    private formBuilder: FormBuilder,
    private roomService: RoomService,
    private positionService: PositionService,
    private employeeService: EmployeeService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.employeeEditForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Z][a-z]+$/)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^[A-Z][a-z]+$/)]],
      position: ['', Validators.required],
      room: ['', Validators.required],
      salary: ['', Validators.required]
    },
    { 
      validator: EmployeeFormValidator('room', 'salary', 'position')
    });

    this.loadRooms();
    this.loadPositions();

    this.setEmployeeEditFormValue();
  }

  ngOnChanges() {
    this.employee = this.dataService.getEmployeeToEdit();
    this.setEmployeeEditFormValue();
  }

  get f() { return this.employeeEditForm.controls; }

  loadRooms() {
    this.roomService.getRooms()
      .pipe(first())
      .subscribe(rooms => this.rooms = rooms);
  }

  loadPositions() {
    this.positionService.getPositions()
      .pipe(first())
      .subscribe(positions => this.positions = positions)
  }

  setEmployeeEditFormValue() {
    if (this.employee && this.employeeEditForm) {
      this.employeeEditForm.patchValue({
        firstName: this.employee.firstName,
        lastName: this.employee.lastName,
        room: this.employee.room,
        position: this.employee.position,
        salary: this.employee.salary
      });

      this.choosenPosition = this.employee.position;
      this.choosenRoom = this.employee.room;
    }
  }

  getPosition(id: number) {
    if (this.positions) {
      this.positions.forEach(position => {
        if (position.id === id) {
          this.choosenPosition = position;
        }
      });
    }

  }

  getRoom(id: number) {
    if (this.rooms) {
      this.rooms.forEach(room => {
        if (room.id === id) {
          this.choosenRoom = room;
        }
      });
    }
  }

  compareRooms(r1: Room, r2: Room): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  comparePositions(p1: Position, p2: Position): boolean {
    return p1 && p2 ?  p1.id === p2.id : p1 === p2;
  }

  onSubmit() {

    if (this.employeeEditForm.invalid) {
      return;
    }

    this.employeeService.update(this.employee.id, this.employeeEditForm.value)
      .pipe(first())
      .subscribe(() => this.loadRooms());
  }

}
