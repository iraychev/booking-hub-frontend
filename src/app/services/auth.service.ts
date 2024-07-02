import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private token = 'authToken';
  url: string = environment.apiUrl;

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
            secure: true,
            sameSite: 'Lax',
          });
        })
      );
  }

  getToken() {
    return this.cookieService.get(this.token);
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
