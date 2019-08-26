import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Desk } from '../_models/desk';

@Injectable({
  providedIn: 'root'
})
export class DeskService {

  private desksUrl: string = 'http://localhost:4000/desks';

  constructor(private http: HttpClient) { }

  getAllDesksByRoomId(id: number) {
    return this.http.get<any[]>(`${this.desksUrl}/${id}`);
  }

  update(id: number, desk: Desk) {
    return this.http.put(`${this.desksUrl}/${id}`, desk);
  }
}
