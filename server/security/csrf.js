const csurf = require('csurf')
const { env } = require('../config/env')

const csrfProtection = csurf({
  cookie: {
    key: '_csrf',
    httpOnly: true,
    sameSite: 'strict',
    secure: env.IS_PRODUCTION,
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
