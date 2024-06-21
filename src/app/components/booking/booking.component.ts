import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Booking } from '../../models/booking.model';
import { ApiService } from '../../services/api.service';
import { DatePipe, NgIf } from '@angular/common';
import { CalendarComponent } from '../../shared/calendar/calendar.component';

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.component.html',
  styleUrl: './booking.component.css',
  imports: [NgIf, DatePipe, CalendarComponent, RouterLink],
})
export class BookingComponent implements OnInit {
  bookingId: string;
  booking!: Booking;
  bookedDates: Date[] = [];
  totalPrice: number = 0.0;

  constructor(private router: Router, private apiService: ApiService) {
    const navigation = this.router.getCurrentNavigation();
    this.bookingId = navigation?.extras.state?.['bookingId'];
  }

  async ngOnInit(): Promise<void> {
    await this.fetchBookingDetails(this.bookingId);
    console.log(this.booking);
    this.setBookedDates();
    this.totalPrice = this.booking.listing.price! * this.booking.nightsToStay;
  }

  setBookedDates() {
    const startDate = new Date(this.booking.startDate);
    const nightsToStay = this.booking.nightsToStay;
    for (let i = 0; i < nightsToStay; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      this.bookedDates.push(date);
    }
  }
  fetchBookingDetails(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.apiService.getBookingById(id).subscribe({
        next: (data) => {
          this.booking = data;
          resolve();
        },
        error: (err) => {
          console.error('Error fetching booking details', err);
          reject(err);
        },
      });
    });
  }

  getCheckoutDate(): Date | null {
    if (this.bookedDates.length === 0) {
      return null;
    }
    const lastBookedDate = this.bookedDates[this.bookedDates.length - 1];
    const checkoutDate = new Date(lastBookedDate);
    checkoutDate.setDate(checkoutDate.getDate() + 1);
    return checkoutDate;
  }
  
  getProfileImageData(): string {
    const user = this.booking.listing.user;
    if (user && user.profileImage) {
      return (
        'data:' + user.profileImage.type + ';base64,' + user.profileImage.data
      );
    }
    return '';
  }
}
