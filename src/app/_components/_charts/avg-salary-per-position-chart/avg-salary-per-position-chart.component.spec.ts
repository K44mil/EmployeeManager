import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgSalaryPerPositionChartComponent } from './avg-salary-per-position-chart.component';

describe('AvgSalaryPerPositionChartComponent', () => {
  let component: AvgSalaryPerPositionChartComponent;
  let fixture: ComponentFixture<AvgSalaryPerPositionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvgSalaryPerPositionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvgSalaryPerPositionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
