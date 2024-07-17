import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  menuOpen = false;

  constructor(
    public authService: AuthService, 
    private router: Router, 
    public imageService: ImageService
  ) {}

  getProfileImageData(): string {
    return this.imageService.getImageDataFromUser(this.authService.getCurrentUser()!);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}