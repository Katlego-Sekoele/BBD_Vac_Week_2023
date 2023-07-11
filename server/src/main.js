const cors = require('cors');
const express = require('express');
const app = express();
const http = require('http');

app.use(function(req, res, next) {
  const allowedOrigins = ['http://localhost:3000', 'address of our hosted frontend'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
       res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use("/", express.static("../1_player"));
app.use("/gm", express.static("../5_gm/app"));

const server = http.createServer(app);

const io = require('socket.io')(server, {
  cors: {origin: '*'}
});

server.listen(3000, () => console.log('listening on http://localhost:3000'));



const allSockets = [];

io.on('connection', (socket) => {
  allSockets.push(socket);

  console.log('a user connected with ID: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('a user disconnected with ID: ' + socket.id);
  });

  socket.on('join_lobby', (data) => {
    console.log('join_lobby: ' , data);
    //assumes that the users lobby code is correct
    socket.emit('joined_lobby', "hey you joined the lobby");
  });

  socket.on("create_lobby", () => {
    console.log('lobby created');
    socket.emit('created_lobby');
  });

  socket.broadcast.on("start", () => {
    console.log('lobby created');
    socket.emit('startGame');
  });

  socket.on("move_ball", (msg) => {
    console.log(msg);
    socket.emit("response", "ball moved!");
    for(const socket of allSockets) {
      socket.emit("on_ball_control", msg);
    }
  })

});





