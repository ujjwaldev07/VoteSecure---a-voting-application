const redisClient = require('../redis/client')

const CACHE_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 1800,
}

async function getCache(key) {
  const raw = await redisClient.get(key)
  return raw ? JSON.parse(raw) : null
}

async function setCache(key, value, ttl = CACHE_TTL.MEDIUM) {
  await redisClient.set(key, JSON.stringify(value), 'EX', ttl)
}

async function delCache(key) {
  await redisClient.del(key)
}

async function delByPattern(pattern) {
  const stream = redisClient.scanStream({ match: pattern, count: 100 })
  const keys = []

  for await (const batch of stream) {
    keys.push(...batch)
  }

  if (keys.length) {
    await redisClient.del(keys)
  }
}

module.exports = {
  CACHE_TTL,
  getCache,
  setCache,
  delCache,
  delByPattern,
}
