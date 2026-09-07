const session = require('express-session')
const { RedisStore } = require('connect-redis')
const { env } = require('../config/env')
const redisClient = require('../redis/client')

const config = {
  secret: env.SESSION_SECRET,
  name: 'voting_app_sid',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  proxy: env.TRUST_PROXY !== false,
  cookie: {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    maxAge: env.SESSION_TTL_MS,
    path: '/',
  },
}

if (env.REDIS_ENABLED) {
  config.store = new RedisStore({
    client: redisClient,
    prefix: 'session:',
    ttl: Math.floor(env.SESSION_TTL_MS / 1000),
  })
} else {
  config.store = new session.MemoryStore()
}

module.exports = config
