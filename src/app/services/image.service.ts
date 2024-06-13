import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private url = 'http://localhost:8080/booking-api/images';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa(`${user.username}:${user.password}`),
    });
  }
  uploadImage(file: File): Observable<any> {
    const headers = this.getAuthHeaders();
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.url}/upload`, formData, { headers });
  }

  getImageById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}/${id}`, { headers });
  }
}
