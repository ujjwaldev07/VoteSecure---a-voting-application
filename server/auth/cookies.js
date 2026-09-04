const { env } = require('../config/env')

const cookieNames = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
}

function buildCookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    signed: true,
    maxAge,
    path: '/',
  }
}

const cookieOptions = {
  accessToken: buildCookieOptions(1000 * 60 * 15),
  refreshToken: buildCookieOptions(env.REFRESH_TTL_SECONDS * 1000),
}

module.exports = { cookieNames, cookieOptions }
