import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { EmployeeService } from '../../_services/employee.service';
import { Employee } from '../../_models/employee';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Position } from '../../_models/position';
import { PositionService } from 'src/app/_services/position.service';
import { DataService } from 'src/app/_services/data.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss']
})
export class EmployeesTableComponent implements OnInit {

  positions: Position[] = null;
  employees: Employee[] = null;
  isFilterOpen: boolean = false;

  // Pagination values
  currentPage: number = 1;
  employeesPerPage: number = 5;
  itemsPerPageControl: FormControl;
  // !--Pagination values

  // Filter values
  filterValue: any = null;

  //--
  selectedEmployee: Employee;

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService,
    private dataService: DataService,
    private ngxSmartModalService: NgxSmartModalService) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadPositions();

    this.itemsPerPageControl = new FormControl(this.employeesPerPage);
  }

  loadEmployees() {
    this.employeeService.getEmployees()
      .pipe(first())
      .subscribe(employees => this.employees = employees);
  }

  loadPositions() {
    this.positionService.getPositions()
      .pipe(first())
      .subscribe(positions => this.positions = positions);
  }

  deleteEmployee(id: number) {
    this.employeeService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadEmployees());
  }

  editEmployee(id: number) {
    let employeeToEdit = this.employees.filter(employee => employee.id === id);

    this.selectedEmployee = employeeToEdit[0];
    this.dataService.setEmployeeToEdit(this.selectedEmployee);
    this.ngxSmartModalService.getModal('employeeEditModal').open();
  }

  openOrCloseFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

  getValue($event) {
    this.filterValue = $event;
    //console.log(this.filterValue + "--- received");
  }

  setFilteredEmployees($event) {
    this.employees = $event;
  }

  setItemsPerPage(value: number) {
    this.employeesPerPage = value;
  }

}
