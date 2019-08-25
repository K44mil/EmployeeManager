import { Component, OnInit, OnChanges } from '@angular/core';
import { RoomService } from 'src/app/_services/room.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { RoomFormValidator } from 'src/app/_validators/room-form-validator';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit, OnChanges {

  roomForm: FormGroup;
  roomDesignerFlag: FormGroup;

  isRoomValid = false;
  roomWidth = 0;
  roomHeight = 0;
  numberOfDesks = 0;
  desksToSave = [];

  isColliding = false;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder
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

    this.onRoomFormChanges();
  }

  get f() { return this.roomForm.controls; }

  onSubmit() {

    if(this.roomForm.invalid) {
      return;
    }

    const roomData = {
      roomObj: this.roomForm.value,
      desksInRoom: this.desksToSave
    };


    this.roomService.save(roomData)
      .pipe(first())
      .subscribe();

    this.roomForm.reset();
  }

  ngOnChanges() {
    // console.log('changes');
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
