const express = require('express')
const User = require('../models/user')
const { isAuthenticated } = require('../middleware/authMiddleware')
const { apiLimiter } = require('../middleware/rateLimiter')
const asyncHandler = require('../middleware/asyncHandler')
const AppError = require('../utils/AppError')
const { publicUserShape } = require('../utils/sanitize')

const router = express.Router()

router.get('/profile', apiLimiter, isAuthenticated, asyncHandler(async (req, res) => {
  const user = await User.findById(req.session.userId).lean()
  if (!user) {
    throw new AppError('User not found', 404)
  }

  res.json({
    success: true,
    user: publicUserShape(user),
  })
}))

router.put('/profile/password', apiLimiter, isAuthenticated, asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    throw new AppError('Current and new password are required', 400)
  }

  if (String(newPassword).length < 8) {
    throw new AppError('New password must be at least 8 characters', 400)
  }

  const user = await User.findById(req.session.userId)
  if (!user) {
    throw new AppError('User not found', 404)
  }

  const valid = await user.comparePassword(currentPassword)
  if (!valid) {
    throw new AppError('Current password is incorrect', 401)
  }

  user.password = newPassword
  await user.save()

  res.json({
    success: true,
    message: 'Password updated successfully',
  })
}))

module.exports = router
