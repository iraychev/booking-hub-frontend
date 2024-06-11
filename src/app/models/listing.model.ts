import { User } from "./user.model";

export class Listing {
  id: string ='';
  user: User = JSON.parse(localStorage.getItem('user') || 'null') as User;
  title: string = '';
  description: string = '';
  propertyAddress: string = '';
  price: number | undefined;
  amenities: string[] = [];
}
