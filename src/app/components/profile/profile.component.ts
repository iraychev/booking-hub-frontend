import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user.model';
import { ApiService } from '../../services/api.service';

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
  error: string = '';
  
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }

  saveChanges(): void {
    localStorage.setItem('user', JSON.stringify(this.user))
    this.apiService.updateUserById(this.user).subscribe({
      next: (updatedUser) => {
        console.log('Server reponse: ', updatedUser);

        this.editMode = false;
      },
      error: (err)=> {
        console.error('Error updating profile', err);
        this.error = 'Error updating profile';
      }
    })
    


    
  }

  cancelEdit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.editMode = false;
  }
}