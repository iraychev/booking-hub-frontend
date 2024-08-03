import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterLink } from '@angular/router';
import { Subject, lastValueFrom, takeUntil } from 'rxjs';

import { User } from '../../models/user.model';
import { Listing } from '../../models/listing.model';
import { Booking } from '../../models/booking.model';
import { ApiService } from '../../services/api.service';
import { ImageService } from '../../services/image.service';
import { CacheService } from '../../services/cache.service';
import { ErrorService } from '../../services/error.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog/confirmation-dialog.component';
import { AuthService } from '../../services/auth.service';
import { ProfanityFilterService } from '../../services/profanity-filter.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    RouterLink,
    ButtonComponent,
    ConfirmationDialogComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  editMode = false;
  error = '';
  selectedTabIndex = 0;
  personalListings: Listing[] = [];
  personalBookings: Booking[] = [];
  futureBookings: Booking[] = [];
  pastBookings: Booking[] = [];
  selectedFile: File | null = null;

  showConfirmationDialog = false;
  confirmationMessage = '';
  confirmCallback: () => Promise<void> = async () => {};

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private imageService: ImageService,
    private cacheService: CacheService,
    private errorService: ErrorService,
    private authService: AuthService,
    private profanityFilter: ProfanityFilterService
  ) {
    this.user = this.authService.getCurrentUser()!;
  }

  ngOnInit(): void {
    this.fetchUserListings();
    this.fetchUserBookings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  getBookingEndDate(booking: Booking): Date {
    const endDate = new Date(booking.startDate);
    endDate.setDate(endDate.getDate() + booking.nightsToStay);
    return endDate;
  }

  private hasProfanity(): boolean {
    const fields = [
      this.user.username,
      this.user.firstName,
      this.user.lastName,
      this.user.email,
    ];
    if (fields.some((field) => this.profanityFilter.hasProfanity(field))) {
      this.errorService.handleError(
        'Profanity detected',
        'Remove any inappropriate words.'
      );
      return true;
    }
    return false;
  }

  async saveChanges(): Promise<void> {
    if (this.hasProfanity()) return;

    try {
      if (this.selectedFile) {
        await this.assignImage();
      }
      localStorage.setItem('user', JSON.stringify(this.user));
      await lastValueFrom(this.apiService.updateUserById(this.user));
      this.editMode = false;
    } catch (err) {
      this.errorService.handleError('Error updating profile', err);
    }
  }

  cancelEdit(): void {
    this.user = this.authService.getCurrentUser()!;
    this.editMode = false;
  }

  fetchUserListings(): void {
    const cachedListings: Listing[] = this.cacheService.get('userListings');
    if (cachedListings) {
      this.personalListings = cachedListings;
      return;
    }

    this.apiService
      .getAllListingsByUserId(this.user.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (listings) => {
          this.personalListings = this.sortListings(
            listings.filter(
              (listing: Listing) => listing.user?.id === this.user?.id
            )
          );
          this.cacheService.set('userListings', this.personalListings);
        },
        error: (err) =>
          this.errorService.handleError('Error fetching listings', err),
      });
  }

  fetchUserBookings(): void {
    const cachedBookings: Booking[] = this.cacheService.get('userBookings');
    if (cachedBookings) {
      this.personalBookings = cachedBookings;
      this.splitBookings();
      return;
    }

    this.apiService
      .getAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings) => {
          this.personalBookings = this.sortBookings(
            bookings.filter((booking) => booking.renter?.id === this.user?.id)
          );
          this.cacheService.set('userBookings', this.personalBookings);
          this.splitBookings();
        },
        error: (err) =>
          this.errorService.handleError('Error fetching bookings', err),
      });
  }

  splitBookings(): void {
    const now = new Date();
    this.futureBookings = this.personalBookings.filter(
      (booking) => new Date(booking.startDate) > now
    );
    this.pastBookings = this.personalBookings.filter(
      (booking) => new Date(booking.startDate) <= now
    );
  }

  deleteListing(listingId: string): void {
    this.confirmAction(
      'Are you sure you want to delete this listing?',
      async () => {
        try {
          await lastValueFrom(this.apiService.deleteListingById(listingId));
          this.personalListings = this.personalListings.filter(
            (listing) => listing.id !== listingId
          );
          this.cacheService.delete('userListings');
        } catch (err) {
          this.errorService.handleError('Error deleting listing', err);
        }
      }
    );
  }

  deleteBooking(bookingId: string): void {
    this.confirmAction(
      'Are you sure you want to delete this booking?',
      async () => {
        try {
          await lastValueFrom(this.apiService.deleteBookingById(bookingId));
          this.personalBookings = this.personalBookings.filter(
            (booking) => booking.id !== bookingId
          );
          this.splitBookings();
          this.cacheService.delete('userBookings');
        } catch (err) {
          this.errorService.handleError('Error deleting booking', err);
        }
      }
    );
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  confirmAction(message: string, callback: () => Promise<void>): void {
    this.confirmationMessage = message;
    this.confirmCallback = callback;
    this.showConfirmationDialog = true;
  }

  async onConfirmed(confirmed: boolean): Promise<void> {
    this.showConfirmationDialog = false;
    if (confirmed) {
      await this.confirmCallback();
    }
  }

  private async assignImage(): Promise<void> {
    if (this.selectedFile) {
      this.user.profileImage = await this.imageService.mapFileToImage(
        this.selectedFile
      );
    }
  }

  private sortListings(listings: Listing[]): Listing[] {
    return listings.sort((a, b) =>
      (a.user?.id ?? '').localeCompare(b.user?.id ?? '')
    );
  }

  private sortBookings(bookings: Booking[]): Booking[] {
    return bookings.sort((a, b) =>
      (a.renter?.id ?? '').localeCompare(b.renter?.id ?? '')
    );
  }
}
