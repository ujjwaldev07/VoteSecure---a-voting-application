const AppError = require('../utils/AppError')
const authService = require('../services/authService')
const { verifyAccessToken } = require('../auth/tokens')

async function ensureHybridAuth(req) {
  const sessionUser = authService.getSessionUser(req)
  if (!sessionUser) {
    throw new AppError('Please log in to access this resource', 401)
  }

  const accessToken = req.signedCookies?.accessToken

  if (accessToken) {
    try {
      const payload = verifyAccessToken(accessToken)
      if (
        payload.type === 'access' &&
        payload.sub === sessionUser.userId &&
        payload.sessionId === req.sessionID
      ) {
        req.auth = payload
        return
      }
    } catch (error) {
      await authService.refreshAuthentication(req, req.res)
      return
    }
  } else {
    await authService.refreshAuthentication(req, req.res)
  }
}

async function isAuthenticated(req, res, next) {
  try {
    await ensureHybridAuth(req)
    next()
  } catch (error) {
    next(error)
  }
}

function isAdmin(req, res, next) {
  if (req.session?.role === 'admin') {
    next()
    return
  }

  next(new AppError('You do not have permission to access this resource', 403))
}

function isVoter(req, res, next) {
  if (req.session?.role === 'voter') {
    next()
    return
  }

  next(new AppError('You do not have permission to access this resource', 403))
}

module.exports = {
  isAuthenticated,
  isAdmin,
  isVoter,
}
