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

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {origin: '*'}
})
server.listen(3000, () => console.log('listening on http://localhost:3000'));




io.on('connection', (socket) => {

  socket.on('disconnect', () => {
    disconnectHandler(socket);
  });

  socket.on('join_lobby', (data) => {
    console.log('join_lobby: ' + data);
    //assumes that the users lobby code is correct
    socket.emit('joined_lobby', "hey you joined the lobby");
  });


});





// Function removes a player from the activePlayers list.
function disconnectHandler(socket) {
  console.log('a user disconnected with ID: ' + socket.id);
}
