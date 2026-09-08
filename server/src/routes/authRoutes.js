const express = require('express')
const controller = require('../controllers/authController')
const { isAuthenticated } = require('../middleware/authMiddleware')
const { authLimiter, bruteForceLimiter } = require('../middleware/rateLimiter')
const { requireFields, validateVoterSignup } = require('../validators/authValidators')
const validateAdminSignup = require('../middleware/validateAdminSignup')

const router = express.Router()

router.get('/csrf', controller.csrfToken)
router.get('/me', isAuthenticated, controller.me)
router.post('/refresh', controller.refresh)
router.post('/logout', isAuthenticated, controller.logout)

router.post('/signup', authLimiter, requireFields(['name', 'age', 'mobile', 'address', 'aadharCardNumber', 'password']), validateVoterSignup, controller.signup)
router.post('/signup/voter', authLimiter, requireFields(['name', 'age', 'mobile', 'address', 'aadharCardNumber', 'password']), validateVoterSignup, controller.signup)
router.post('/signup/admin', authLimiter, validateAdminSignup, controller.signupAdmin)

router.post('/login', authLimiter, bruteForceLimiter, requireFields(['password']), controller.login)
router.post('/login/voter', authLimiter, bruteForceLimiter, requireFields(['password']), controller.login)
router.post('/login/admin', authLimiter, bruteForceLimiter, requireFields(['email', 'password']), controller.loginAdmin)
router.post('/google', authLimiter, controller.loginGoogle)

module.exports = router
