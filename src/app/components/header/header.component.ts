import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isLoggedIn$.subscribe((isLoggedIn) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  getProfileImageUrl(): string {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.profileImage) {
      return 'data:' + user.profileImage.type + ';base64,' + user.profileImage.data;
    } else {
      return '';
    }
  }
}
