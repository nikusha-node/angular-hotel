import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Service } from '../../services/service';
import { pipe, takeUntil, tap, catchError, of, finalize, Subject, } from 'rxjs';
import { roomCard } from '../../models/model.interface';

@Component({
  selector: 'app-rooms',
  imports: [],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss',
})
export class Rooms implements OnInit, OnDestroy {
  public otaxi = inject(Service);
  public toDoData: roomCard[] | undefined;
  public hasError: boolean = false;
  public destroy$ = new Subject();



  ngOnInit() {
    this.otaxi
      .roomsAll()
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => {
          this.toDoData = data as unknown as roomCard[];
        }),
        catchError(() => {
          this.hasError = true;
          return of('error');
        }),
        finalize(() => {
          console.log('final');
        })
      )
      .subscribe();

  }
  ngOnDestroy(): void {
    this.destroy$.next;
    this.destroy$.complete();
  }


}
