import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Booking } from '../models/booking.model';
import { lastValueFrom } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(public apiService: ApiService) { }


  async calculateBookedDates(listingId: string): Promise<Date[]> {
    
    const bookings: Booking[] = await lastValueFrom(this.apiService.getBookingsForListing(listingId));
    const bookedDates: Date[] = [];
    bookings.forEach(booking => {
      const startDate = new Date(booking.startDate);
      const nightsToStay = booking.nightsToStay;
      for (let i = 0; i < nightsToStay; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        bookedDates.push(date);
      }
    });
    return bookedDates;
  }
}
