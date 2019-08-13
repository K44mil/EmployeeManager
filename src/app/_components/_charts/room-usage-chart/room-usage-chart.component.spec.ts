import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomUsageChartComponent } from './room-usage-chart.component';

describe('RoomUsageChartComponent', () => {
  let component: RoomUsageChartComponent;
  let fixture: ComponentFixture<RoomUsageChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomUsageChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomUsageChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
