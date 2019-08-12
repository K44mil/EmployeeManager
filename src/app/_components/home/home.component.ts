import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public barChartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  }

  public barChartLabels = ['Programmer', 'Recepcionist', 'Project Manager', 'Free space'];
  public barChartType = 'doughnut';
  public barChartLegend = 'true';

  public barChartData = [
    {data: [4, 2, 1, 3], label: 'Room usage'}
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
