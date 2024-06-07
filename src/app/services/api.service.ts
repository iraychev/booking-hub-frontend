import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url: string = 'http://localhost:8080/booking-api';
  listings: any[] = [];
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.url}/users`);
  }

  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http.get(`${this.url}/users/username/${username}`, { headers });
  }

  fetchListings(): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${user.username}:${user.password}`),
    });
    console.log('Authorization header:', headers.get('Authorization'));
    console.log(`Username:Password : ${user.username}:${user.password}`);
    return this.http.get(`${this.url}/listings`, { headers });
  }

  getListingById(id: string): Observable<any> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${user.username}:${user.password}`),
    });
    return this.http.get(`${this.url}/listings/${id}`, { headers });
  }
}
