import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amenitiespipe',
  standalone: true,
})
export class AmenitiesPipe implements PipeTransform {
  
  private emojiMap: { [key: string]: string } = {
    WIFI: '📶',
    PARKING: '🚗',
    POOL: '🏊',
    GYM: '🏋️‍♂️',
    AIR_CONDITIONING: '❄️',
    HEATING: '🔥',
    KITCHEN: '🍽️',
    TV: '📺',
    WASHER: '🧼',
    DRYER: '💨'
  };

  transform(amenity: string): string {
    const formattedAmenity = this.capitalizeWords(amenity.replace('_', ' ').toLowerCase());
    const emoji = this.emojiMap[amenity] || '';
    return `${emoji} ${formattedAmenity}`;
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase());
  }
}