const cors = require('cors')
const { env } = require('../config/env')

const AppError = require('../utils/AppError')
const allowedOrigins = env.CLIENT_ORIGINS

module.exports = cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    callback(new AppError('Origin is not allowed', 403))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-CSRF-Token', 'Authorization'],
  optionsSuccessStatus: 204,
})
