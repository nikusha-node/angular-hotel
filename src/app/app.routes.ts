import { Routes } from '@angular/router';
import { Home } from './main pages/home/home';
import { Rooms } from './main pages/rooms/rooms';
import { Hotels } from './main pages/hotels/hotels';
import { BookedRooms } from './main pages/booked-rooms/booked-rooms';

export const routes: Routes = [
    {
        path: '',
        component:Home
    },
    {
        path: 'rooms',
        component:Rooms
    },
    {
        path: 'hotels',
        component:Hotels
    },
    {
        path: 'bookedrooms',
        component:BookedRooms
    }
];
