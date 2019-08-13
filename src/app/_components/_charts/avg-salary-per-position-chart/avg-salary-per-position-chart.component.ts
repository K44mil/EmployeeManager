import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-avg-salary-per-position-chart',
  templateUrl: './avg-salary-per-position-chart.component.html',
  styleUrls: ['./avg-salary-per-position-chart.component.scss']
})
export class AvgSalaryPerPositionChartComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  public barChartLabels = ['test', 'test'];
  public barChartType = 'doughnut';
  public barChartLegend = 'true';

  public barChartData = [
    {data: [1, 2],
    label: 'Employees per position'}
  ]; 

  constructor() { }

  ngOnInit() {
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
