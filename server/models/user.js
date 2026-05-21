const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { env } = require('../config/env')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
      index: true,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    authProvider: {
      type: String,
      enum: ['local', 'google'],
      default: 'local',
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    aadharCardNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required() {
        return this.authProvider === 'local'
      },
    },
    role: {
      type: String,
      enum: ['voter', 'admin'],
      default: 'voter',
      index: true,
    },
    isVoted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password') || !this.password) {
    return
  }

  const salt = await bcrypt.genSalt(env.BCRYPT_ROUNDS)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  if (!candidatePassword || !this.password) {
    return Promise.resolve(false)
  }

  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
