import { Component, OnInit } from '@angular/core';

import { PositionService } from '../../_services/position.service';
import { first } from 'rxjs/operators';
import { Position } from '../../_models/position';
import { NgxSmartModalService } from 'ngx-smart-modal';

@Component({
  selector: 'app-positions-table',
  templateUrl: './positions-table.component.html',
  styleUrls: ['./positions-table.component.scss']
})
export class PositionsTableComponent implements OnInit {

  positions: Position[] = null;

  // Pagination values
  currentPage: number = 1;
  positionsPerPage: number = 5;
  // !--Pagination values

  constructor(
    private positionService: PositionService,
    private ngxSmartModalService: NgxSmartModalService
    ) { }

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

  addPosition() {
    this.ngxSmartModalService.getModal('positionModal').open();
  }

}
