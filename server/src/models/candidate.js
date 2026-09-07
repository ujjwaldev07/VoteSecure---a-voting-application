const mongoose = require('mongoose')

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    party: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    votes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        votedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    voteCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Candidate', candidateSchema)
