module.exports = http => {
  const io = require('socket.io')(http, {
    cors: {
      origin: '*'
    }
  })
  return io
}
