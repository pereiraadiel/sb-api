export const CACHE_SERVICE = 'CACHE_SERVICE';

export interface CacheService {
  get(key: string): Promise<string>;
  set(key: string, value: string, expiresInSeconds: number): Promise<void>;
  del(key: string): Promise<void>;
}
