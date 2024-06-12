import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {
    const user = localStorage.getItem('user');
    if (user) {
      this.isLoggedIn$.next(true);
    }
  }

  setLoggedIn(value: boolean): void {
    this.isLoggedIn$.next(value);
  }
  logout(): void {
    localStorage.removeItem('user');
    this.isLoggedIn$.next(false);
  }
}
