import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Service } from '../../services/service';
import { pipe, takeUntil, tap, catchError, of, finalize, Subject } from 'rxjs';
import { roomCard } from '../../models/model.interface';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  public service = inject(Service);
  public roomsData: roomCard[] | undefined;
  public hasError: boolean = false;
  public destroy$ = new Subject();

  ngOnInit() {
    this.service
      .roomsAll()
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => {
          this.roomsData = data as unknown as roomCard[];
        }),
        catchError(() => {
          this.hasError = true;
          return of('error');
        }),
        finalize(() => {
          console.log('Rooms data loaded');
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next; 
    this.destroy$.complete();
  }
}
