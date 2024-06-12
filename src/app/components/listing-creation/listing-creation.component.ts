import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Listing } from '../../models/listing.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-listing-creation',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './listing-creation.component.html',
  styleUrl: './listing-creation.component.css',
})
export class ListingCreationComponent {
  listing: Listing = new Listing();
  error: string = '';
  selectedAmenities: any = {};
  columns: string[][];
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

  constructor(private apiService: ApiService, private router: Router) {
    const columnSize = Math.ceil(this.amenities.length / 3);
    this.columns = this.chunkArray(this.amenities, columnSize);
  }

  createListing(): void {
    this.listing.amenities = this.getSelectedAmenities();
    console.log(this.listing);
    this.apiService.createListing(this.listing).subscribe({
      next: (response) => {
        console.log('Listing created successfully:', response);
        this.router.navigate(['/listings']);
      },
      error: (err) => {
        console.error('Error creating listing:', err);
        this.error = err;
      },
    });
  }

  getSelectedAmenities(): string[] {
    return Object.keys(this.selectedAmenities).filter(
      (amenity) => this.selectedAmenities[amenity]
    );
  }

  chunkArray(array: any[], size: number): any[][] {
    const chunkedArray = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArray.push(array.slice(i, i + size));
    }
    return chunkedArray;
  }
}
