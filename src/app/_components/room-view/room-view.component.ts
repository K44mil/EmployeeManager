import { Component, OnInit, HostListener, Input, OnChanges, AfterViewInit, Output, EventEmitter, ɵConsole } from '@angular/core';
import { Desk } from 'src/app/_models/desk';
import { Room } from 'src/app/_models/room';
import { DeskService } from 'src/app/_services/desk.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-room-view',
  templateUrl: './room-view.component.html',
  styleUrls: ['./room-view.component.scss']
})
export class RoomViewComponent implements OnInit, OnChanges {

  // all desks in room
  desks: Desk[] = [];

  // employee space properties
  spaceWidth = 200;
  spaceHeight = 200;

  // room properites
  @Input() room: Room;

  // -- svg max size
  svgMaxWidth = 400;
  svgMaxHeight = 400;
  // -- svg actual scaled size
  svgWidth: number;
  svgHeight: number;

  // SVG viewBox properties
  viewBox: string;

  //
  isColliding = false;
  @Output() collidingEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(private deskService: DeskService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.deskService.getAllDesksByRoomId(this.room.id)
      .pipe(first())
      .subscribe(desks => this.desks = desks);

    this.viewBox = '0 0 ' + this.room.width.toString() + ' ' + this.room.height.toString();
    this.setSvgScaledSize();
  }

  setSvgScaledSize() {
    if (this.room.height === this.room.width) {
      this.svgHeight = this.svgMaxHeight;
      this.svgWidth = this.svgMaxWidth;
    } else {
      if (this.room.height > this.room.width) {
        this.svgHeight = this.svgMaxHeight;
        this.svgWidth = Math.round((this.room.width / this.room.height) * this.svgMaxWidth);
      } else {
        this.svgWidth = this.svgMaxWidth;
        this.svgHeight = Math.round((this.room.height / this.room.width) * this.svgMaxHeight);
      }
    }
  }


}
