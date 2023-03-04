const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const formatMessage = require('./utils/messages')
const userJoin = require('./utils/users')
const {userLeave,getCurrentUser} = require('./utils/users')
const getRoomUsers = require('./utils/users')
 
const app = express()
const server = http.createServer(app)
const io = socketio(server)

////// set static folder
app.use(express.static(path.join(__dirname,'public')))

const botName = 'ChatCord Bot'

///////// run when a client connects
io.on('connection', socket=>{
  socket.on('joinRoom',({username,room})=>{
    const user = userJoin(socket.id,username,room,)

    socket.join(user.room)

///////////////// welcome current user
socket.emit('message',formatMessage(botName,'Welcome to a chat corda'))

//////// broadcast when a user connect
socket.broadcast.
to(user.room).
emit('message',formatMessage(botName,`${user.username} has joined the chat`))
})
 


////////// Send Users and room information
io.to(user.room).emit('rooomUsers',{
    room:user.room,
    users:getRoomUsers(user.room)
  })



///// Listen for chatMessag
socket.on('chatMessage',(msg)=>{
  const user = getCurrentUser(socket.id)
io.to(user.room).
emit('message',formatMessage(user.username,msg))
})



  ///////// runs when a client dissconnects
  socket.on('disconnect',()=>{
    const user = userLeave(socket.id)

    if(user){
      io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`))
    }



////////// Send Users and room information
io.to(user.room).emit('rooomUsers',{
  room:user.room,
  users:getRoomUsers(user.room)
})

  })


})




const PORT = 3000 || process.env.PORT








server.listen(PORT,()=>{
  console.log(`server running on port number ${PORT}`);
})