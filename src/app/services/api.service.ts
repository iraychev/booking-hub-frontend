import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Listing } from '../models/listing.model';
import { Booking } from '../models/booking.model';
import { environment } from '../../environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  url: string = environment.apiUrl;
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

  updateUserById(user: User): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.put(`${this.url}/users/${user.id}`, user, { headers });
  }

  fetchListings(): Observable<any> {
    return this.http.get(`${this.url}/listings`);
  }

  updateListingById(listing: Listing): Observable<any> {
    const headers = this.getAuthHeaders();
    headers.set('Content-Type', 'application/json');

    const listingToUpdate = {
      title: listing.title,
      description: listing.description,
      images: listing.images,
      propertyAddress: listing.propertyAddress,
      price: listing.price,
      amenities: listing.amenities,
    };
    return this.http.put(
      `${this.url}/listings/${listing.id}`,
      listingToUpdate,
      { headers }
    );
  }

  createListing(listing: Listing) {
    const headers = this.getAuthHeaders();

    return this.http.post(`${this.url}/listings`, listing, { headers });
  }

  deleteListingById(listingId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.url}/listings/${listingId}`, { headers });
  }

  getListingById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}/listings/${id}`, { headers });
  }

  getBookingById(id: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}/bookings/${id}`, { headers });
  }

  fetchBookings(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}/bookings`, { headers });
  }

  getBookingsForListing(listingId: string): Observable<Booking[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Booking[]>(
      `${this.url}/bookings/listing/${listingId}`,
      { headers }
    );
  }

  createBooking(booking: Booking) {
    const headers = this.getAuthHeaders();
    booking.startDate = new Date(booking.startDate.getTime() + 3 * 60 * 60 * 1000);
    return this.http.post<Booking>(`${this.url}/bookings`, booking, { headers });
  }
  deleteBookingById(bookingId: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${this.url}/bookings/${bookingId}`, { headers });
  }
}
