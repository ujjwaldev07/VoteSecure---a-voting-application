const AppError = require('../utils/AppError')
const redisClient = require('../redis/client')
const { cacheKeys } = require('../redis/cacheKeys')

function createRedisRateLimiter({ prefix, windowMs, max, keyGenerator }) {
  return async (req, res, next) => {
    try {
      const identifier = keyGenerator ? keyGenerator(req) : req.ip
      const key = cacheKeys.rateLimit(prefix, identifier)
      const totalHits = await redisClient.incr(key)

      if (totalHits === 1) {
        await redisClient.pexpire(key, windowMs)
      }

      const ttl = await redisClient.pttl(key)
      res.setHeader('X-RateLimit-Limit', max)
      res.setHeader('X-RateLimit-Remaining', Math.max(max - totalHits, 0))
      res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() + ttl) / 1000))

      if (totalHits > max) {
        next(new AppError('Too many requests. Please try again later.', 429))
        return
      }

      next()
    } catch (error) {
      next(error)
    }
  }
}

const globalLimiter = createRedisRateLimiter({
  prefix: 'global',
  windowMs: 15 * 60 * 1000,
  max: 300,
})

const authLimiter = createRedisRateLimiter({
  prefix: 'auth',
  windowMs: 15 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => `${req.ip}:${req.body.email || req.body.aadharCardNumber || 'anonymous'}`,
})

const apiLimiter = createRedisRateLimiter({
  prefix: 'api',
  windowMs: 15 * 60 * 1000,
  max: 120,
})

const bruteForceLimiter = createRedisRateLimiter({
  prefix: 'bruteforce',
  windowMs: 60 * 60 * 1000,
  max: 10,
  keyGenerator: (req) => `${req.ip}:${req.body.email || req.body.aadharCardNumber || 'anonymous'}`,
})

module.exports = {
  globalLimiter,
  authLimiter,
  apiLimiter,
  bruteForceLimiter,
}
