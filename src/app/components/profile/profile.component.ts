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
  user: User = JSON.parse(localStorage.getItem('user') || '{}');
  editMode: boolean = false;
  error: string = '';
  selectedTabIndex: number = 0;
  personalListings: Listing[] = [];
  personalBookings: Booking[] = [];
  selectedFile!: File;

  showConfirmationDialog: boolean = false;
  confirmationMessage: string = '';
  confirmCallback: () => Promise<void> = async () => {};

  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private imageService: ImageService,
    private cacheService: CacheService,
    private errorService: ErrorService
  ) {}

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

  async saveChanges(): Promise<void> {
    try {
      if (this.selectedFile) {
        await this.assignImage();
      }
      localStorage.setItem('user', JSON.stringify(this.user));
      const updatedUser = await lastValueFrom(
        this.apiService.updateUserById(this.user)
      );
      this.editMode = false;
    } catch (err) {
      this.errorService.handleError('Error updating profile', err);
    }
  }

  cancelEdit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.editMode = false;
  }

  fetchUserListings(): void {
    const cachedListings = this.cacheService.get('userListings');
    if (cachedListings) {
      this.personalListings = cachedListings;
      return;
    }

    this.apiService.getAllListings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (listings: Listing[]) => {
          this.personalListings = this.sortListings(
            listings.filter((listing) => listing.user?.id === this.user?.id)
          );
          this.cacheService.set('userListings', this.personalListings);
        },
        error: (err) => {
          this.errorService.handleError('Error fetching listings', err);
        },
      });
  }

  fetchUserBookings(): void {
    const cachedBookings = this.cacheService.get('userBookings');
    if (cachedBookings) {
      this.personalBookings = cachedBookings;
      return;
    }

    this.apiService.getAllBookings()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (bookings: Booking[]) => {
          this.personalBookings = this.sortBookings(
            bookings.filter((booking) => booking.renter?.id === this.user?.id)
          );
          this.cacheService.set('userBookings', this.personalBookings);
        },
        error: (err) => {
          this.errorService.handleError('Error fetching bookings', err);
        },
      });
  }

  async deleteListing(listingId: string): Promise<void> {
    this.confirmAction('Are you sure you want to delete this listing?', async () => {
      try {
        await lastValueFrom(this.apiService.deleteListingById(listingId));
        this.personalListings = this.personalListings.filter(
          (listing) => listing.id !== listingId
        );
        this.cacheService.delete('userListings');
      } catch (err) {
        this.errorService.handleError('Error deleting listing', err);
      }
    });
  }

  async deleteBooking(bookingId: string): Promise<void> {
    this.confirmAction('Are you sure you want to delete this booking?', async () => {
      try {
        await lastValueFrom(this.apiService.deleteBookingById(bookingId));
        this.personalBookings = this.personalBookings.filter(
          (booking) => booking.id !== bookingId
        );
        this.cacheService.delete('userBookings');
      } catch (err) {
        this.errorService.handleError('Error deleting booking', err);
      }
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
    this.user.profileImage = await this.imageService.mapFileToImage(
      this.selectedFile
    );
  }

  private sortListings(listings: Listing[]): Listing[] {
    return listings.sort((a, b) => {
      if (!a.user?.id || !b.user?.id) return 0;
      return a.user.id.localeCompare(b.user.id);
    });
  }

  private sortBookings(bookings: Booking[]): Booking[] {
    return bookings.sort((a, b) => {
      if (!a.renter?.id || !b.renter?.id) return 0;
      return a.renter.id.localeCompare(b.renter.id);
    });
  }
}