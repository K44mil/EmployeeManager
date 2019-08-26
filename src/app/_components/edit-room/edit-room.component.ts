import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RoomFormValidator } from '../../_validators/room-form-validator';

import { Room } from 'src/app/_models/room';
import { DataService } from 'src/app/_services/data.service';
import { RoomService } from 'src/app/_services/room.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class EditRoomComponent implements OnInit, OnChanges {

  roomForm: FormGroup;
  roomDesignerFlag: FormGroup;
  @Input() room: Room;

  isRoomValid = false;
  roomWidth = 0;
  roomHeight = 0;
  numberOfDesks = 0;
  desksToSave = [];

  // refresh table view after edit with event emitter
  @Output() refreshViewEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.roomForm = this.formBuilder.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      width: ['', [Validators.required, Validators.min(200), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      height: ['', [Validators.required, Validators.min(200), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      capacity: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    }, { validator: RoomFormValidator('width', 'height', 'capacity') });
    this.roomDesignerFlag = this.formBuilder.group({
      isColliding: ['', Validators.required]
    });

    this.setRoomEditFormValue();
    this.onRoomFormChanges();
  }

  ngOnChanges() {
    this.room = this.dataService.getRoomToEdit();
    this.setRoomEditFormValue();
  }

  get f() { return this.roomForm.controls; }

  setRoomEditFormValue() {
    if(this.room && this.roomForm) {
      this.roomForm.patchValue({
        number: this.room.number,
        name: this.room.name,
        width: this.room.width,
        height: this.room.height,
        capacity: this.room.capacity
      });
    }

    this.roomHeight = this.room.height;
    this.roomWidth = this.room.width;
    this.numberOfDesks = this.room.capacity;
    this.isRoomValid = true;
  }

  onSubmit() {

    if (this.roomForm.invalid) {
      return;
    }

    const roomData = {
      roomObj: this.roomForm.value,
      desksInRoom: this.desksToSave
    };

    this.roomService.update(this.room.id, roomData)
      .pipe(first())
      .subscribe();
      
    this.refreshViewEvent.emit(null);
  }

  onRoomFormChanges() {
    this.roomForm.valueChanges.subscribe(formValue => {

      this.isRoomValid = false; // reset 

      if (this.roomForm.valid) {
        this.isRoomValid = true;
      } else {
        this.isRoomValid = false;
      }

      this.roomHeight = formValue.height;
      this.roomWidth = formValue.width;
      this.numberOfDesks = formValue.capacity;
    });
  }

  setIsColliding(e) {
    // console.log(e);

    if ((e.numberOfDesksLeft === 0 || e.numberOfDesksLeft === '0') && e.isColliding === false) {
      this.roomDesignerFlag.patchValue({
        isColliding: 'false'
      });
    } else {
      this.roomDesignerFlag.patchValue({
        isColliding: null
      });
    }
    this.roomDesignerFlag.updateValueAndValidity();
    this.desksToSave = e.desks;
  }

}
