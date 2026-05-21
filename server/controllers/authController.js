const asyncHandler = require('../middleware/asyncHandler')
const authService = require('../services/authService')

const signup = asyncHandler(async (req, res) => {
  const user = await authService.signupVoter(req.body)
  authService.assignSession(req, user)
  await authService.issueAuthArtifacts(req, res)

  res.status(201).json({
    success: true,
    message: 'Voter registered successfully',
    user: authService.publicUserShape(user),
  })
})

const signupAdmin = asyncHandler(async (req, res) => {
  const admin = await authService.signupAdmin(req.body)
  authService.assignSession(req, admin)
  await authService.issueAuthArtifacts(req, res)

  res.status(201).json({
    success: true,
    message: 'Admin registered successfully',
    user: authService.publicUserShape(admin),
    admin: authService.publicUserShape(admin),
  })
})

const login = asyncHandler(async (req, res) => {
  const user = await authService.loginVoter(req.body)
  authService.assignSession(req, user)
  await authService.issueAuthArtifacts(req, res)

  res.json({
    success: true,
    message: 'Login successful',
    user: authService.publicUserShape(user),
  })
})

const loginAdmin = asyncHandler(async (req, res) => {
  const admin = await authService.loginAdmin(req.body)
  authService.assignSession(req, admin)
  await authService.issueAuthArtifacts(req, res)

  res.json({
    success: true,
    message: 'Login successful',
    user: authService.publicUserShape(admin),
    admin: authService.publicUserShape(admin),
  })
})

const loginGoogle = asyncHandler(async (req, res) => {
  const user = await authService.loginWithGoogle(req.body)
  authService.assignSession(req, user)
  await authService.issueAuthArtifacts(req, res)

  res.json({
    success: true,
    message: 'Google login successful',
    user: authService.publicUserShape(user),
  })
})

const refresh = asyncHandler(async (req, res) => {
  const user = await authService.refreshAuthentication(req, res)

  res.json({
    success: true,
    message: 'Access token refreshed successfully',
    user: authService.publicUserShape(user),
  })
})

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req, res)
  res.json({
    success: true,
    message: 'Logged out successfully',
  })
})

const me = asyncHandler(async (req, res) => {
  const user = await authService.loadCurrentUser(authService.getSessionUser(req))
  res.json({
    success: true,
    user: authService.publicUserShape(user),
  })
})

const csrfToken = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    csrfToken: req.csrfToken(),
  })
})

module.exports = {
  signup,
  signupAdmin,
  login,
  loginAdmin,
  loginGoogle,
  refresh,
  logout,
  me,
  csrfToken,
}
