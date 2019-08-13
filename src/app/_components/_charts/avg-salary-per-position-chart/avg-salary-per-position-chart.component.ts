import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-avg-salary-per-position-chart',
  templateUrl: './avg-salary-per-position-chart.component.html',
  styleUrls: ['./avg-salary-per-position-chart.component.scss']
})
export class AvgSalaryPerPositionChartComponent implements OnInit {

  @Input() generalInfo: any;

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  public barChartLabels;
  public barChartType = 'doughnut';
  public barChartLegend = 'true';

  public barChartData;; 

  constructor() { }

  ngOnInit() {
    if(this.generalInfo) {
      this.barChartData = [{
        data: this.generalInfo.avgSalaryPerPositionD
      }];

      this.barChartLabels = this.generalInfo.avgSalaryPerPositionL;
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

  show() {
    console.log(this.generalInfo);
  }


}
