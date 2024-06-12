import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Listing } from '../../models/listing.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTabsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = JSON.parse(localStorage.getItem('user') || '{}');
  editMode: boolean = false;
  error: string = '';
  selectedTabIndex: number = 0;
  personalListings: Listing[] = [];
  constructor(public apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchUserListings();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    localStorage.setItem('user', JSON.stringify(this.user));
    this.apiService.updateUserById(this.user).subscribe({
      next: (updatedUser) => {
        console.log('Server reponse: ', updatedUser);

        this.editMode = false;
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.error = 'Error updating profile';
      },
    });
  }

  cancelEdit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.editMode = false;
  }

  fetchUserListings(): void {
    this.apiService.fetchListings().subscribe({
      next: (listings: any[]) => {
        this.personalListings = listings.filter(
          (listing) => listing.user.id === this.user.id
        );
        this.personalListings.sort((a, b) => (a.user.id > b.user.id ? 1 : -1));
      },
      error: (err) => {
        console.error('Error fetching listings:', err);
        this.error = 'Error fetching listings';
      },
    });
  }

  deleteListing(listingId: string): void {
    console.log('Deleting listing with id ' + listingId);
    this.apiService.deleteListingById(listingId).subscribe({
      next: (response) => {
        console.log('Listing deleted successfully', response);
        this.personalListings = this.personalListings.filter(
          (listing) => listing.id !== listingId
        );
      },
      error: (err) => {
        console.error('Error deleting listing', err);
        this.error = 'Error deleting listing: ' + err.message;
      },
    });
  }
}
