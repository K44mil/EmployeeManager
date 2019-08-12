import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/_services/employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/_models/room';
import { Position } from 'src/app/_models/position';
import { EmployeeFormValidator } from '../../_validators/employee-form-validator';

import { PositionService } from 'src/app/_services/position.service';
import { RoomService } from 'src/app/_services/room.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {

  employeeForm: FormGroup;

  rooms: Room[];
  positions: Position[];
  choosenPosition: Position;
  choosenRoom: Room;
    

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private roomService: RoomService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
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
    
  }

  get f() { return this.employeeForm.controls; }

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

  onSubmit() {

    if (this.employeeForm.invalid) {
      return;
    }

    this.employeeService.save(this.employeeForm.value)
      .pipe(first())
      .subscribe(() => this.loadRooms());

    this.employeeForm.reset();
    
  }

  getPosition(id: number) {
    if (this.positions) {
      this.positions.forEach(position => {
        if (position.id === id) {
          this.choosenPosition = position;
        }
      });
    }

    //console.log(this.choosenPosition);
  }

  getRoom(id: number) {
    if (this.rooms) {
      this.rooms.forEach(room => {
        if (room.id === id) {
          this.choosenRoom = room;
        }
      });
    }

    //console.log(this.choosenRoom);
  }
  
}
