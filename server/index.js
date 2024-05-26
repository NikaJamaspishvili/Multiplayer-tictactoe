let express = require('express');
let app = express();
let http = require('http');
let cors = require('cors');
let { Server } = require('socket.io');

require('dotenv').config();

app.use(cors());

const server = http.createServer(app);

let io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL
  }
});

let rooms = new Map();

io.on('connection', (socket) => {
  let currentRoom;

  socket.on('join_room', () => {
    console.log(rooms);

    for (const [key, set] of rooms.entries()) {
      if (set.size === 1) {
        currentRoom = key;
        rooms.get(key).add(socket.id);
        socket.join(key);
        console.log('user with id ' + socket.id + ' has joined room ' + key);
        socket.to(currentRoom).emit('joinedRoom',{message: 'user has joined the room',status:1,moveOption: 'x'});
        break;
      }
    }

    if (!currentRoom) {
      let roomId = Math.random().toString(36).substring(7);
      rooms.set(roomId, new Set([socket.id]));
      currentRoom = roomId;
      socket.join(roomId);
      console.log('user has created the room with id ' + roomId);
    }

    socket.currentRoom = currentRoom;
  });

  socket.on('disconnecting', () => {
    const roomId = socket.currentRoom;
    if (roomId) {
      const users = rooms.get(roomId);
      if (users) {
        users.delete(socket.id);
        console.log('user with id ' + socket.id + ' has been removed from room ' + roomId);

        if (users.size === 0) {
          rooms.delete(roomId);
          console.log('room with id ' + roomId + ' has been deleted');
        }else{
        socket.to(roomId).emit('userDisconnected',{message:'Your opponent has disconnected from match, please wait until we find a new user',status:1})
      }
        
    }
  }});

  socket.on('sendArray', (object) => {
    const roomId = socket.currentRoom;
    socket.array = object.tempoArray;
    if (roomId) {
      socket.to(roomId).emit('receiveArray', object);
    }
  });

  socket.on('restartGame',(object)=>{
 console.log('check');
  socket.to(socket.currentRoom).emit('clientRestartGame',object);

  })

});

server.listen(3000, () => { console.log('server is running on port 3000') });
