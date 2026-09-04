const AppError = require('../utils/AppError')

function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => req.body[field] === undefined || req.body[field] === '')
    if (missing.length) {
      next(new AppError(`Missing required fields: ${missing.join(', ')}`, 400))
      return
    }

    next()
  }
}

function validateVoterSignup(req, res, next) {
  const { name, age, password, mobile, address, aadharCardNumber, email } = req.body

  if (!name || String(name).trim().length < 2) {
    next(new AppError('Name must be at least 2 characters', 400))
    return
  }

  if (!address || String(address).trim().length < 5) {
    next(new AppError('Address must be at least 5 characters', 400))
    return
  }

  if (!Number.isInteger(Number(age)) || Number(age) < 18 || Number(age) > 120) {
    next(new AppError('Voter must be at least 18 years old', 400))
    return
  }

  if (!/^\d{10}$/.test(String(mobile || ''))) {
    next(new AppError('Mobile must be 10 digits', 400))
    return
  }

  if (!/^\d{12}$/.test(String(aadharCardNumber || ''))) {
    next(new AppError('Aadhar must be 12 digits', 400))
    return
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '')) && email !== undefined) {
    next(new AppError('Invalid email format', 400))
    return
  }

  if (
    String(password || '').length < 8 ||
    !/[A-Z]/.test(String(password)) ||
    !/[0-9]/.test(String(password))
  ) {
    next(new AppError('Password must be at least 8 characters and include an uppercase letter and number', 400))
    return
  }

  next()
}

module.exports = {
  requireFields,
  validateVoterSignup,
}
