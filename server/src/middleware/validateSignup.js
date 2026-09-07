const AppError = require('../utils/AppError')

const SIGNUP_FIELDS = [
  'name',
  'age',
  'mobile',
  'address',
  'aadharCardNumber',
  'password',
]

function validateSignup(req, res, next) {
  try {
    const body = req.body

    if (!body || typeof body !== 'object') {
      throw new AppError('Request body is required', 400)
    }

    for (const field of SIGNUP_FIELDS) {
      const value = body[field]
      if (value === undefined || value === null || value === '') {
        throw new AppError(`${formatField(field)} is required`, 400)
      }
    }

    const age = Number(body.age)
    if (!Number.isFinite(age) || age < 18) {
      throw new AppError('Age must be 18 or older', 400)
    }

    if (!/^\d{10}$/.test(String(body.mobile).trim())) {
      throw new AppError('Mobile number must be 10 digits', 400)
    }

    if (!/^\d{12}$/.test(String(body.aadharCardNumber).trim())) {
      throw new AppError('Aadhar number must be 12 digits', 400)
    }

    if (String(body.password).length < 8) {
      throw new AppError('Password must be at least 8 characters', 400)
    }

    if (body.email === '') {
      delete body.email
    }

    delete body.confirmPassword

    req.body = {
      ...body,
      age,
      mobile: String(body.mobile).trim(),
      aadharCardNumber: String(body.aadharCardNumber).trim(),
      name: String(body.name).trim(),
      address: String(body.address).trim(),
    }

    next()
  } catch (err) {
    next(err)
  }
}

function formatField(field) {
  const labels = {
    aadharCardNumber: 'Aadhar number',
  }
  return labels[field] || field.charAt(0).toUpperCase() + field.slice(1)
}

module.exports = validateSignup
