import { Component, OnInit, Input, OnDestroy, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  @Input() room: Room;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.roomForm = this.formBuilder.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    });
    
   this.setEditFormValue();
  }

  ngOnChanges() {
    this.room = this.dataService.getRoomToEdit();
    this.setEditFormValue();
  }

  get f() { return this.roomForm.controls; }

  test() {
    console.log(this.room);
  }

  setEditFormValue() {
    if(this.room && this.roomForm) {
      this.roomForm.patchValue({
        number: this.room.number,
        name: this.room.name,
        capacity: this.room.capacity
      });
    }
  }

  onSubmit() {
    
    if (this.roomForm.invalid) {
      return;
    }

    this.roomService.update(this.room.id, this.roomForm.value)
      .pipe(first())
      .subscribe();
  }

}
