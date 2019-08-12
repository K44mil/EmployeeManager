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

  public barChartLabels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = 'true';

  public barChartData = [
    {data: [65, 59, 90, 81, 56, 55, 40], label: 'Seria A'},
    {data: [55, 53, 95, 85, 52, 51, 49], label: 'Seria B'}
  ];

  constructor() { }

  ngOnInit() {
    
  }


}
