import { CacheService } from '@/domain/services/cache.service';
import Redis from 'ioredis';

export class RedisCacheService implements CacheService {
  private redisInstance: Redis;

  constructor() {
    this.initialize();
  }

  private async initialize() {
    this.redisInstance = new Redis(process.env.REDIS_URL);
  }

  async get(key: string): Promise<string> {
    return this.redisInstance.get(key);
  }

  async set(
    key: string,
    value: string,
    expiresInSeconds: number,
  ): Promise<void> {
    this.redisInstance.set(key, value);
    this.redisInstance.expire(key, expiresInSeconds);
  }

  async del(key: string): Promise<void> {
    this.redisInstance.del(key);
  }
}
