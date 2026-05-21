const express = require('express')
const authController = require('../controllers/authController')
const adminController = require('../controllers/adminController')
const { isAuthenticated, isAdmin } = require('../middleware/authMiddleware')
const { authLimiter, apiLimiter, bruteForceLimiter } = require('../middleware/rateLimiter')
const { requireFields } = require('../validators/authValidators')

const router = express.Router()

router.post('/signup', authLimiter, requireFields(['name', 'email', 'password']), authController.signupAdmin)
router.post('/login', authLimiter, bruteForceLimiter, requireFields(['email', 'password']), authController.loginAdmin)
router.get('/profile', apiLimiter, isAuthenticated, isAdmin, adminController.profile)
router.get('/analytics', apiLimiter, isAuthenticated, isAdmin, adminController.analytics)

module.exports = router
