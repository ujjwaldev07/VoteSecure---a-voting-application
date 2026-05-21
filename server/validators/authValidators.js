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
  const { age, password, mobile, aadharCardNumber } = req.body

  if (Number(age) < 18) {
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

  if (String(password || '').length < 8) {
    next(new AppError('Password must be at least 8 characters', 400))
    return
  }

  next()
}

module.exports = {
  requireFields,
  validateVoterSignup,
}
