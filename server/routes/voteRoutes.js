const express = require('express')
const controller = require('../controllers/voteController')
const { isAuthenticated, isVoter } = require('../middleware/authMiddleware')
const { apiLimiter } = require('../middleware/rateLimiter')

const router = express.Router()

router.post('/', apiLimiter, isAuthenticated, isVoter, controller.castVote)

module.exports = router
