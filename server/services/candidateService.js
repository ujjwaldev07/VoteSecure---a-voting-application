const Candidate = require('../models/candidate')
const { cacheKeys } = require('../redis/cacheKeys')
const { CACHE_TTL, getCache, setCache, delByPattern } = require('../cache/cacheService')
const AppError = require('../utils/AppError')

async function listCandidates(page = 1, limit = 10) {
  const cacheKey = cacheKeys.candidates(page, limit)
  const cached = await getCache(cacheKey)
  if (cached) {
    return { ...cached, fromCache: true }
  }

  const skip = (page - 1) * limit
  const [candidates, total] = await Promise.all([
    Candidate.find()
      .select('name party age voteCount createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Candidate.countDocuments(),
  ])

  const payload = {
    candidates,
    count: total,
    page,
    pages: Math.ceil(total / limit) || 1,
  }

  await setCache(cacheKey, payload, CACHE_TTL.MEDIUM)
  return { ...payload, fromCache: false }
}

async function createCandidate(payload) {
  const candidate = await Candidate.create(payload)
  await delByPattern('candidates:*')
  await delByPattern('results:*')
  await delByPattern('analytics:*')
  return candidate
}

async function updateCandidate(candidateId, payload) {
  const candidate = await Candidate.findByIdAndUpdate(candidateId, payload, {
    new: true,
    runValidators: true,
  })

  if (!candidate) {
    throw new AppError('Candidate not found', 404)
  }

  await delByPattern('candidates:*')
  await delByPattern('results:*')
  await delByPattern('analytics:*')
  return candidate
}

async function deleteCandidate(candidateId) {
  const candidate = await Candidate.findByIdAndDelete(candidateId)
  if (!candidate) {
    throw new AppError('Candidate not found', 404)
  }

  await delByPattern('candidates:*')
  await delByPattern('results:*')
  await delByPattern('analytics:*')
}

module.exports = {
  listCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
}
