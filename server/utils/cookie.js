const { cookieNames, cookieOptions } = require('../auth/cookies')
const { env } = require('../config/env')

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(cookieNames.accessToken, accessToken, cookieOptions.accessToken)
  res.cookie(cookieNames.refreshToken, refreshToken, cookieOptions.refreshToken)
}

function clearAuthCookies(res) {
  const common = {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    signed: true,
    path: '/',
  }

  res.clearCookie(cookieNames.accessToken, common)
  res.clearCookie(cookieNames.refreshToken, common)
  res.clearCookie('voting_app_sid', {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: env.COOKIE_SAME_SITE,
    path: '/',
  })
  res.clearCookie('_csrf', common)
}

module.exports = {
  setAuthCookies,
  clearAuthCookies,
}
