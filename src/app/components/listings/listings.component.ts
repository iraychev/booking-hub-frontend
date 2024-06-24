import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { FormsModule } from '@angular/forms';
import { Listing } from '../../models/listing.model';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, FormsModule],
  styleUrls: ['./listings.component.css'],
})
export class ListingsComponent implements OnInit {
  listings: Listing[] = [];
  filteredListings: Listing[] = [];
  searchTerm: string = ''; 
  errorMessage: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getListings();
  }

  getListings(): void {
    console.log('Getting listings');
    this.apiService.fetchListings().subscribe({
      next: (data) => {
        this.listings = data;
        this.filteredListings = [...this.listings];
      },
      error: (err) => console.error('Error fetching listings', err),
    });
  }

  performSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredListings = [...this.listings];
    } else {
      const lowerCaseSearchTerm = this.searchTerm.trim().toLowerCase();

      this.filteredListings = this.listings.filter(listing =>
        listing.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        listing.propertyAddress.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
  }

  viewDetails(listingId: string): void {
    if (!this.authService.isLoggedIn$.value) {
      this.errorMessage = 'You need to be logged in to view listings';
    } else {
      this.router.navigate(['/listing'], { state: { listingId } });
    }
  }
}
