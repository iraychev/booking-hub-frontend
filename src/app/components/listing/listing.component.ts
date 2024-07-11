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
import { BookingCreationComponent } from '../booking-creation/booking-creation.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { User } from '../../models/user.model';
import { CacheService } from '../../services/cache.service';
import { AuthService } from '../../services/auth.service';
import { ProfanityFilterService } from '../../services/profanity-filter.service';
import { ErrorService } from '../../services/error.service';

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
    BookingCreationComponent,
    ConfirmationDialogComponent,
  ],
})
export class ListingComponent implements OnInit {
  currentImageIndex: number = 0;
  listing!: Listing;
  bookings: Booking[] = [];
  userId: string = this.authService.getCurrentUser()!.id;
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

  showConfirmationDialog: boolean = false;
  confirmationMessage: string = '';
  confirmCallback: any = () => {};

  constructor(
    private apiService: ApiService,
    private router: Router,
    public imageService: ImageService,
    private bookingService: BookingService,
    private cacheService: CacheService,
    private authService: AuthService,
    private profanityFilter: ProfanityFilterService,
    private errorService: ErrorService
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
      return;
    }
    this.bookedDates = await this.bookingService.calculateBookedDates(id);
    if (this.bookedDates.length === 0) {
      return;
    }
  }
  openBookingCreation() {
    if (this.checkIfUserCantCreateBookings()){
      return;
    }
    this.showModal = true;
  }
  closeBookingCreation() {
    this.showModal = false;
  }
  toggleCalendar(): void {

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
      }
    });
  }

  deleteListing(listingId: string): void {
    this.confirmAction('Are you sure you want to delete this listing?', () => {
      this.apiService.deleteListingById(listingId).subscribe({
        next: () => {
          this.router.navigate(['/listings']);
        }
      });
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
    if (this.hasProfanity()) {
      this.errorService.handleError('Listing edit failed', 'Profanity detected in the listing. Please remove any inappropriate language.');
      return;
    }

    this.imageService
      .mapFilesToImages(this.uploadedFiles)
      .then((images) => {
        this.listing.images = images;

        this.apiService.updateListingById(this.listing).subscribe({
          next: (response) => {
            this.router.navigate(['/listings']);
            this.cacheService.delete('listings');

          }
        });
      })
  }
  private hasProfanity(): boolean {
    const textToCheck = [
      this.listing.title,
      this.listing.description,
      this.listing.propertyAddress,
    ].join(' ');

    return this.profanityFilter.hasProfanity(textToCheck);
  }
  checkIfUserCantCreateBookings(): boolean {
    const user: User = this.authService.getCurrentUser()!;
    console.log(user);
    return !(user.roles.includes('RENTER') || user.roles.includes('ADMIN'));
  }
  
  confirmAction(message: string, callback: () => void): void {
    this.confirmationMessage = message;
    this.confirmCallback = callback;
    this.showConfirmationDialog = true;
  }

  onConfirmed(confirmed: boolean): void {
    this.showConfirmationDialog = false;
    if (confirmed) {
      this.confirmCallback();
    }
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
}
