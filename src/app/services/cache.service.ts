import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private cache = new Map<string, { data: any; expiry: number }>();

  constructor() {}

  set(key: string, data: any, ttl: number = 300000) {
    const expiry = Date.now() + ttl; // TTL in milliseconds, default is 5 minutes
    this.cache.set(key, { data, expiry });
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
