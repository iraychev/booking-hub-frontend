import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ErrorService } from '../../services/error.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [FormsModule, CommonModule, RouterLink, ButtonComponent],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService,
    private errorService: ErrorService
  ) {}

  async login() {
    try {
      await lastValueFrom(this.authService.login(this.username, this.password));
      const user = await lastValueFrom(
        this.apiService.getUserByUsername(this.username)
      );
      localStorage.setItem('user', JSON.stringify(user));
      this.router.navigate(['/']);
    } catch (error) {
      this.errorService.handleError(
        'Login failed',
        'Invalid username or password'
      );
    }
  }
}
