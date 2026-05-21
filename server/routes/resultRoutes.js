const express = require('express')
const controller = require('../controllers/voteController')
const { apiLimiter } = require('../middleware/rateLimiter')

const router = express.Router()

router.get('/', apiLimiter, controller.getResults)

module.exports = router
