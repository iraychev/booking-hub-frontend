import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = JSON.parse(localStorage.getItem('user') || '{}');
  editMode: boolean = false;
  password: string = '';
  error: string = '';
  
  constructor() { }

  ngOnInit(): void {
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    // Here you can add logic to update user information
    // For simplicity, let's just log the updated user object
    console.log('Updated User:', this.user);
    this.editMode = false;
  }

  cancelEdit(): void {
    // Reset user object to original values
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.editMode = false;
  }
}