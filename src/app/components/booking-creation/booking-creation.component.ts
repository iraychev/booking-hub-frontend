import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Booking } from '../../models/booking.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Listing } from '../../models/listing.model';
import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-creation',
  standalone: true,
  templateUrl: './booking-creation.component.html',
  styleUrl: './booking-creation.component.css',
  imports: [FormsModule, CalendarComponent, CommonModule, ButtonComponent],
})

export class BookingCreationComponent {
  booking: Booking = new Booking();
  error: string = '';
  selectedDates: Date[] = [];

  @Input() bookedDates: Date[] = [];
  @Input() isVisible = false;
  @Input() listing!: Listing;
  @Output() close = new EventEmitter<void>();

  constructor(private apiService: ApiService, private router: Router, private authservice: AuthService) {}

  receiveSelectedDates(selectedDates: Date[]): void {
    this.selectedDates = selectedDates.sort((a, b) => a.getTime() - b.getTime());;
  }

  closeModal() {
    this.close.emit();
  }

  getPrice() {
    return this.selectedDates.length * this.listing.price!;
  }

  createBooking() {
    const listing: Listing = new Listing();
    listing.id = this.listing.id;
    this.booking.listing = listing;

    const renter: User = new User();
    renter.id = JSON.parse(this.authservice.getCurrentUser()!.id);
    this.booking.renter = renter;

    this.booking.nightsToStay = this.selectedDates.length;
    this.booking.price = this.listing.price! * this.booking.nightsToStay;
    this.booking.startDate = this.selectedDates[0];

    this.apiService.createBooking(this.booking).subscribe({
      next: (response) => {
        this.router.navigate(['/booking'], {
          state: { bookingId: response.id },
        });
      },
      error: (err) => {
        this.error = err;
      },
    });
  }
}
