const mongoose = require('mongoose')

const gameSchema = new mongoose.Schema(
  {
    users: {
      type: Array,
      default: []
    },
    finished: {
      type: Boolean,
      default: false
    },
    wonby: {
      type: String,
      default: ''
    },
    room: {
      type: String
    }
  },
  {
    timestamps: true
  }
)

const Game = mongoose.model('Game', gameSchema)
module.exports = Game
