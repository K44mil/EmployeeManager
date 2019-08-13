import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-room-usage-chart',
  templateUrl: './room-usage-chart.component.html',
  styleUrls: ['./room-usage-chart.component.scss']
})
export class RoomUsageChartComponent implements OnInit {

  @Input() generalInfo: any;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  public barChartLabels;
  public barChartType = 'doughnut';
  public barChartLegend = 'true';

  public barChartData; 

  constructor() { }

  ngOnInit() {
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

}
