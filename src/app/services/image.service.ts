import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Image } from '../models/image.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
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

  getImageDataFromUser(user?: User): string {
    if (user && user.profileImage) {
      return (
        'data:' + user.profileImage.type + ';base64,' + user.profileImage.data
      );
    }
    return '';
  }
}
