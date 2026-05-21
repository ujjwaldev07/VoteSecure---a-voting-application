const asyncHandler = require('../middleware/asyncHandler')
const Admin = require('../models/admin')
const AppError = require('../utils/AppError')
const { publicUserShape } = require('../utils/sanitize')
const { getAnalytics } = require('../services/adminService')

const profile = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.session.userId).lean()
  if (!admin) {
    throw new AppError('Admin not found', 404)
  }

  res.json({
    success: true,
    admin: publicUserShape(admin),
  })
})

const analytics = asyncHandler(async (req, res) => {
  const payload = await getAnalytics()
  res.json({
    success: true,
    ...payload,
  })
})

module.exports = {
  profile,
  analytics,
}
