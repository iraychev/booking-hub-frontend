import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'amenitiespipe',
  standalone: true,
})
export class AmenitiesPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return value
      .toLowerCase()
      .split('_')
      .map((e) => e[0].toUpperCase() + e.substring(1))
      .join(' ');
  }
}
