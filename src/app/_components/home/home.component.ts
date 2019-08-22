import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { first } from 'rxjs/operators';
import { Room } from 'src/app/_models/room';
import { RoomService } from 'src/app/_services/room.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  generalInfo: any;
  // roomId: number;
  roomNumber: number;
  rooms: Room[];


  constructor(
    private dataService: DataService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
   this.loadRooms();
   console.log('content init');
  }

  ngAfterContentInit() {
    console.log('content loaded');
  }

  loadGeneralInfo(roomId: number) {
    this.dataService.getGeneralInfo(roomId)
    .pipe(first())
    .subscribe(
      gI => this.generalInfo = gI
    );

  }

  loadRooms() {
    this.roomService.getRooms()
      .pipe(first())
      .subscribe(r => {
        this.rooms = r;
        this.loadGeneralInfo(this.rooms[0].id);
      });
  }

  showGeneralInfoInConsole() {
    console.log(this.generalInfo);
  }

  getRoomNumberFromEvent($event) {
    this.roomNumber = Number.parseInt($event);

    this.loadGeneralInfo(this.roomNumber);     
  }

}
