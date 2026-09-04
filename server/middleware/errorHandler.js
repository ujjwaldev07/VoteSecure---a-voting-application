const AppError = require('../utils/AppError')

function normalizeError(error) {
  if (error instanceof AppError) {
    return error
  }

  if (error?.code === 11000) {
    const field = Object.keys(error.keyPattern || error.keyValue || {})[0]
    return new AppError(`${field} already exists`, 409)
  }

  if (error?.name === 'ValidationError') {
    const first = Object.values(error.errors)[0]
    return new AppError(first?.message || 'Validation failed', 400)
  }

  if (error?.name === 'CastError') {
    return new AppError('Invalid request data', 400)
  }

  if (['JsonWebTokenError', 'TokenExpiredError', 'NotBeforeError'].includes(error?.name)) {
    return new AppError('Invalid or expired authentication token', 401)
  }

  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return new AppError('Malformed JSON request body', 400)
  }

  if (error?.code === 'EBADCSRFTOKEN') {
    return new AppError('Invalid CSRF token', 403)
  }

  return new AppError('Internal server error', 500)
}

module.exports = (error, req, res, next) => {
  const normalized = normalizeError(error)

  if (process.env.NODE_ENV !== 'production' && normalized.statusCode >= 500) {
    console.error(error)
  }

  res.status(normalized.statusCode).json({
    success: false,
    message: normalized.message,
    error: normalized.message,
    details: normalized.details || undefined,
  })
}
