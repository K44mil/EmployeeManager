import { Component, OnInit } from '@angular/core';

import { PositionService } from '../../_services/position.service';
import { first } from 'rxjs/operators';
import { Position } from '../../_models/position';

@Component({
  selector: 'app-positions-table',
  templateUrl: './positions-table.component.html',
  styleUrls: ['./positions-table.component.scss']
})
export class PositionsTableComponent implements OnInit {

  positions: Position[] = null;

  constructor(private positionService: PositionService) { }

  ngOnInit() {
    this.loadPositions();
  }

  loadPositions() {
    this.positionService.getPositions()
      .pipe(first())
      .subscribe(positions => this.positions = positions);
  }

  deletePosition(id: number) {
    this.positionService.delete(id)
      .pipe(first())
      .subscribe(() => this.loadPositions());
  }

}
