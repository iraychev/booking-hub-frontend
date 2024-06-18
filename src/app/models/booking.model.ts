import { User } from "./user.model";
import { Listing } from "./listing.model";
export class Booking {
    id: string = '';
    renter!: User;
    listing!: Listing;
    startDate!: Date;
    nightsToStay!: number;
    price: number = 0;

    constructor(listing: Listing, nightsToStay: number) {
        this.listing = listing;
        this.nightsToStay = nightsToStay;
        this.price = listing.price! * nightsToStay;
      }
}
