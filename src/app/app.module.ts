import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

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

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EmployeesTableComponent,
    RoomsTableComponent,
    PositionsTableComponent,
    AddRoomComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
