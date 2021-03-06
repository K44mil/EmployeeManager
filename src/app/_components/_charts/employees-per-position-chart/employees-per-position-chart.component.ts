import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-employees-per-position-chart',
  templateUrl: './employees-per-position-chart.component.html',
  styleUrls: ['./employees-per-position-chart.component.scss']
})
export class EmployeesPerPositionChartComponent implements OnInit {

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
        data: this.generalInfo.employeesPerPos
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

}
