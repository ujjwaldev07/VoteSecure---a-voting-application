const csurf = require('csurf')
const { env } = require('../config/env')

const csrfProtection = csurf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    sameSite: env.COOKIE_SAME_SITE,
    secure: env.COOKIE_SECURE,
    signed: true,
  },
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
})

function csrfTokenHandler(req, res) {
  res.json({
    success: true,
    csrfToken: req.csrfToken(),
  })
}

module.exports = {
  csrfProtection,
  csrfTokenHandler,
}
