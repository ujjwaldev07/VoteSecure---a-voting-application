const { cookieNames, cookieOptions } = require('../auth/cookies')
const { env } = require('../config/env')

function setAuthCookies(res, accessToken, refreshToken) {
  res.cookie(cookieNames.accessToken, accessToken, cookieOptions.accessToken)
  res.cookie(cookieNames.refreshToken, refreshToken, cookieOptions.refreshToken)
}

function clearAuthCookies(res) {
  const common = {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: 'strict',
    signed: true,
    path: '/',
  }

  res.clearCookie(cookieNames.accessToken, common)
  res.clearCookie(cookieNames.refreshToken, common)
  res.clearCookie('voting_app_sid', {
    httpOnly: true,
    secure: env.IS_PRODUCTION,
    sameSite: 'strict',
    path: '/',
  })
  res.clearCookie('_csrf', common)
}

module.exports = {
  setAuthCookies,
  clearAuthCookies,
}
