import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  user: User = new User();
  confirmPassword: string = '';
  error: string = '';
  selectedRoles: string[] = [];

  constructor(private apiService: ApiService, private router: Router) {}
  //TODO: ADD ROLES TO REGISTER AND USER
  register(): void {
    if (this.user.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }
    this.user.roles = this.selectedRoles;
    this.apiService.register(this.user).subscribe({
      next: (response) => {
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.error = 'Registration failed';
      },
    });
  }
  onRoleChange(event: any): void {
    const role = event.target.value;
    if (event.target.checked) {
      if (!this.selectedRoles.includes(role)) {
        this.selectedRoles.push(role);
      }
    } else {
      this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
    }
  }
}
