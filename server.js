const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let participants = [];

app.use(express.static(__dirname));

io.on('connection', (socket) => {
  let username = '';

  socket.on('join', (name) => {
    username = name;
    participants.push(username);
    io.emit('participants', participants);
  });

  socket.on('drawing', (data) => {
    socket.broadcast.emit('drawing', data);
  });

  socket.on('disconnect', () => {
    participants = participants.filter((user) => user !== username);
    io.emit('participants', participants);
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
