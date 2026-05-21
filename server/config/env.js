const nodeEnv = process.env.NODE_ENV || 'development'
const isProduction = nodeEnv === 'production'

const derived = {
  MONGODB_URI: process.env.MONGODB_LOCAL_DB || process.env.MONGO_URI,
  SESSION_SECRET: process.env.SESSION_SECRET || (!isProduction ? process.env.JWT_SECRET : ''),
  COOKIE_SECRET:
    process.env.COOKIE_SECRET ||
    (!isProduction ? process.env.SESSION_SECRET || process.env.JWT_SECRET : ''),
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
  JWT_REFRESH_SECRET:
    process.env.JWT_REFRESH_SECRET || (!isProduction ? process.env.JWT_SECRET : ''),
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || process.env.JWT_EXPIRES_IN || '15m',
  REFRESH_TOKEN_TTL:
    process.env.REFRESH_TOKEN_TTL || process.env.JWT_REFRESH_EXPIRES_IN || '7d',
}

const required = {
  MONGODB_URI: derived.MONGODB_URI,
  SESSION_SECRET: derived.SESSION_SECRET,
  COOKIE_SECRET: derived.COOKIE_SECRET,
  JWT_ACCESS_SECRET: derived.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: derived.JWT_REFRESH_SECRET,
}

for (const [key, value] of Object.entries(required)) {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

const env = {
  NODE_ENV: nodeEnv,
  PORT: Number(process.env.PORT || 3000),
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: derived.MONGODB_URI.trim().replace(/;+$/, ''),
  SESSION_SECRET: derived.SESSION_SECRET,
  COOKIE_SECRET: derived.COOKIE_SECRET,
  JWT_ACCESS_SECRET: derived.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: derived.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL: derived.ACCESS_TOKEN_TTL,
  REFRESH_TOKEN_TTL: derived.REFRESH_TOKEN_TTL,
  SESSION_TTL_MS: Number(process.env.SESSION_TTL_MS || 1000 * 60 * 60 * 24),
  REFRESH_TTL_SECONDS: Number(process.env.REFRESH_TTL_SECONDS || 60 * 60 * 24 * 7),
  REDIS_ENABLED:
    process.env.REDIS_ENABLED === 'true' ||
    (isProduction && process.env.REDIS_ENABLED !== 'false'),
  REDIS_REQUIRED:
    process.env.REDIS_REQUIRED === 'true' ||
    (isProduction && process.env.REDIS_REQUIRED !== 'false'),
  REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
  REDIS_PORT: Number(process.env.REDIS_PORT || 6379),
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
  REDIS_DB: Number(process.env.REDIS_DB || 0),
  REDIS_TLS: process.env.REDIS_TLS === 'true',
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  BCRYPT_ROUNDS: Number(process.env.BCRYPT_ROUNDS || 12),
  CANDIDATE_PAGE_SIZE: Number(process.env.CANDIDATE_PAGE_SIZE || 10),
}

env.IS_PRODUCTION = isProduction

module.exports = { env }
