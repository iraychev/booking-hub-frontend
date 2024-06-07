import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  setLoggedIn(value: boolean): void {
    this.isLoggedIn$.next(value);
  }
}
