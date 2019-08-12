import { Component, OnInit, Output, Input, OnDestroy, EventEmitter } from '@angular/core';
import { EmployeeService } from 'src/app/_services/employee.service';
import { RoomService } from 'src/app/_services/room.service';
import { PositionService } from 'src/app/_services/position.service';
import { Position } from 'src/app/_models/position';
import { Employee } from 'src/app/_models/employee';
import { Room } from 'src/app/_models/room';
import { first } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-employees-filter',
  templateUrl: './employees-filter.component.html',
  styleUrls: ['./employees-filter.component.scss']
})
export class EmployeesFilterComponent implements OnInit, OnDestroy {

  positions: Position[] = null;
  employees: Employee[] = null;
  rooms: Room[] = null;

  filterFormValueOutput: any;

  @Output() destroyEvent = new EventEmitter<any>();
  @Input() filterFormValueInput: any;

  employeesFilterForm: FormGroup;
  filterValueObj = null;

  // Employees to filter
  filteredEmployees: Employee[] = null;
  @Output() filterEvent = new EventEmitter<any>();

  constructor(
    private employeeService: EmployeeService,
    private roomService: RoomService,
    private positionService: PositionService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.loadData();

    this.employeesFilterForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      position: [''],
      room: [''],
      minSalary: [''],
      maxSalary: ['']
    });

    if (this.filterFormValueInput) {
      this.filterValueObj = JSON.parse(this.filterFormValueInput);
      this.employeesFilterForm.setValue(this.filterValueObj);
    }
    
  }

  get f() { return this.employeesFilterForm.controls; }

  ngOnDestroy() {
    this.destroyEvent.emit(JSON.stringify(this.employeesFilterForm.value));
  }

  loadData() {
    this.employeeService.getEmployees()
      .pipe(first())
      .subscribe(employees => this.employees = employees);

    this.roomService.getRooms()
      .pipe(first())
      .subscribe(rooms => this.rooms = rooms);

    this.positionService.getPositions()
      .pipe(first())
      .subscribe(positions => this.positions = positions);
  }

  onClickReset() {
    this.employeesFilterForm.reset();
  }

  // onClickFilter() {
  //   console.log(this.employeesFilterForm.value);
  // }

  compareRooms(r1: Room, r2: Room): boolean {
    return r1 && r2 ? r1.id === r2.id : r1 === r2;
  }

  comparePositions(p1: Position, p2: Position): boolean {
    return p1 && p2 ?  p1.id === p2.id : p1 === p2;
  }

  onFilterSubmit() {
    
    let firstNameValue = this.f.firstName.value;
    let lastNameValue = this.f.lastName.value;
    let positionValue = this.f.position.value;
    let roomValue = this.f.room.value;
    let minSalaryValue = this.f.minSalary.value;
    let maxSalaryValue = this.f.maxSalary.value;

    let filteredEmployees = this.employees;
    // filter employees

    if (firstNameValue !== null && firstNameValue !== undefined && firstNameValue !== '') {
      filteredEmployees = filteredEmployees.filter(employee => employee.firstName === firstNameValue);
    }
    if (lastNameValue !== null && lastNameValue !== undefined && lastNameValue !== '') {
      filteredEmployees = filteredEmployees.filter(employee => employee.lastName === lastNameValue);
    }
    if (positionValue !== null && positionValue !== undefined && positionValue !== '') {
      filteredEmployees = filteredEmployees.filter(employee => employee.position.id === positionValue.id);
    }
    if (roomValue !== null && roomValue !== undefined && roomValue !== '') {
      filteredEmployees = filteredEmployees.filter(employee => employee.room.id === roomValue.id);
    }
    if (minSalaryValue !== null && minSalaryValue !== undefined && minSalaryValue !== '') {
      filteredEmployees = filteredEmployees.filter(employee => employee.salary >= Number.parseInt(minSalaryValue));
    }
    if (maxSalaryValue !== null && maxSalaryValue !== undefined && maxSalaryValue !== '') {
      filteredEmployees = filteredEmployees.filter(employee => employee.salary <= Number.parseInt(maxSalaryValue));
    }
    
    this.filterEvent.emit(filteredEmployees);
  }

}
