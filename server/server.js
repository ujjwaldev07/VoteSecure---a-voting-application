const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const compression = require('compression')
const dotenv = require('dotenv')

dotenv.config()

const { env } = require('./src/config/env')
const connectDatabase = require('./src/config/db')
const sessionConfig = require('./src/sessions/sessionConfig')
const helmetConfig = require('./src/security/helmet')
const corsConfig = require('./src/security/cors')
const { csrfProtection, csrfTokenHandler } = require('./src/security/csrf')
const { globalLimiter } = require('./src/middleware/rateLimiter')
const notFound = require('./src/middleware/notFound')
const errorHandler = require('./src/middleware/errorHandler')
const redisClient = require('./src/redis/client')

const authRoutes = require('./src/routes/authRoutes')
const adminRoutes = require('./src/routes/adminRoutes')
const userRoutes = require('./src/routes/userRoutes')
const candidateRoutes = require('./src/routes/candidateRoutes')
const voteRoutes = require('./src/routes/voteRoutes')
const resultRoutes = require('./src/routes/resultRoutes')

const app = express()

app.set('trust proxy', env.TRUST_PROXY)

app.use(helmetConfig)
app.use(compression())
app.use(corsConfig)
app.use(cookieParser(env.COOKIE_SECRET))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(session(sessionConfig))
app.use(globalLimiter)
app.use(csrfProtection)

app.get('/health', async (req, res) => {
  const redisStatus = redisClient.status
  res.json({
    success: true,
    status: 'ok',
    environment: env.NODE_ENV,
    redis: redisStatus,
  })
})

app.get('/', (req, res) => {
  res.json({ success: true, message: 'VoteSecure API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/auth/admin', adminRoutes)
app.use('/api/auth/user', userRoutes)
app.use('/api/auth/candidate', candidateRoutes)
app.use('/api/vote', voteRoutes)
app.use('/api/results', resultRoutes)
app.get('/api/csrf-token', csrfTokenHandler)

app.use(notFound)
app.use(errorHandler)

async function startServer() {
  await connectDatabase()
  app.listen(env.PORT, () => {
    console.log(`Server listening on port ${env.PORT}`)
    console.log(`Environment: ${env.NODE_ENV}`)
  })
}

startServer().catch((error) => {
  console.error('Unable to start VoteSecure API:', error.message)
  process.exit(1)
})
