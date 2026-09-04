const Redis = require('ioredis')
const { env } = require('../config/env')

function createMemoryRedis() {
  const store = new Map()
  const expiry = new Map()

  function isExpired(key) {
    const expiresAt = expiry.get(key)
    if (expiresAt && Date.now() > expiresAt) {
      store.delete(key)
      expiry.delete(key)
      return true
    }
    return false
  }

  function normalizePattern(pattern) {
    return new RegExp(`^${String(pattern).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`)
  }

  function ensureKey(key) {
    if (isExpired(key)) return null
    return store.get(key)
  }

  return {
    status: 'memory',
    on() {},
    async get(key) {
      const value = ensureKey(key)
      return value === undefined ? null : value
    },
    async set(key, value, modeOrOptions, ttl) {
      store.set(key, value)

      let seconds = null
      if (typeof modeOrOptions === 'object' && modeOrOptions?.EX) {
        seconds = modeOrOptions.EX
      } else if (modeOrOptions === 'EX') {
        seconds = ttl
      }

      if (seconds) {
        expiry.set(key, Date.now() + Number(seconds) * 1000)
      } else {
        expiry.delete(key)
      }

      return 'OK'
    },
    async del(keys) {
      const normalized = Array.isArray(keys) ? keys : [keys]
      let removed = 0
      for (const key of normalized) {
        if (store.delete(key)) removed += 1
        expiry.delete(key)
      }
      return removed
    },
    async incr(key) {
      const current = Number((await this.get(key)) || 0) + 1
      store.set(key, String(current))
      return current
    },
    async pexpire(key, ttlMs) {
      if (!store.has(key)) return 0
      expiry.set(key, Date.now() + Number(ttlMs))
      return 1
    },
    async pttl(key) {
      if (!store.has(key)) return -2
      const expiresAt = expiry.get(key)
      if (!expiresAt) return -1
      return Math.max(expiresAt - Date.now(), 0)
    },
    scanStream({ match }) {
      const regex = normalizePattern(match || '*')
      return (async function* scan() {
        const keys = [...store.keys()].filter((key) => !isExpired(key) && regex.test(key))
        yield keys
      })()
    },
  }
}

let redisClient

if (!env.REDIS_ENABLED) {
  redisClient = createMemoryRedis()
  console.log('Redis disabled for current environment. Using in-memory fallback.')
} else {
  const redisOptions = {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD || undefined,
    db: env.REDIS_DB,
    lazyConnect: false,
    maxRetriesPerRequest: null,
    retryStrategy(attempt) {
      if (!env.REDIS_REQUIRED && attempt > 3) {
        return null
      }
      return Math.min(attempt * 100, 3000)
    },
  }

  if (env.REDIS_TLS) redisOptions.tls = {}

  redisClient = env.REDIS_URL ? new Redis(env.REDIS_URL, redisOptions) : new Redis(redisOptions)

  redisClient.on('connect', () => console.log('Redis connected'))
  redisClient.on('ready', () => console.log('Redis ready'))
  redisClient.on('error', (error) => {
    if (env.REDIS_REQUIRED) {
      console.error('Redis error:', error)
      return
    }

    console.warn('Redis unavailable, keeping development fallback expectations:', error.message)
  })
}

module.exports = redisClient
