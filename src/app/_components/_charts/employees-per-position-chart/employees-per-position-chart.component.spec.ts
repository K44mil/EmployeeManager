import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesPerPositionChartComponent } from './employees-per-position-chart.component';

describe('EmployeesPerPositionChartComponent', () => {
  let component: EmployeesPerPositionChartComponent;
  let fixture: ComponentFixture<EmployeesPerPositionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeesPerPositionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeesPerPositionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
