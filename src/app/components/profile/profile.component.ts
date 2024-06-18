import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';
import { MatTabsModule } from '@angular/material/tabs';
import { Listing } from '../../models/listing.model';
import { RouterLink } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image.model';
import { ButtonComponent } from '../../shared/button/button.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTabsModule,
    RouterLink,
    ButtonComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = JSON.parse(localStorage.getItem('user') || '{}');
  editMode: boolean = false;
  error: string = '';
  selectedTabIndex: number = 0;
  personalListings: Listing[] = [];
  selectedFile!: File;

  constructor(
    public apiService: ApiService,
    private imageService: ImageService
  ) {}

  ngOnInit(): void {
    this.fetchUserListings();
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  async saveChanges(): Promise<void> {
    await this.assignImage();
    console.log(this.user);
    localStorage.setItem('user', JSON.stringify(this.user));
    try {
      const updatedUser = await lastValueFrom(
        this.apiService.updateUserById(this.user)
      );
      console.log('Server response: ', updatedUser);
      this.editMode = false;
    } catch (err) {
      console.error('Error updating profile', err);
      this.error = 'Error updating profile';
    }
  }

  cancelEdit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.editMode = false;
  }

  fetchUserListings(): void {
    this.apiService.fetchListings().subscribe({
      next: (listings: any[]) => {
        this.personalListings = listings.filter(
          (listing) => listing.user.id === this.user!.id
        );
        this.personalListings.sort((a, b) => {
          if (!a.user || !b.user) return 0;
          return a.user.id > b.user.id ? 1 : -1;
        });
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
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async assignImage() {
    this.user.profileImage = await this.imageService.mapFileToImage(
      this.selectedFile
    );
  }
}
