import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  users?: string;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe({
      next: (res) => {
        console.log(res);
        this.users = res;
      },
      error: (e) => console.log(e),
      complete: console.log,
    });
  }
}
