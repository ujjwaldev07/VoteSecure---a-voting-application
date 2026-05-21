const AppError = require('../utils/AppError')

function validateCandidate(req, res, next) {
  const { name, party, age } = req.body

  if (!name || !party || age === undefined) {
    next(new AppError('name, party, and age are required', 400))
    return
  }

  if (Number(age) < 18) {
    next(new AppError('Candidate must be at least 18 years old', 400))
    return
  }

  next()
}

module.exports = { validateCandidate }
