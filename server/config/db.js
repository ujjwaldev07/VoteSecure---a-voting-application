const mongoose = require('mongoose')
const { env } = require('./env')

let connectionPromise = null

async function connectDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose.connection
  if (connectionPromise) return connectionPromise

  connectionPromise = mongoose
    .connect(env.MONGODB_URI, {
      autoIndex: !env.IS_PRODUCTION,
      serverSelectionTimeoutMS: 10_000,
    })
    .then(() => {
      console.log('MongoDB connected')
      return mongoose.connection
    })
    .catch((error) => {
      connectionPromise = null
      throw error
    })

  const db = mongoose.connection

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error)
  })

  db.on('disconnected', () => {
    console.log('MongoDB disconnected')
  })

  return connectionPromise
}

module.exports = connectDatabase
