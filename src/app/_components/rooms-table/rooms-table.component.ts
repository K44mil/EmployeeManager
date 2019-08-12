import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';

import { RoomService } from '../../_services/room.service';
import { Room } from '../../_models/room';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DataService } from 'src/app/_services/data.service';

@Component({
  selector: 'app-rooms-table',
  templateUrl: './rooms-table.component.html',
  styleUrls: ['./rooms-table.component.scss']
})
export class RoomsTableComponent implements OnInit {

  rooms: Room[] = null;

  // Pagination values
  currentPage: number = 1;
  roomsPerPage: number = 5;
  // !--Pagination values

  selectedRoom: Room;

  constructor(
    private roomService: RoomService,
    private ngxSmartModalService: NgxSmartModalService,
    private dataService: DataService
    ) { }

  ngOnInit() {
    this.loadRooms();
  }

  loadRooms() {
    this.roomService.getRooms()
      .pipe(first())
      .subscribe(rooms => this.rooms = rooms);
  }

  deleteRoom(id: number) {
    this.roomService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadRooms());
  }

  editRoom(id: number) {
    let filterRooms = this.rooms.filter(room => room.id === id);
    // console.log(filterRooms[0]);
    this.selectedRoom = filterRooms[0];
    this.dataService.setRoomToEdit(this.selectedRoom);
    this.ngxSmartModalService.getModal('roomEditModal').open();
  }

  addRoom() { 
    this.ngxSmartModalService.getModal('roomModal').open();
  }

  getAmountOfWorkers(): string {
    return '0';
  }

}
