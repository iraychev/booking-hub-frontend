import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { User } from '../../models/user.model';
import { Image } from '../../models/image.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from "../../shared/button/button.component";

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  error: string = '';
  selectedRoles: string[] = [];
  rolesList: string[] = ['RENTER', 'PROPERTY_OWNER'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._-]{3,}$')]],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\'-]{3,}$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z\'-]{3,}$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      roles: this.fb.array([])
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }
  
  checkFormValidity(): void {
    console.log('Form validity:', this.registerForm.valid);

    if (!this.registerForm.valid) {
      console.log('Validation errors:', this.registerForm.errors);
      console.log('Username validity:', this.registerForm.get('username')!.valid);
      console.log('Username errors:', this.registerForm.get('username')!.errors);
      console.log('FirstName validity:', this.registerForm.get('firstName')!.valid);
      console.log('FirstName errors:', this.registerForm.get('firstName')!.errors);
      console.log('LastName validity:', this.registerForm.get('lastName')!.valid);
      console.log('LastName errors:', this.registerForm.get('lastName')!.errors);
      console.log('Email validity:', this.registerForm.get('email')!.valid);
      console.log('Email errors:', this.registerForm.get('email')!.errors);
      console.log('Password validity:', this.registerForm.get('password')!.valid);
      console.log('Password errors:', this.registerForm.get('password')!.errors);
      console.log('ConfirmPassword validity:', this.registerForm.get('confirmPassword')!.valid);
      console.log('ConfirmPassword errors:', this.registerForm.get('confirmPassword')!.errors);
      console.log('Roles validity:', this.registerForm.get('roles')!.valid);
      console.log('Roles errors:', this.registerForm.get('roles')!.errors);
    }
  }
  register(): void {
    this.checkFormValidity();
    if (this.registerForm.invalid) {
      this.error = 'Form is invalid';
      return;
    }

    const user: User = {
      id: '',
      firstName: this.registerForm.get('firstName')?.value,
      lastName: this.registerForm.get('lastName')?.value,
      profileImage: new Image(),
      username: this.registerForm.get('username')?.value,
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value,
      roles: this.selectedRoles
    };

    console.log(user);
    this.apiService.register(user).subscribe({
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
