import { Component } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/button/button.component';
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
  error: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  async login() {
    this.authService.login(this.username, this.password).subscribe(
      async () => {
        const user = await this.apiService.getUserByUsername(this.username).toPromise();
        localStorage.setItem('user', JSON.stringify(user));
        this.router.navigate(['/']);
      },
      error => {
        this.error = 'Invalid username or password';
      }
    );
  }
}
