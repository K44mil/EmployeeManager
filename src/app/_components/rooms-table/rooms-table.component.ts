import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';

import { RoomService } from '../../_services/room.service';
import { Room } from '../../_models/room';
import { NgxSmartModalService } from 'ngx-smart-modal';
import { DataService } from '../../_services/data.service';
import { FormControl } from '@angular/forms';

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
  itemsPerPageControl: FormControl;
  // !--Pagination values

  selectedRoom: Room;

  viewRoomId: number;

  constructor(
    private roomService: RoomService,
    private ngxSmartModalService: NgxSmartModalService,
    private dataService: DataService
    ) { }

  ngOnInit() {
    this.loadRooms();

    this.itemsPerPageControl = new FormControl(this.roomsPerPage);
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
    let roomToEdit = this.rooms.filter(room => room.id === id);
    // console.log(filterRooms[0]);
    this.selectedRoom = roomToEdit[0];
    this.dataService.setRoomToEdit(this.selectedRoom);
    this.ngxSmartModalService.getModal('roomEditModal').open();
  }

  addRoom() {
    this.ngxSmartModalService.getModal('roomModal').open();
  }

  setItemsPerPage(value: number) {
    this.roomsPerPage = value;
  }

  viewRoom(id: number) {
    let roomToView = this.rooms.filter(room => room.id === id);
    this.selectedRoom = roomToView[0];

    this.ngxSmartModalService.getModal('roomViewModal').open();
  }

}
