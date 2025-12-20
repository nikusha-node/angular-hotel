import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Rooms } from '../main pages/rooms/rooms';

@Injectable({
  providedIn: 'root',
})
export class Service {
  public http = inject(HttpClient)

  public roomsAll():Observable<Rooms> {
    return this.http.get<Rooms>(
      "https://hotelbooking.stepprojects.ge/api/Rooms/GetAll"
    )
  }
}
