import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({ url: process.env.REDIS_URL });
    await this.client.connect();
    console.log('Redis connected!');
  }

  getClient(): RedisClientType {
    return this.client;
  }
}
