import { Injectable } from '@angular/core';
import { Room } from '../_models/room';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private roomToEdit: Room;

  constructor() { }

  setRoomToEdit(room: Room) {
    this.roomToEdit = room;
  }

  getRoomToEdit(): Room {
    return this.roomToEdit;
  }
}
