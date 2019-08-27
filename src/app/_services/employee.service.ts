import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../_models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private employeeUrl: string = 'http://localhost:4000/employees';

  constructor(private http: HttpClient) { }

  getEmployees() {
    return this.http.get<any[]>(this.employeeUrl);
  }

  delete(id: number) {
    return this.http.delete(`${this.employeeUrl}/${id}`);
  }

  save(employee: any) {
    return this.http.post(`${this.employeeUrl}`, employee);
  }

  update(id: number, employee: any) {
    return this.http.put(`${this.employeeUrl}/${id}`, employee);
  }

  assignToRoom(id: number, employee: Employee) {
    return this.http.put(`${this.employeeUrl}/roomid=/${id}`, employee);
  }

  removeFromAnyRoom(id: number) {
    return this.http.get(`${this.employeeUrl}/rmfromroom/employeeId=/${id}`);
  }

  removeFromPreviousDesk(id: number) {
    return this.http.get(`${this.employeeUrl}/rmfromdesk/employeeId=/${id}`);
  }
}
