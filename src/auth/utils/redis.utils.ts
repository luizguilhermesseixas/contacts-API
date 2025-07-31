import { RedisClientType } from 'redis';

export async function storeRefreshToken(
  redisClient: RedisClientType,
  userId: string,
  refreshToken: string,
  expiresInSeconds: number = 7 * 24 * 60 * 60, // 7 dias
): Promise<void> {
  await redisClient.set(`refresh:${userId}`, refreshToken, {
    EX: expiresInSeconds,
  });
}

export async function getRefreshToken(
  redisClient: RedisClientType,
  userId: string,
): Promise<string | null> {
  return redisClient.get(`refresh:${userId}`);
}

export async function removeRefreshToken(
  redisClient: RedisClientType,
  userId: string,
): Promise<void> {
  await redisClient.del(`refresh:${userId}`);
}
