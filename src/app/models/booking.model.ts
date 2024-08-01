import { User } from './user.model';
import { Listing } from './listing.model';
export class Booking {
  id: string = '';
  renter!: User;
  listing!: Listing;
  startDate!: Date;
  nightsToStay!: number;
  price: number = this.listing ? this.listing.price! * this.nightsToStay : 0;
}
