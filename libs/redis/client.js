import Redis from 'ioredis';

/** @param {import('../config/types.js').BotConfig} config @returns {Redis} */
export function createRedisClient(config) {
  return new Redis(config.redisUrl, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 3,
    retryStrategy: () => null,
  });
}
/** @param {Redis} redis @param {string} key @param {unknown} value @param {number} ttl */
export async function cacheSet(redis, key, value, ttl) { await redis.set(key, JSON.stringify(value), 'EX', ttl); }
/** @param {Redis} redis @param {string} key @returns {Promise<unknown|undefined>} */
export async function cacheGet(redis, key) { const value = await redis.get(key); return value === null ? undefined : JSON.parse(value); }
