const asyncHandler = require('../middleware/asyncHandler')
const voteService = require('../services/voteService')

const castVote = asyncHandler(async (req, res) => {
  const candidateId = req.body.candidateId || req.params.candidateId
  await voteService.castVote(candidateId, req.session.userId)

  res.json({
    success: true,
    message: 'Vote recorded successfully',
  })
})

const getResults = asyncHandler(async (req, res) => {
  const payload = await voteService.getResults()
  res.json({
    success: true,
    ...payload,
  })
})

module.exports = {
  castVote,
  getResults,
}
