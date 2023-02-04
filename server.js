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
  console.log(socket.id)

  // join room
  socket.on('join', async (gameId, cb) => {
    try {
      await socket.join(gameId)
      console.log('joined', gameId)
      cb()
    } catch (error) {
      console.log(error)
    }
  })

  // move made
  socket.on('move_made', async (room, row, col) => {
    console.log(room, row, col)
    socket.to(room).emit('update_board', row, col)
  })

  // finish
  socket.on('finshed', async (message, room) => {
    console.log('finish', message, room)
    socket.to(room).emit('result', message)
  })
})

// io.on('connection', socket => {
//   socket.on('join', async room_id => {
//     console.log('a user want to join', room_id)
//     await socket.join(room_id)
//   })

//   socket.on('login', async data => {
//     const user = await User.findOne({ username: data.username })

//     // const oyo_room = await Room.findOne({ uID: room_id })
//     // .catch((err) => {
//     //     console.log('error occured while checking room',err)
//     // });

//     // if ( oyo_room && oyo_room.noOfUser === 2 ) {
//     //     io.to(room_id).emit('youCanPLayNow');
//     // }
//   })

//
//   // incoming message from chat.js
//   socket.on('sendMessage', async ({ message, name, user_id, room_id }) => {
//     const msgToStore = {
//       name,
//       user_id,
//       room_id,
//       text: message
//     }

//     io.to(room_id).emit('messageReceived', msgToStore)
//   })

//   socket.on('playAgain', room_id => {
//     io.to(room_id).emit('playAgainReceived')
//   })
// })

// Start Up Server
// const PORT = process.env.PORT || 5000
// http.listen(PORT, () => {
//   console.log('Backend Server listing at PORT:', PORT)
// })

server.listen(5000, () => {
  console.log('Server is listening at 5000')
})
