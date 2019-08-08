import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { EmployeeService } from '../../_services/employee.service';
import { Employee } from '../../_models/employee';

@Component({
  selector: 'app-employees-table',
  templateUrl: './employees-table.component.html',
  styleUrls: ['./employees-table.component.scss']
})
export class EmployeesTableComponent implements OnInit {

  employees: Employee[] = null;

  constructor(private employeeService: EmployeeService) { }

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeeService.getEmployees()
      .pipe(first())
      .subscribe(employees => this.employees = employees);
  }
}
