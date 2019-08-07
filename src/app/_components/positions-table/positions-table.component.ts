import { Component, OnInit } from '@angular/core';

import { PositionService } from '../../_services/position.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-positions-table',
  templateUrl: './positions-table.component.html',
  styleUrls: ['./positions-table.component.scss']
})
export class PositionsTableComponent implements OnInit {

  positions = [];

  constructor(private positionService: PositionService) { }

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
    this.positionService.getPositions()
      .pipe(first())
      .subscribe(positions => this.positions = positions);
  }

}
