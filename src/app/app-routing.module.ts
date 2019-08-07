import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './_components/home/home.component';
import { EmployeesTableComponent } from './_components/employees-table/employees-table.component';
import { RoomsTableComponent } from './_components/rooms-table/rooms-table.component';
import { PositionsTableComponent } from './_components/positions-table/positions-table.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'employees', component: EmployeesTableComponent},
  { path: 'rooms', component: RoomsTableComponent},
  { path: 'positions', component: PositionsTableComponent},
  // default path
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
