const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: [true, 'room id must be unique']
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  games: {
    type: Array,
    default: []
  }
})

const User = mongoose.model('User', userSchema)
module.exports = User
