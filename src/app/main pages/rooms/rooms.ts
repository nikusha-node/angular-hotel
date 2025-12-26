import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Service } from '../../services/service';
import { pipe, takeUntil, tap, catchError, of, finalize, Subject, } from 'rxjs';
import { roomCard, RoomFilter } from '../../models/model.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rooms',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.scss',
})
export class Rooms implements OnInit, OnDestroy {
  public otaxi = inject(Service);
  public toDoData: roomCard[] | undefined;
  public hasError: boolean = false;
  public destroy$ = new Subject();
  public filterForm: FormGroup;
  public roomTypes = ['All', 'Single Room', 'Double Room', 'Deluxe Room'];
  public selectedRoomTypes: string[] = [];

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      checkIn: [''],
      checkOut: [''],
      adults: [1],
      roomType: ['All'],
      minPrice: [0],
      maxPrice: [1000]
    });
  }



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

  applyFilter(): void {
    console.log('=== APPLY FILTER CLICKED ===');
    
    const roomTypeMap: { [key: string]: number } = {
      'All': 0,
      'Single Room': 1,
      'Double Room': 2,
      'Deluxe Room': 3
    };

    // Get form values
    const checkInValue = this.filterForm.get('checkIn')?.value;
    const checkOutValue = this.filterForm.get('checkOut')?.value;
    const adultsValue = this.filterForm.get('adults')?.value;
    const roomTypeValue = this.filterForm.get('roomType')?.value;
    const minPriceValue = this.filterForm.get('minPrice')?.value;
    const maxPriceValue = this.filterForm.get('maxPrice')?.value;

    console.log('Raw form values:', {
      checkInValue,
      checkOutValue,
      adultsValue,
      roomTypeValue,
      minPriceValue,
      maxPriceValue
    });

    // Simple test: if no dates, just use all rooms and filter client-side
    if (!checkInValue && !checkOutValue) {
      console.log('NO DATES - Using GetAll API with client-side filtering');
      
      this.otaxi.roomsAll()
        .pipe(
          takeUntil(this.destroy$),
          tap((allRooms) => {
            console.log('All rooms received:', allRooms);
            
            // Filter rooms client-side
            const filteredRooms = this.filterRoomsByCriteria(allRooms, {
              roomTypeId: roomTypeMap[roomTypeValue || 'All'] || 0,
              priceFrom: minPriceValue || 0,
              priceTo: maxPriceValue || 1000,
              maximumGuests: adultsValue || 0
            });
            
            this.toDoData = filteredRooms;
            console.log('Filtered rooms:', filteredRooms);
          }),
          catchError((error) => {
            console.error('GetAll error:', error);
            this.hasError = true;
            return of([]);
          })
        )
        .subscribe();
      return;
    }

    // If dates are provided, use availability API
    console.log('DATES PROVIDED - Using availability check');
    const fromDate = new Date(checkInValue).toISOString();
    const toDate = new Date(checkOutValue).toISOString();
    
    this.otaxi.getAvailableRooms(fromDate, toDate)
      .pipe(
        takeUntil(this.destroy$),
        tap((availableRooms) => {
          console.log('Available rooms:', availableRooms);
          
          // Filter available rooms by other criteria
          const filteredRooms = this.filterRoomsByCriteria(availableRooms, {
            roomTypeId: roomTypeMap[roomTypeValue || 'All'] || 0,
            priceFrom: minPriceValue || 0,
            priceTo: maxPriceValue || 1000,
            maximumGuests: adultsValue || 0
          });
          
          this.toDoData = filteredRooms;
        }),
        catchError((error) => {
          console.error('Availability error:', error);
          this.hasError = true;
          return of([]);
        })
      )
      .subscribe();
  }

  resetFilter(): void {
    this.filterForm.reset({
      checkIn: '',
      checkOut: '',
      adults: 1,
      roomType: 'All',
      minPrice: 0,
      maxPrice: 1000
    });
    
    // Reload all rooms
    this.otaxi
      .roomsAll()
      .pipe(
        takeUntil(this.destroy$),
        tap((data) => {
          this.toDoData = data as unknown as roomCard[];
        }),
        catchError((error) => {
          console.error('Reset error:', error);
          this.hasError = true;
          return of([]);
        })
      )
      .subscribe();
  }

  selectRoomType(type: string): void {
    this.filterForm.get('roomType')?.setValue(type);
  }

  filterRoomsByCriteria(rooms: roomCard[], criteria: any): roomCard[] {
    console.log('Filtering rooms by criteria:', criteria);
    console.log('Available rooms before filtering:', rooms);
    
    const filteredRooms = rooms.filter(room => {
      console.log('Checking room:', room.name, 'Price:', room.pricePerNight, 'Guests:', room.maximumGuests, 'Type:', room.roomTypeId);
      
      // Room type filter
      if (criteria.roomTypeId !== 0 && room.roomTypeId !== criteria.roomTypeId) {
        console.log('Filtered out by room type:', criteria.roomTypeId);
        return false;
      }
      
      // Price filter
      if (room.pricePerNight < criteria.priceFrom || room.pricePerNight > criteria.priceTo) {
        console.log('Filtered out by price:', room.pricePerNight, 'not in range', criteria.priceFrom, '-', criteria.priceTo);
        return false;
      }
      
      // Guests filter
      if (room.maximumGuests < criteria.maximumGuests) {
        console.log('Filtered out by guests:', room.maximumGuests, '<', criteria.maximumGuests);
        return false;
      }
      
      console.log('Room passed all filters:', room.name);
      return true;
    });
    
    console.log('Rooms after filtering:', filteredRooms);
    return filteredRooms;
  }


}
