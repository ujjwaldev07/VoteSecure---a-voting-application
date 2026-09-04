const Candidate = require('../models/candidate')
const User = require('../models/user')
const mongoose = require('mongoose')
const { cacheKeys } = require('../redis/cacheKeys')
const { CACHE_TTL, getCache, setCache, delByPattern } = require('../cache/cacheService')
const AppError = require('../utils/AppError')

async function castVote(candidateId, userId) {
  if (!mongoose.isValidObjectId(candidateId)) {
    throw new AppError('Invalid candidate ID', 400)
  }

  const session = await mongoose.startSession()

  try {
    await session.withTransaction(async () => {
      const user = await User.findOneAndUpdate(
        { _id: userId, role: 'voter', isVoted: false },
        { $set: { isVoted: true } },
        { returnDocument: 'after', session }
      )

      if (!user) {
        const existingUser = await User.exists({ _id: userId, role: 'voter' }).session(session)
        if (!existingUser) {
          throw new AppError('User not found', 404)
        }
        throw new AppError('You have already voted', 409)
      }

      const candidate = await Candidate.findByIdAndUpdate(
        candidateId,
        {
          $inc: { voteCount: 1 },
          $push: { votes: { user: userId } },
        },
        { returnDocument: 'after', session }
      )

      if (!candidate) {
        throw new AppError('Candidate not found', 404)
      }
    })
  } finally {
    await session.endSession()
  }

  await delByPattern('results:*')
  await delByPattern('analytics:*')
  await delByPattern('candidates:*')
}

async function getResults() {
  const cacheKey = cacheKeys.results()
  const cached = await getCache(cacheKey)
  if (cached) {
    return { results: cached, fromCache: true }
  }

  const results = await Candidate.find()
    .select('name party voteCount')
    .sort({ voteCount: -1, name: 1 })
    .lean()

  const normalized = results.map((candidate) => ({
    _id: candidate._id,
    name: candidate.name,
    party: candidate.party,
    count: candidate.voteCount,
  }))

  await setCache(cacheKey, normalized, CACHE_TTL.SHORT)
  return { results: normalized, fromCache: false }
}

module.exports = {
  castVote,
  getResults,
}
