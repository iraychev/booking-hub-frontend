import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, any>();

  constructor() {}

  set(key: string, data: any) {
    this.cache.set(key, data);
  }

  get(key: string): any | null {
    return this.cache.get(key) || null;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}
