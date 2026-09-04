function sanitizeUser(user) {
  const doc = user?.toObject ? user.toObject() : { ...user }
  delete doc.password
  delete doc.googleId
  return doc
}

function publicUserShape(user) {
  const safeUser = sanitizeUser(user)
  return {
    _id: safeUser._id,
    name: safeUser.name,
    email: safeUser.email,
    role: safeUser.role,
    age: safeUser.age,
    mobile: safeUser.mobile,
    address: safeUser.address,
    aadharLast4: safeUser.aadharCardNumber ? String(safeUser.aadharCardNumber).slice(-4) : undefined,
    isVoted: safeUser.isVoted,
  }
}

module.exports = {
  sanitizeUser,
  publicUserShape,
}
