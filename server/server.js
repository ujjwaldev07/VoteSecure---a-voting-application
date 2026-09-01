const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const compression = require('compression')
const dotenv = require('dotenv')
const cors = require('cors');

dotenv.config()

const { env } = require('./config/env')
const connectDatabase = require('./config/db')
const sessionConfig = require('./sessions/sessionConfig')
const helmetConfig = require('./security/helmet')
const corsConfig = require('./security/cors')
const { csrfProtection, csrfTokenHandler } = require('./security/csrf')
const { globalLimiter } = require('./middleware/rateLimiter')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')
const redisClient = require('./redis/client')

const authRoutes = require('./routes/authRoutes')
const adminRoutes = require('./routes/adminRoutes')
const userRoutes = require('./routes/userRoutes')
const candidateRoutes = require('./routes/candidateRoutes')
const voteRoutes = require('./routes/voteRoutes')
const resultRoutes = require('./routes/resultRoutes')

const app = express()

app.set('trust proxy', 1)

connectDatabase()

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

app.get('/', async(req, res) => {
    console.log('Votesecure API is running successfully');
})

app.use('/auth', authRoutes)
app.use('/admin', adminRoutes)
app.use('/user', userRoutes)
app.use('/candidate', candidateRoutes)
app.use('/vote', voteRoutes)
app.use('/results', resultRoutes)
app.get('/csrf-token', csrfTokenHandler)

app.use(notFound)
app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`)
  console.log(`Environment: ${env.NODE_ENV}`)
})

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
