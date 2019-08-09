import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { EmployeeService } from '../../_services/employee.service';
import { Employee } from '../../_models/employee';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { Position } from '../../_models/position';
import { PositionService } from 'src/app/_services/position.service';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss']
})
export class EmployeesTableComponent implements OnInit {

  positions: Position[] = null;
  employees: Employee[] = null;
  isFilterOpen: boolean = false;

  constructor(
    private employeeService: EmployeeService,
    private positionService: PositionService) { }

  ngOnInit() {
    this.loadEmployees();
    this.loadPositions();
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

  //--------------

  sortByName(x, y) {
    return ((x.firstName == y.firstName) ? 0 : ((x.firstName > y.firstName) ? 1 : -1 ));
  }

  sortuj() {
    this.employees.sort(this.sortByName);
  }

  //-----------

  openOrCloseFilter() {
    this.isFilterOpen = !this.isFilterOpen;
  }

}
