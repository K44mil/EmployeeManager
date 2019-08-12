import { Injectable } from '@angular/core';
import { Room } from '../_models/room';
import { Position } from '../_models/position';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private roomToEdit: Room;
  private positionToEdit: Position;
  
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
}
