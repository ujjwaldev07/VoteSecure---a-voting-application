const { OAuth2Client } = require('google-auth-library')
const crypto = require('crypto')
const User = require('../models/user')
const Admin = require('../models/admin')
const AppError = require('../utils/AppError')
const { publicUserShape } = require('../utils/sanitize')
const { setAuthCookies, clearAuthCookies } = require('../utils/cookie')
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../auth/tokens')
const { cacheKeys } = require('../redis/cacheKeys')
const redisClient = require('../redis/client')
const { env } = require('../config/env')

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null

function getSessionUser(req) {
  if (!req.session?.userId || !req.session?.isAuthenticated) return null

  return {
    userId: req.session.userId,
    role: req.session.role,
    email: req.session.email,
    isAuthenticated: req.session.isAuthenticated,
  }
}

function assignSession(req, user) {
  req.session.userId = user._id.toString()
  req.session.role = user.role
  req.session.email = user.email || ''
  req.session.isAuthenticated = true
}

async function persistRefreshSession(sessionId, sessionUser, tokenId) {
  const key = cacheKeys.refreshSession(sessionId)
  await redisClient.set(
    key,
    JSON.stringify({
      tokenId,
      userId: sessionUser.userId,
      role: sessionUser.role,
      email: sessionUser.email,
    }),
    'EX',
    env.REFRESH_TTL_SECONDS
  )
}

async function issueAuthArtifacts(req, res) {
  const sessionUser = getSessionUser(req)
  if (!sessionUser) {
    throw new AppError('Unable to create authentication session', 500)
  }

  const tokenId = crypto.randomUUID()
  const accessToken = signAccessToken(sessionUser, req.sessionID)
  const refreshToken = signRefreshToken(sessionUser, req.sessionID, tokenId)

  await persistRefreshSession(req.sessionID, sessionUser, tokenId)
  setAuthCookies(res, accessToken, refreshToken)
}

async function signupVoter(payload) {
  const existingUser = await User.findOne({
    $or: [
      { email: payload.email?.toLowerCase() || null },
      { mobile: payload.mobile },
      { aadharCardNumber: payload.aadharCardNumber },
    ],
  })

  if (existingUser) {
    throw new AppError('User with this email, mobile, or Aadhaar already exists', 409)
  }

  const user = await User.create({
    ...payload,
    email: payload.email?.toLowerCase() || undefined,
    role: 'voter',
    authProvider: 'local',
  })

  return user
}

async function signupAdmin(payload) {
  const existingAdmin = await Admin.findOne({ email: payload.email.toLowerCase() })
  if (existingAdmin) {
    throw new AppError('Admin with this email already exists', 409)
  }

  return Admin.create({
    ...payload,
    email: payload.email.toLowerCase(),
    role: 'admin',
  })
}

async function loginVoter({ email, password, aadharCardNumber }) {
  const identifier = email?.toLowerCase() || aadharCardNumber
  const query = email
    ? { email: email.toLowerCase() }
    : { aadharCardNumber }

  const user = await User.findOne(query)
  if (!user || !identifier) {
    throw new AppError('Invalid credentials', 401)
  }

  if (user.authProvider === 'google') {
    throw new AppError('Please login with Google', 400)
  }

  const valid = await user.comparePassword(password)
  if (!valid) {
    throw new AppError('Invalid credentials', 401)
  }

  return user
}

async function loginAdmin({ email, password }) {
  const admin = await Admin.findOne({ email: email.toLowerCase() })
  if (!admin) {
    throw new AppError('Invalid credentials', 401)
  }

  const valid = await admin.comparePassword(password)
  if (!valid) {
    throw new AppError('Invalid credentials', 401)
  }

  return admin
}

async function loginWithGoogle({ credential }) {
  if (!credential || !googleClient) {
    throw new AppError('Google OAuth is not configured', 503)
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: env.GOOGLE_CLIENT_ID,
  })

  const payload = ticket.getPayload()
  if (!payload?.email) {
    throw new AppError('Unable to verify Google account', 401)
  }

  const email = payload.email.toLowerCase().trim()
  const googleId = payload.sub
  const name = payload.name || payload.given_name || email.split('@')[0]

  let user = await User.findOne({ $or: [{ googleId }, { email }] })

  if (!user) {
    const digits = googleId.replace(/\D/g, '')
    user = await User.create({
      name,
      email,
      googleId,
      authProvider: 'google',
      age: 18,
      mobile: `9${digits.slice(-9).padStart(9, '0')}`,
      address: 'Google OAuth Sign-in',
      aadharCardNumber: `99${digits.slice(-10).padStart(10, '0')}`,
      role: 'voter',
    })
  } else if (!user.googleId) {
    user.googleId = googleId
    user.authProvider = 'google'
    await user.save()
  }

  return user
}

async function loadCurrentUser(sessionUser) {
  if (!sessionUser?.userId) {
    throw new AppError('Please log in to access this resource', 401)
  }

  const model = sessionUser.role === 'admin' ? Admin : User
  const user = await model.findById(sessionUser.userId).lean()
  if (!user) {
    throw new AppError('User not found', 404)
  }

  return user
}

async function refreshAuthentication(req, res) {
  const sessionUser = getSessionUser(req)
  const refreshToken = req.signedCookies?.refreshToken

  if (!sessionUser || !refreshToken) {
    throw new AppError('Refresh session not found', 401)
  }

  const payload = verifyRefreshToken(refreshToken)
  if (payload.type !== 'refresh' || payload.sessionId !== req.sessionID) {
    throw new AppError('Invalid refresh token', 401)
  }

  const stored = await redisClient.get(cacheKeys.refreshSession(req.sessionID))
  if (!stored) {
    throw new AppError('Refresh session expired', 401)
  }

  const parsed = JSON.parse(stored)
  if (
    parsed.tokenId !== payload.tokenId ||
    parsed.userId !== sessionUser.userId ||
    parsed.role !== sessionUser.role
  ) {
    throw new AppError('Refresh token mismatch', 401)
  }

  await issueAuthArtifacts(req, res)
  return loadCurrentUser(sessionUser)
}

async function logout(req, res) {
  await redisClient.del(cacheKeys.refreshSession(req.sessionID))
  clearAuthCookies(res)

  await new Promise((resolve, reject) => {
    req.session.destroy((error) => {
      if (error) {
        reject(new AppError('Failed to destroy session', 500))
        return
      }
      resolve()
    })
  })
}

module.exports = {
  assignSession,
  getSessionUser,
  issueAuthArtifacts,
  signupVoter,
  signupAdmin,
  loginVoter,
  loginAdmin,
  loginWithGoogle,
  loadCurrentUser,
  refreshAuthentication,
  logout,
  publicUserShape,
}
