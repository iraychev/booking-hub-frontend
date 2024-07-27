import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    public imageService: ImageService
  ) {}

  getProfileImageData(): string {
    return this.authService.isAuthenticated()
      ? this.imageService.getImageDataFromUser(
          this.authService.getCurrentUser()!
        )
      : 'placeholder-profile.jpg';
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    if (!(event.target as HTMLElement).closest('.user-profile')) {
      this.isDropdownOpen = false;
    }
  }

  logout() {
    this.authService.logout();
    this.isDropdownOpen = false;
    this.router.navigate(['/']);
  }
}
