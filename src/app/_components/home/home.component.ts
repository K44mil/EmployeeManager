import { Component, OnInit, OnChanges } from '@angular/core';
import { DataService } from 'src/app/_services/data.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  generalInfo: any;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.dataService.getGeneralInfo()
      .pipe(first())
      .subscribe(
        gI => this.generalInfo = gI
      );

  }

  showGeneralInfoInConsole() {
    console.log(this.generalInfo);
  }

}
