import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styleUrls: ['./listings.component.css'],
})
export class ListingsComponent implements OnInit {
  listings: any[] = [];
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
      },
      error: (err) => console.error('Error fetching listings', err),
    });
  }

  viewDetails(listingId: string): void {
    if (!this.authService.isLoggedIn$.value) {
      this.errorMessage = 'You need to be logged in to view listings';
    } else {
      this.router.navigate(['/listing-details', listingId]);
    }
  }
}
