import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Room } from '../../../_models/room';

@Component({
  selector: 'app-room-usage-chart',
  templateUrl: './room-usage-chart.component.html',
  styleUrls: ['./room-usage-chart.component.scss']
})
export class RoomUsageChartComponent implements OnInit, OnChanges {

  @Input() generalInfo: any;
  @Input() rooms: Room[];
  countClicks: number = 1;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  public barChartLabels;
  public barChartType = 'doughnut';
  public barChartLegend = 'true';
  public barChartData; 

  roomNumber: string;
  @Output() changeRoomNumberEvent = new EventEmitter<any>();
  roomNumberForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.roomNumberForm = this.formBuilder.group({
      roomNumber: ['']
    });

    if(this.generalInfo) {
      this.barChartData = [
        {data: this.generalInfo.positionsPerRoomD , label: 'Room usage'}
      ];
    this.barChartLabels = this.generalInfo.positionsPerRoomL;
    } 

    this.roomNumberForm.patchValue({
      roomNumber: this.rooms[0].id
    });
  }

  get f() { return this.roomNumberForm.controls; }

  ngOnChanges() {
    if(this.generalInfo) {
      this.barChartData = [
        {data: this.generalInfo.positionsPerRoomD , label: 'Room usage'}
      ];
    this.barChartLabels = this.generalInfo.positionsPerRoomL;
    }
  }

  changeChartType() {
    if (this.barChartType === 'doughnut')
      this.barChartType = 'pie';
    else if (this.barChartType === 'pie')
      this.barChartType = 'polarArea'
    else
      this.barChartType = 'doughnut';
  }

  setRoomNumber(number: string) {
    
      this.roomNumber = number;
      if(this.roomNumber) {
        this.changeRoomNumberEvent.emit(this.roomNumber);
      }
    
  }

  compareRoomsId(id1: number, id2: number): boolean {
    return id1 && id2 ? id1 === id2 : id1 === id2;
  }

}
