const helmet = require('helmet')

module.exports = helmet({
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
  referrerPolicy: { policy: 'no-referrer' },
})
