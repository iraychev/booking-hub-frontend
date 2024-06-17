import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../models/image';

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
  uploadImage(file: File): Observable<Image> {
    const headers = this.getAuthHeaders();
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http.post<Image>(`${this.url}/upload`, formData, { headers });
  }

  getImageById(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.url}/${id}`, { headers });
  }

  mapFilesToImages(files: File[]): Promise<Image[]> {
    const promises: Promise<Image>[] = [];

    for (let file of files) {
      promises.push(
        this.readFileAsDataURL(file).then((base64Content) => {
          const image = new Image();
          image.name = file.name;
          image.type = file.type;
          image.id = '';
          image.data = base64Content;
          return image;
        })
      );
    }

    return Promise.all(promises);
  }
  async mapFileToImage(file: File): Promise<Image> {
    try {
      const base64Content = await this.readFileAsDataURL(file);
      const image = new Image();
      image.name = file.name;
      image.type = file.type;
      image.id = '';
      image.data = base64Content;
      return image;
    } catch (error) {
      console.error('Error reading file', error);
      throw error;
    }
  }
  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        const base64String = event.target.result as string;
        const base64Content = base64String.split(';base64,').pop();
        resolve(base64Content!);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}
