import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
}
