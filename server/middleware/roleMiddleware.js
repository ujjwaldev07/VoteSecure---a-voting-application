const AppError = require('../utils/AppError')

function requireRole(...allowedRoles) {
  const normalized = allowedRoles.map((r) => String(r).trim().toLowerCase())

  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Unauthorized', 401))
    }

    const role = String(req.user.role || '').trim().toLowerCase()
    if (!normalized.includes(role)) {
      return next(new AppError('Forbidden: insufficient permissions', 403))
    }

    next()
  }
}

module.exports = { requireRole }
