const Candidate = require('../models/candidate')
const User = require('../models/user')
const { cacheKeys } = require('../redis/cacheKeys')
const { CACHE_TTL, getCache, setCache, delByPattern } = require('../cache/cacheService')
const AppError = require('../utils/AppError')

async function castVote(candidateId, userId) {
  const [candidate, user] = await Promise.all([
    Candidate.findById(candidateId),
    User.findById(userId),
  ])

  if (!candidate) {
    throw new AppError('Candidate not found', 404)
  }

  if (!user) {
    throw new AppError('User not found', 404)
  }

  if (user.isVoted) {
    throw new AppError('You have already voted', 409)
  }

  candidate.votes.push({ user: userId })
  candidate.voteCount += 1
  user.isVoted = true

  await Promise.all([candidate.save(), user.save()])
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
