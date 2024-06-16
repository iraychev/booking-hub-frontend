import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ImageService } from '../../services/image.service';
import { Image } from '../../models/image';
import { Listing } from '../../models/listing.model';
import { AmenitiesPipe } from '../../pipes/amenities.pipe';
import { ButtonComponent } from '../../shared/button/button.component';
@Component({
  selector: 'app-listing-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    AmenitiesPipe,
    ButtonComponent,
  ],
  templateUrl: './listing-details.component.html',
  styleUrl: './listing-details.component.css',
})
export class ListingDetailsComponent implements OnInit {
  currentImageIndex: number = 0;
  listing!: Listing;
  userId: string = JSON.parse(localStorage.getItem('user') || '{}').id;
  editMode: boolean = false;
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
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
    private imageService: ImageService
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
  deleteListing(listingId: string): void {
    this.apiService.deleteListingById(listingId).subscribe({
      next: () => {
        console.log(`Listing with id ${listingId} deleted successfully.`);
        this.router.navigate(['/listings']);
      },
      error: (err) => console.error('Error deleting listing', err),
    });
  }
  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }
  onFileChange(event: any): void {
    if (event.target.files.length + this.listing.images.length <= 5) {
      this.uploadedFiles = Array.from(event.target.files);
    } else {
      alert('You can upload a maximum of 5 images.');
    }
  }

  toggleAmenity(amenity: string): void {
    const index = this.listing.amenities.indexOf(amenity);
    if (index > -1) {
      this.listing.amenities.splice(index, 1);
    } else {
      this.listing.amenities.push(amenity);
    }
  }

  async saveChanges() {
    var uploadedImages: Image[] = [];

    try {
      for (const file of this.uploadedFiles) {
        var image: Image = new Image();

        try {
          const response = await this.imageService
            .uploadImage(file)
            .toPromise();
          uploadedImages.push(response!);
        } catch (err) {
          console.log('Error: ', err);
        }
      }

      this.listing.images = uploadedImages.map((image) =>
        JSON.parse(JSON.stringify(image))
      );

      try {
        const updatedListing = await this.apiService
          .updateListingById(this.listing)
          .toPromise();
        this.listing = updatedListing;
        this.toggleEditMode();
      } catch (err) {
        console.error('Error updating listing', err);
      }
    } catch (error) {
      console.error('Error during file upload', error);
    }
  }
  getSliderTransform(): string {
    return `translateX(-${this.currentImageIndex * 100}%)`;
  }

  nextImage(): void {
    if (this.currentImageIndex < this.listing.images.length - 1) {
      this.currentImageIndex++;
    }
  }

  prevImage(): void {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }
}
