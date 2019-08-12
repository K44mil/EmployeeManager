import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PositionFormValidator } from '../../_validators/position-form-validator';
import { DataService } from 'src/app/_services/data.service';
import { PositionService } from 'src/app/_services/position.service';
import { Position } from '../../_models/position';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-edit-position',
  templateUrl: './edit-position.component.html',
  styleUrls: ['./edit-position.component.scss']
})
export class EditPositionComponent implements OnInit, OnChanges {

  positionEditForm: FormGroup;
  @Input() position: Position;

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private positionService: PositionService
  ) { }

  ngOnInit() {
    this.positionEditForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
      minWage: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      maxWage: ['', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    }, { validator: PositionFormValidator('minWage', 'maxWage') });

    this.setPositionEditFormValue();
  }

  ngOnChanges() {
    this.position = this.dataService.getPositionToEdit();
    this.setPositionEditFormValue();
  }

  get f() { return this.positionEditForm.controls; }

  setPositionEditFormValue() {
    if (this.position && this.positionEditForm) {
      this.positionEditForm.patchValue({
        name: this.position.name,
        minWage: this.position.minWage,
        maxWage: this.position.maxWage
      });
    }
  }

  onSubmit() {

    if (this.positionEditForm.invalid) {
      return;
    }

    this.positionService.update(this.position.id, this.positionEditForm.value)
      .pipe(first())
      .subscribe();
  }
}
