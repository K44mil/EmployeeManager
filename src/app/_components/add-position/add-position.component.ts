import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PositionService } from 'src/app/_services/position.service';
import { PositionFormValidator } from 'src/app/_validators/position-form-validator';
import { first } from 'rxjs/operators';

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
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      minWage: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      maxWage: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    }, { validator: PositionFormValidator('minWage', 'maxWage') });
  }

  get f() { return this.positionForm.controls; }

  onSubmit() {

    if (this.positionForm.invalid) {
      return;
    }

    this.positionService.save(this.positionForm.value)
      .pipe(first())
      .subscribe();
  }

}
