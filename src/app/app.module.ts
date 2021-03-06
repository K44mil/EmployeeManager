import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material';
import { ChartsModule } from 'ng2-charts';

// import fake backend provider 
import { fakeBackendProvider } from './_helpers/fake-backend';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './_components/home/home.component';
import { EmployeesTableComponent } from './_components/employees-table/employees-table.component';
import { RoomsTableComponent } from './_components/rooms-table/rooms-table.component';
import { PositionsTableComponent } from './_components/positions-table/positions-table.component';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { AddRoomComponent } from './_components/add-room/add-room.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { AddPositionComponent } from './_components/add-position/add-position.component';
import { AddEmployeeComponent } from './_components/add-employee/add-employee.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';

import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SideNavComponent } from './_components/side-nav/side-nav.component';
import { EmployeesFilterComponent } from './_components/employees-filter/employees-filter.component';
import { EditRoomComponent } from './_components/edit-room/edit-room.component';
import { EditPositionComponent } from './_components/edit-position/edit-position.component';
import { EditEmployeeComponent } from './_components/edit-employee/edit-employee.component';
import { RoomUsageChartComponent } from './_components/_charts/room-usage-chart/room-usage-chart.component';
import { EmployeesPerPositionChartComponent } from './_components/_charts/employees-per-position-chart/employees-per-position-chart.component';
import { AvgSalaryPerPositionChartComponent } from './_components/_charts/avg-salary-per-position-chart/avg-salary-per-position-chart.component';
import { SalaryPerPositionChartComponent } from './_components/_charts/salary-per-position-chart/salary-per-position-chart.component';
import { RoomDesignerComponent } from './_components/room-designer/room-designer.component';
import { RoomViewComponent } from './_components/room-view/room-view.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EmployeesTableComponent,
    RoomsTableComponent,
    PositionsTableComponent,
    AddRoomComponent,
    AddPositionComponent,
    AddEmployeeComponent,
    SideNavComponent,
    EmployeesFilterComponent,
    EditRoomComponent,
    EditPositionComponent,
    EditEmployeeComponent,
    RoomUsageChartComponent,
    EmployeesPerPositionChartComponent,
    AvgSalaryPerPositionChartComponent,
    SalaryPerPositionChartComponent,
    RoomDesignerComponent,
    RoomViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    ChartsModule,
    MatStepperModule
  ],
  providers: [
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
