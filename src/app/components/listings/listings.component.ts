import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { ButtonComponent } from '../../shared/button/button.component';
import { Listing } from '../../models/listing.model';
import { Page } from '../../models/page.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, FormsModule],
  styleUrls: ['./listings.component.css'],
})
export class ListingsComponent implements OnInit, OnDestroy {
  listings: Listing[] = [];
  paginatedListings: Listing[] = [];
  searchTerm: string = '';
  currentPage: number = 0;
  listingsPerPage: number = 4;
  totalPages: number = 0;
  private destroy$ = new Subject<void>();

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private errorService: ErrorService
  ) {}

  ngOnInit(): void {
    this.getListings();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkIfUserCantCreateListings(): boolean {
    const user: User | null = this.authService.getCurrentUser();
    if (!user) {
      return true;
    }
    return !(
      user.roles.includes('PROPERTY_OWNER') || user.roles.includes('ADMIN')
    );
  }

  getListings(): void {
    this.apiService
      .getListings(this.currentPage, this.listingsPerPage, this.searchTerm)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Page<Listing>) => {
          this.listings = data.content;
          this.paginatedListings = data.content;
          this.totalPages = data.totalPages;
          this.currentPage = data.number;
        },
        error: (err) => {
          this.errorService.handleError('Failed to fetch listings', err);
        },
      });
  }

  performSearch(): void {
    this.currentPage = 0;
    this.getListings();
  }

  viewDetails(listingId: string): void {
    if (!this.authService.isAuthenticated()) {
      this.errorService.handleError(
        'Authentication required',
        'You need to be logged in to view listings'
      );
    } else {
      this.router.navigate(['/listing'], { state: { listingId } });
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.getListings();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.getListings();
    }
  }
}
