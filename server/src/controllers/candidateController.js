const asyncHandler = require('../middleware/asyncHandler')
const candidateService = require('../services/candidateService')
const { env } = require('../config/env')

const listCandidates = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1)
  const limit = Number(req.query.limit || env.CANDIDATE_PAGE_SIZE)
  const result = await candidateService.listCandidates(page, limit)

  res.json({
    success: true,
    ...result,
  })
})

const createCandidate = asyncHandler(async (req, res) => {
  const candidate = await candidateService.createCandidate(req.body)
  res.status(201).json({
    success: true,
    message: 'Candidate added successfully',
    candidate,
  })
})

const updateCandidate = asyncHandler(async (req, res) => {
  const candidate = await candidateService.updateCandidate(req.params.candidateId, req.body)
  res.json({
    success: true,
    message: 'Candidate updated successfully',
    candidate,
  })
})

const deleteCandidate = asyncHandler(async (req, res) => {
  await candidateService.deleteCandidate(req.params.candidateId)
  res.json({
    success: true,
    message: 'Candidate deleted successfully',
  })
})

module.exports = {
  listCandidates,
  createCandidate,
  updateCandidate,
  deleteCandidate,
}
