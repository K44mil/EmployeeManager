import { Component, OnInit } from '@angular/core';
import { EmployeeService } from 'src/app/_services/employee.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from 'src/app/_models/room';
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

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private roomService: RoomService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.employeeForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required ],
      position: ['', Validators.required],
      room: ['', Validators.required],
      salary: ['', Validators.required]
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

    // TODO: this.employeeService.save() 
  }
}
