import { Component, OnInit } from '@angular/core';
import { RoomService } from 'src/app/_services/room.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-add-room',
  templateUrl: './add-room.component.html',
  styleUrls: ['./add-room.component.scss']
})
export class AddRoomComponent implements OnInit {

  roomForm: FormGroup;

  constructor(
    private roomService: RoomService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.roomForm = this.formBuilder.group({
      number: ['', Validators.required],
      name: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    });
  }

  get f() { return this.roomForm.controls; }

  onSubmit() {
    
    if(this.roomForm.invalid) {
      return;
    }

    this.roomService.save(this.roomForm.value)
      .pipe(first())
      .subscribe();
  }
}
