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
    const cachedItem = this.cache.get(key);

    if (!cachedItem) {
      return null;
    }

    if (Date.now() > cachedItem.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cachedItem.data;
  }

  clear() {
    this.cache.clear();
  }

  delete(key: string) {
    this.cache.delete(key);
  }
}
