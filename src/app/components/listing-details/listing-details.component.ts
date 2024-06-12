import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './listing-details.component.html',
  styleUrl: './listing-details.component.css',
})
export class ListingDetailsComponent implements OnInit {
  listing: any;
  userId: string = JSON.parse(localStorage.getItem('user') || '{}').id;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const listingId = this.route.snapshot.paramMap.get('id');
    this.fetchListingDetails(listingId);
  }

  fetchListingDetails(id: string | null): void {
    if (id) {
      this.apiService.getListingById(id).subscribe({
        next: (data) => {
          this.listing = data;
        },
        error: (err) => console.error('Error fetching listing details', err),
      });
    }
  }
  editListing(): void {
    this.router.navigate(['/listing-edit', this.listing.id]);
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
}
