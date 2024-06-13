import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Listing } from '../models/listing.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url: string = 'http://localhost:8080/booking-api';
  listings: any[] = [];
  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${user.username}:${user.password}`),
    });
  }
  
  login(username: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${username}:${password}`),
    });

    return this.http.get(`${this.url}/users/username/${username}`, { headers });
  }

  register(user: User): Observable<any> {
    return this.http.post(`${this.url}/users`, user);
  }

  fetchListings(): Observable<any> {
    return this.http.get(`${this.url}/listings`);
  }

  createListing(listing: Listing) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${this.url}/listings`, listing, { headers });
  }
  deleteListingById(listingId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.url}/listings/${listingId}`, { headers });
  }

  updateUserById(user: User): Observable<any> {
    const headers = this.getAuthHeaders();
    console.log('Inside apiService.updateUser');
    return this.http.put(`${this.url}/users/${user.id}`, user, { headers });
  }

  getListingById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}/listings/${id}`, { headers });
  }
}
