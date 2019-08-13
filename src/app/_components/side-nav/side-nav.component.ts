import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';

import { ROOMS } from '../../_database/mock-rooms';
import { POSITIONS } from '../../_database/mock-positions';
import { EMPLOYEES } from '../../_database/mock-employees';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      share()
    );

  constructor(private breakpointObserver: BreakpointObserver) {}

  loadDefaultData() {
    localStorage.setItem('rooms', JSON.stringify(ROOMS));
    localStorage.setItem('positions', JSON.stringify(POSITIONS));
    localStorage.setItem('employees', JSON.stringify(EMPLOYEES));
    window.location.reload();
  }
}
