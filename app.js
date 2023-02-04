const express = require('express')
const app = express()
const bcrypt = require('bcrypt')

const User = require('./models/User')

const cors = require('cors')
const Game = require('./models/Games')

const corsOptions = {
  origin: '*'
}
app.use(cors(corsOptions))
app.use(express.json())

// REGISTER
app.post('/register', async (req, res) => {
  try {
    // generate new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    // create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      name: req.body.name,
      password: hashedPassword
    })

    // save user and respond
    const user = await newUser.save()
    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).json(err)
  }
})

app.post('/start_game', async (req, res) => {
  try {
    const newGame = new Game({
      users: [req.body.p1, req.body.p2],
      room: req.body.p1
    })
    const game = await newGame.save()
    const u1 = await User.findOne({ email: req.body.p1 })
    const u2 = await User.findOne({ email: req.body.p2 })

    await u1.updateOne({ $push: { games: game._id } })
    await u2.updateOne({ $push: { games: game._id } })

    return res.status(200).json(game)
  } catch (err) {
    return res.status(500).json(err)
  }
})

app.post('/get_games', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    const games = await Promise.all(
      user.games.map(async gameId => {
        const game = await Game.findById(gameId)
        return game
      })
    )
    return res.status(200).json(games)
  } catch (err) {
    console.log(err)
    return res.status(500).json(err)
  }
})

// LOGIN
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    if (!user) {
      return res.status(404).json('user not found')
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!validPassword) {
      return res.status(400).json('wrong password')
    }
    return res.status(200).json(user)
  } catch (err) {
    return res.status(500).json(err)
  }
})

module.exports = app
