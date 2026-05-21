const jwt = require('jsonwebtoken')
const { env } = require('../config/env')

function signAccessToken(sessionUser, sessionId) {
  return jwt.sign(
    {
      sub: sessionUser.userId,
      role: sessionUser.role,
      email: sessionUser.email,
      sessionId,
      type: 'access',
    },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_TTL }
  )
}

function signRefreshToken(sessionUser, sessionId, tokenId) {
  return jwt.sign(
    {
      sub: sessionUser.userId,
      role: sessionUser.role,
      email: sessionUser.email,
      sessionId,
      tokenId,
      type: 'refresh',
    },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.REFRESH_TOKEN_TTL }
  )
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET)
}

function verifyRefreshToken(token) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET)
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
}
