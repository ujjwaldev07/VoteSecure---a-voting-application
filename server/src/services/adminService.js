const Candidate = require('../models/candidate')
const User = require('../models/user')
const { cacheKeys } = require('../redis/cacheKeys')
const { CACHE_TTL, getCache, setCache } = require('../cache/cacheService')

async function getAnalytics() {
  const cacheKey = cacheKeys.analytics()
  const cached = await getCache(cacheKey)
  if (cached) {
    return { ...cached, fromCache: true }
  }

  const [candidateCount, voterCount, votedCount, topCandidates] = await Promise.all([
    Candidate.countDocuments(),
    User.countDocuments({ role: 'voter' }),
    User.countDocuments({ role: 'voter', isVoted: true }),
    Candidate.find()
      .select('name party voteCount')
      .sort({ voteCount: -1 })
      .limit(5)
      .lean(),
  ])

  const payload = {
    candidateCount,
    voterCount,
    votedCount,
    turnoutPercentage: voterCount ? Number(((votedCount / voterCount) * 100).toFixed(2)) : 0,
    topCandidates,
  }

  await setCache(cacheKey, payload, CACHE_TTL.SHORT)
  return { ...payload, fromCache: false }
}

module.exports = { getAnalytics }
