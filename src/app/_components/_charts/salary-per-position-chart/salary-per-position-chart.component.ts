import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-salary-per-position-chart',
  templateUrl: './salary-per-position-chart.component.html',
  styleUrls: ['./salary-per-position-chart.component.scss']
})
export class SalaryPerPositionChartComponent implements OnInit {

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
      this.barChartData = [{
        data: this.generalInfo.sumSalaryPerPositionD
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
