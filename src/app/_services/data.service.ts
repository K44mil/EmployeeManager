import { Injectable } from '@angular/core';
import { Room } from '../_models/room';
import { Position } from '../_models/position';
import { Employee } from '../_models/employee';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private roomToEdit: Room;
  private positionToEdit: Position;
  private employeeToEdit: Employee;

  constructor() { }

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
}
