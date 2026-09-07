require('dotenv').config()

const mongoose = require('mongoose')
const { env } = require('../config/env')
const User = require('../models/user')
const Admin = require('../models/admin')
const Candidate = require('../models/candidate')

async function ensureUniqueSparseIndex(field) {
  const indexName = `${field}_1`
  const existing = (await User.collection.indexes()).find((index) => index.name === indexName)

  if (existing?.unique && existing.sparse) return

  const duplicates = await User.aggregate([
    { $match: { [field]: { $type: 'string' } } },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } },
    { $match: { count: { $gt: 1 } } },
    { $limit: 1 },
  ])

  if (duplicates.length) {
    throw new Error(`Cannot create unique users.${field} index while duplicate values exist`)
  }

  if (existing) {
    await User.collection.dropIndex(indexName)
  }

  await User.collection.createIndex({ [field]: 1 }, { name: indexName, sparse: true, unique: true })
}

async function createIndexes() {
  await mongoose.connect(env.MONGODB_URI)
  await Promise.all([
    ensureUniqueSparseIndex('email'),
    ensureUniqueSparseIndex('mobile'),
    ensureUniqueSparseIndex('aadharCardNumber'),
    ensureUniqueSparseIndex('googleId'),
  ])
  await Promise.all([User.createIndexes(), Admin.createIndexes(), Candidate.createIndexes()])
  console.log('MongoDB indexes created successfully')
  await mongoose.disconnect()
}

createIndexes().catch(async (error) => {
  console.error('Failed to create MongoDB indexes:', error.message)
  await mongoose.disconnect()
  process.exit(1)
})
