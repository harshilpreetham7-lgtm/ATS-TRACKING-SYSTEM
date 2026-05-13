const { createClient } = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const client = createClient({
  url: redisUrl,
  lazyConnect: true,
  maxRetriesPerRequest: 0,
  retryDelayOnFailover: 0,
  enableOfflineQueue: false,
});

const memoryCache = new Map();
let usingRedis = false;

client.on('error', (err) => {
  console.warn('Redis cache error:', err.message);
});

const connect = async () => {
  try {
    await client.connect();
    usingRedis = true;
    console.log('Redis cache connected');
  } catch (error) {
    usingRedis = false;
    console.warn('Redis cache unavailable, falling back to in-memory cache');
  }
};

const get = async (key) => {
  if (usingRedis && client.isOpen) {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  }
  return memoryCache.has(key) ? JSON.parse(memoryCache.get(key)) : null;
};

const set = async (key, value, ttl = 120) => {
  if (usingRedis && client.isOpen) {
    await client.set(key, JSON.stringify(value), 'EX', ttl);
    return;
  }
  memoryCache.set(key, JSON.stringify(value));
};

const del = async (key) => {
  if (usingRedis && client.isOpen) {
    await client.del(key);
    return;
  }
  memoryCache.delete(key);
};

module.exports = { get, set, del, client, connect, usingRedis };

