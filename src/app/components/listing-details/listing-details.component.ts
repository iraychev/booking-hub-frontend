import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listing-details.component.html',
  styleUrl: './listing-details.component.css'
})
export class ListingDetailsComponent implements OnInit {
  listing: any;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

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
        error: (err) => console.error('Error fetching listing details', err)
      });
    }
  }
}