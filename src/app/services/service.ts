import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rooms } from '../main pages/rooms/rooms';
import { Home } from '../main pages/home/home';
import { roomCard } from '../models/model.interface';

@Injectable({
  providedIn: 'root',
})
export class Service {
  public http = inject(HttpClient)

  public roomsAll(): Observable<roomCard[]> {
    return this.http.get<roomCard[]>(
      "https://hotelbooking.stepprojects.ge/api/Rooms/GetAll"
    )
  }

  public getRoomById(id: number): Observable<roomCard> {
    return this.http.get<roomCard>(
      `https://hotelbooking.stepprojects.ge/api/Rooms/GetRoom/${id}`
    )
  }
}
