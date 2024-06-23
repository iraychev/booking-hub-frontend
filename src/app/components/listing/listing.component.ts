import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { Listing } from '../../models/listing.model';
import { AmenitiesPipe } from '../../pipes/amenities.pipe';
import { ButtonComponent } from '../../shared/button/button.component';
import { Booking } from '../../models/booking.model';
import { CalendarComponent } from '../../shared/calendar/calendar.component';
import { BookingService } from '../../services/booking.service';
import { BookingCreationComponent } from "../booking-creation/booking-creation.component";

@Component({
    selector: 'app-listing',
    standalone: true,
    templateUrl: './listing.component.html',
    styleUrl: './listing.component.css',
    imports: [
        CommonModule,
        RouterLink,
        FormsModule,
        AmenitiesPipe,
        ButtonComponent,
        CalendarComponent,
        BookingCreationComponent
    ]
})
export class ListingComponent implements OnInit {

  currentImageIndex: number = 0;
  listing!: Listing;
  bookings: Booking[] = [];
  userId: string = JSON.parse(localStorage.getItem('user') || '{}').id;
  editMode: boolean = false;
  bookedDates: Date[] = [];
  amenities: string[] = [
    'WIFI',
    'PARKING',
    'POOL',
    'GYM',
    'AIR_CONDITIONING',
    'HEATING',
    'KITCHEN',
    'TV',
    'WASHER',
    'DRYER',
  ];
  uploadedFiles: File[] = [];
  showCalendar: boolean = false;
  listingId!: string;
  showModal: boolean = false;
  constructor(
    private apiService: ApiService,
    private router: Router,
    public imageService: ImageService,
    private bookingService: BookingService
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.listingId = navigation?.extras.state?.['listingId'];
  }

  ngOnInit(): void {
    this.fetchListingDetails(this.listingId);
    this.fetchBookings(this.listingId);
    this.fetchBookedDates(this.listingId);
  }
  async fetchBookedDates(id: string | null): Promise<void> {
    if (!id) {
      console.log('Invalid listing ID.');
      return;
    }
    try {
      this.bookedDates = await this.bookingService.calculateBookedDates(id);
      if (this.bookedDates.length === 0) {
        console.log('No booked dates found for this listing.');
        return;
      }

      console.log('Booked Dates:', this.bookedDates);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  }
  openBookingCreation(){
    this.showModal = true;
  }
  closeBookingCreation(){
    this.showModal = false;
  }
  toggleCalendar(): void {
    console.log('showing calendar');

    this.showCalendar = !this.showCalendar;
  }
  fetchBookings(id: string | null): void {
    this.apiService.getBookingsForListing(id!).subscribe((data: Booking[]) => {
      this.bookings = data;
    });
  }

  fetchListingDetails(id: string | null): void {
    if (!id) {
      return;
    }
    this.apiService.getListingById(id).subscribe({
      next: (data) => {
        this.listing = data;
      },
      error: (err) => console.error('Error fetching listing details', err),
    });
  }

  deleteListing(listingId: string): void {
    this.apiService.deleteListingById(listingId).subscribe({
      next: () => {
        console.log(`Listing with id ${listingId} deleted successfully.`);
        this.router.navigate(['/listings']);
      },
      error: (err) => console.error('Error deleting listing', err),
    });
  }
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
  onFileChange(event: any): void {
    if (event.target.files.length + this.listing.images.length <= 5) {
      this.uploadedFiles = Array.from(event.target.files);
    } else {
      alert('A listing can have a maximum of 5 images.');
    }
  }

  toggleAmenity(amenity: string): void {
    const index = this.listing.amenities.indexOf(amenity);
    if (index > -1) {
      this.listing.amenities.splice(index, 1);
      return;
    }
    this.listing.amenities.push(amenity);
  }

  saveChanges() {
    this.imageService
      .mapFilesToImages(this.uploadedFiles)
      .then((images) => {
        this.listing.images = images;
        console.log(this.listing);

        this.apiService.updateListingById(this.listing).subscribe({
          next: (response) => {
            console.log('Listing created successfully:', response);
            this.router.navigate(['/listings']);
          },
          error: (err) => {
            console.error('Error creating listing:', err);
          },
        });
      })
      .catch((err) => {
        console.error('Error mapping files to images:', err);
      });
  }

  getSliderTransform(): string {
    return `translateX(-${this.currentImageIndex * 100}%)`;
  }

  nextImage(): void {
    if (this.currentImageIndex < this.listing.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  onBookNow() {
    throw new Error('Method not implemented.');
    }
}
