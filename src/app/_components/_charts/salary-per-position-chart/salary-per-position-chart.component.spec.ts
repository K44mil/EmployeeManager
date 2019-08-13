import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryPerPositionChartComponent } from './salary-per-position-chart.component';

describe('SalaryPerPositionChartComponent', () => {
  let component: SalaryPerPositionChartComponent;
  let fixture: ComponentFixture<SalaryPerPositionChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalaryPerPositionChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryPerPositionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
