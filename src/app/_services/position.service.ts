import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

  private positionsUrl: string = 'http://localhost:4000/positions'

  constructor(private http: HttpClient) { }

  getPositions() {
    return this.http.get<any[]>(this.positionsUrl);
  }

  delete(id: number) {
    return this.http.delete(`${this.positionsUrl}/${id}`);
  }

  save(position: Position) {
    return this.http.post(`${this.positionsUrl}`, position);
  }

  // getPositionById(id: number) {
  //   return this.http.get<any[]>(`${this.positionsUrl}/${id}`);
  // }

  update(id: number, position: Position) {
    return this.http.put(`${this.positionsUrl}/${id}`, position);
  }
}
