import { User } from './user.model';
import { Image } from './image.model';

export class Listing {
  id!: string;
  user: User = JSON.parse(localStorage.getItem('user') || 'null')?.id || '';
  title: string = '';
  description: string = '';
  images: Image[] = [];
  propertyAddress: string = '';
  price: number | undefined;
  amenities: string[] = [];
}
