import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  projectName = 'Booking App';
  description =
    'This platform is designed to help users find and book their perfect vacation rentals.';
  features = [
    'User-friendly interface',
    'Secure booking system',
    'Wide range of properties',
    'Detailed property descriptions',
    'User reviews and ratings',
  ];
}
