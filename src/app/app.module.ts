import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material';

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
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { SideNavComponent } from './_components/side-nav/side-nav.component';
import { EmployeesFilterComponent } from './_components/employees-filter/employees-filter.component';
import { EditRoomComponent } from './_components/edit-room/edit-room.component';

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
    MatListModule
  ],
  providers: [
    fakeBackendProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
