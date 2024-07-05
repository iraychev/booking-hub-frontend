import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { FormsModule } from '@angular/forms';
import { Listing } from '../../models/listing.model';
import { User } from '../../models/user.model';

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
  paginatedListings: Listing[] = [];
  searchTerm: string = '';
  errorMessage: string = '';
  currentPage: number = 1;
  listingsPerPage: number = 4;
  totalPages: number = 0;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getListings();
  }

  checkIfUserCantCreateListings(): boolean {
    const user: User = JSON.parse(localStorage.getItem('user')!)
    if(!user){
      return true;
    }
    return !(user.roles.includes('PROPERTY_OWNER') || user.roles.includes('ADMIN'));
  }
  
  getListings(): void {
    this.apiService.getAllListings().subscribe({
      next: (data) => {
        this.listings = data;
        this.filteredListings = [...this.listings];
        this.updatePagination();
      }
    });
  }

  performSearch() {
    if (this.searchTerm.trim() === '') {
      this.filteredListings = [...this.listings];
    } else {
      const lowerCaseSearchTerm = this.searchTerm.trim().toLowerCase();

      this.filteredListings = this.listings.filter(
        (listing) =>
          listing.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          listing.propertyAddress.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    this.updatePagination();
  }

  viewDetails(listingId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.errorMessage = 'You need to be logged in to view listings';
    } else {
      this.router.navigate(['/listing'], { state: { listingId } });
    }
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(
      this.filteredListings.length / this.listingsPerPage
    );
    this.paginateListings();
  }

  paginateListings(): void {
    const startIndex = (this.currentPage - 1) * this.listingsPerPage;
    const endIndex = startIndex + this.listingsPerPage;
    this.paginatedListings = this.filteredListings.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateListings();
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateListings();
    }
  }
}
