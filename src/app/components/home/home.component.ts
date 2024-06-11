import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
    constructor(public authService: AuthService, private router: Router) {}

  logout(): void {
    localStorage.removeItem('user');
    this.authService.setLoggedIn(false);
    this.router.navigate(['/home']);
  }
}
