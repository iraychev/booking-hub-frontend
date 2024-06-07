import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./listings.component.css'],
})
export class ListingsComponent implements OnInit {
  listings: any[] = [];

  constructor(private apiService: ApiService, private router: Router) {}

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
    this.router.navigate(['/listing-details', listingId]);
  }
}
