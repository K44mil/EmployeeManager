import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Room } from '../_models/room';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private roomsUrl: string = 'http://localhost:4000/rooms';

  constructor(private http: HttpClient) { }

  getRooms() {
    return this.http.get<any[]>(this.roomsUrl);
  }
}