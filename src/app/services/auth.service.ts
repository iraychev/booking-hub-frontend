import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = 'authToken';
  url: string = environment.apiUrl;
  private readonly USER_KEY = 'user';

  constructor(
    private http: HttpClient,
    private router: Router,
    private cookieService: CookieService
  ) {}

  login(username: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.url}/login`, { username, password })
      .pipe(
        tap((response) => {
          this.cookieService.set(this.token, response.accessToken, {
            path: '/',
            sameSite: 'Lax',
          });
        })
      );
  }

  getToken() {
    return this.cookieService.get(this.token);
  }

  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    if (!userJson) {
      return null;
    }
    try {
      const user: User = JSON.parse(userJson);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  }
  logout() {
    this.cookieService.delete(this.token, '/');
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}
