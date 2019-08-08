import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { RoomService } from '../../_services/room.service';
import { Room } from '../../_models/room';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-rooms-table',
  templateUrl: './rooms-table.component.html',
  styleUrls: ['./rooms-table.component.scss']
})
export class RoomsTableComponent implements OnInit {

  rooms: Room[] = null;

  constructor(
    private roomService: RoomService,
    private ngxSmartModalService: NgxSmartModalService
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

  addRoom() {
    this.ngxSmartModalService.getModal('roomModal').open();
  }

}
