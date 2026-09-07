const express = require('express')
const controller = require('../controllers/candidateController')
const voteController = require('../controllers/voteController')
const { isAuthenticated, isAdmin, isVoter } = require('../middleware/authMiddleware')
const { apiLimiter } = require('../middleware/rateLimiter')
const { validateCandidate } = require('../validators/candidateValidators')

const router = express.Router()

router.get('/', apiLimiter, controller.listCandidates)
router.get('/vote/count', apiLimiter, voteController.getResults)
router.post('/', apiLimiter, isAuthenticated, isAdmin, validateCandidate, controller.createCandidate)
router.put('/:candidateId', apiLimiter, isAuthenticated, isAdmin, controller.updateCandidate)
router.delete('/:candidateId', apiLimiter, isAuthenticated, isAdmin, controller.deleteCandidate)
router.post('/vote/:candidateId', apiLimiter, isAuthenticated, isVoter, voteController.castVote)

module.exports = router
