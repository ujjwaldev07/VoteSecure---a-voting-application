const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { env } = require('../config/env')

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  { timestamps: true }
)

adminSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) {
    next()
    return
  }

  const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

adminSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  if (!candidatePassword || !this.password) {
    return Promise.resolve(false)
  }

  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('Admin', adminSchema)
