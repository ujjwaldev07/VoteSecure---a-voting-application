const mongoose = require('mongoose')
const { env } = require('./env')

let connected = false

function connectDatabase() {
  if (connected) return mongoose.connection

  mongoose.connect(env.MONGODB_URI, {
    autoIndex: !env.IS_PRODUCTION,
  })

  const db = mongoose.connection

  db.on('connected', () => {
    connected = true
    console.log('MongoDB connected')
  })

  db.on('error', (error) => {
    console.error('MongoDB connection error:', error)
  })

  db.on('disconnected', () => {
    connected = false
    console.log('MongoDB disconnected')
  })

  return db
}

module.exports = connectDatabase
