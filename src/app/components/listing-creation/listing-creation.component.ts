import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Listing } from '../../models/listing.model';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../shared/button/button.component';
import { Image } from '../../models/image';
import { ImageService } from '../../services/image.service';
import { AmenitiesPipe } from "../../pipes/amenities.pipe";

@Component({
    selector: 'app-listing-creation',
    standalone: true,
    templateUrl: './listing-creation.component.html',
    styleUrl: './listing-creation.component.css',
    imports: [RouterLink, CommonModule, FormsModule, ButtonComponent, AmenitiesPipe]
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
  uploadedFiles: File[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private imageService: ImageService
  ) {
    this.columns = this.chunkArray(this.amenities, 3);
  }

  createListing(): void {
    this.imageService
      .mapFilesToImages(this.uploadedFiles)
      .then((images) => {
        this.listing.images = images;
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
      })
      .catch((err) => {
        console.error('Error mapping files to images:', err);
        this.error = err;
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
  onFileChange(event: any): void {
    if (event.target.files.length + this.listing.images.length <= 5) {
      this.uploadedFiles = Array.from(event.target.files);
    } else {
      alert('You can upload a maximum of 5 images.');
    }
  }
}
