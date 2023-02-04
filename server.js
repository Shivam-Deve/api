const app = require('./app')
const http = require('http')
const mongoose = require('mongoose')
// const dotenv = require('dotenv')
const socketServer = require('./socket')
const server = http.createServer(app)

// dotenv.config()
const URL="mongodb+srv://shivam:Shivam1547@cluster0.a5dc7nw.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
mongoose.connection.on('error', function (err) {
  console.log('Could not connect to mongo server!')
  return console.log(err)
})
mongoose.connection.on('open', function () {
  return console.log('Db connected!')
})

const io = socketServer(server)

io.on('connection', socket => {
  // join room
  socket.on('join', async (gameId, cb) => {
    try {
      await socket.join(gameId)
      cb()
    } catch (error) {
      console.log(error)
    }
  })

  // move made
  socket.on('move_made', async (room, row, col) => {
    try {
      await socket.to(room).emit('update_board', row, col)
    } catch (err) {
      console.log(err)
    }
  })

  // finish
  socket.on('finshed', async (message, room) => {
    try {
      socket.to(room).emit('result', message)
    } catch (error) {
      console.log(error)
    }
  })
})

server.listen(5000, () => {
  console.log('Server is listening at 5000')
})
