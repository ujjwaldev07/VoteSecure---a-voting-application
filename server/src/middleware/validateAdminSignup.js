const AppError = require('../utils/AppError')

function validateAdminSignup(req, res, next) {
  try {
    const { name, email, password } = req.body

    if (!name || !String(name).trim()) {
      throw new AppError('Name is required', 400)
    }

    if (!email || !String(email).trim()) {
      throw new AppError('Email is required', 400)
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(String(email).trim())) {
      throw new AppError('Invalid email format', 400)
    }

    if (!password || String(password).length < 8) {
      throw new AppError('Password must be at least 8 characters', 400)
    }

    req.body = {
      name: String(name).trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password),
    }

    next()
  } catch (err) {
    next(err)
  }
}

module.exports = validateAdminSignup
