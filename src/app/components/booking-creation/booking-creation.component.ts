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

  constructor(private apiService: ApiService, private router: Router) {}

  @Input() bookedDates: Date[] = [];
  @Input() isVisible = false;
  @Input() listing!: Listing;
  @Output() close = new EventEmitter<void>();
  selectedDates: Date[] = [];

  receiveSelectedDates(selectedDates: Date[]): void {
    this.selectedDates = selectedDates;
    console.log('Selected Dates:', this.selectedDates);
  }
  closeModal() {
    this.close.emit();
  }

  createBooking() {
    this.selectedDates.sort((a, b) => a.getTime() - b.getTime());
    console.log("sorted dates:");
    console.log(this.selectedDates);
    
    const listing: Listing = new Listing();
    listing.id = this.listing.id;
    
    this.booking.listing = listing;

    const renter: User = new User();
    renter.id = JSON.parse(localStorage.getItem('user') || '{}').id;
    this.booking.renter = renter;

    this.booking.nightsToStay = this.selectedDates.length;
    this.booking.price = this.listing.price! * this.booking.nightsToStay;
    this.booking.startDate = this.selectedDates[0];
    
    console.log(this.listing);
    console.log(this.booking);

    this.apiService.createBooking(this.booking).subscribe({
      next: (response) => {
        console.log('Booking created successfully:', response);
        this.router.navigate(['/booking'], { state: { bookingId : response.id } });

      },
      error: (err) => {
        console.error('Error creating booking:', err);
        this.error = err;
      },
    });
  }
}
