import { Injectable } from '@angular/core';
import { Room } from '../_models/room';
import { Position } from '../_models/position';
import { Employee } from '../_models/employee';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private roomToEdit: Room;
  private positionToEdit: Position;
  private employeeToEdit: Employee;

  private infoUrl: string = 'http://localhost:4000/info';

  constructor(
    private http: HttpClient
  ) { }

  setRoomToEdit(room: Room) {
    this.roomToEdit = room;
  }

  getRoomToEdit(): Room {
    return this.roomToEdit;
  }

  setPositionToEdit(position: Position) {
    this.positionToEdit = position;
  }

  getPositionToEdit(): Position {
    return this.positionToEdit;
  }

  setEmployeeToEdit(employee: Employee) {
    this.employeeToEdit = employee;
  }

  getEmployeeToEdit() {
    return this.employeeToEdit;
  }

  getGeneralInfo() {
    return this.http.get<any[]>(this.infoUrl);
  }

}
