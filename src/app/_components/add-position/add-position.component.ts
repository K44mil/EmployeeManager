import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PositionService } from 'src/app/_services/position.service';

@Component({
  selector: 'app-add-position',
  templateUrl: './add-position.component.html',
  styleUrls: ['./add-position.component.scss']
})
export class AddPositionComponent implements OnInit {

  positionForm: FormGroup;

  constructor(
    private positionService: PositionService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.positionForm = this.formBuilder.group({
      name: ['', Validators.required],
      minWage: ['', Validators.required],
      maxWage: ['', Validators.required]
    });
  }

  get f() { return this.positionForm.controls; }

  onSubmit() {

    if (this.positionForm.invalid) {
      return;
    }

    // TODO: this.positionService.save()
  }

}
