import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  error: string = '';

  constructor(
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService
  ) {}

  login(): void {
    this.apiService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        localStorage.setItem('user', JSON.stringify(response));
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.password = this.password;
        console.log(`User: ${user}`);
        localStorage.setItem('user', JSON.stringify(user));
        this.authService.setLoggedIn(true);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.error = 'Invalid credentials';
      },
    });
  }
}
