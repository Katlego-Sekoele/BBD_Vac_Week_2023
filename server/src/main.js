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

let lobbies = []
io.on('connection', (socket) => {
  console.log('a user connected with ID: ' + socket.id);

  socket.on('disconnect', () => {
    console.log('a user disconnected with ID: ' + socket.id);
  });

  // player requests to join a lobby
  socket.on('join_lobby', (data) => {

    if (!data) {
      //empty or null data
      return;
    }

    if (!(data.gamecode in lobbies)){
      // lobby does not exist
      return;
    }

    for (let i = 0; i < lobbies.length; i++){
      if (lobbies[i].gamecode === data.gamecode){
        lobbies[i].players.push(data.username)
      }
    }

    console.log('join_lobby: ' , data);
    //assumes that the users lobby code is correct

    // server response to game master to notifying that a player has joined
    socket.emit('player_joined', {...data})

    // game master response confirming receipt of player_joined event
    socket.on('player_in_lobby', () => {

      // server response to client notifying them that they are in the lobby
      socket.emit('joined_lobby', {response: "success"});
    })

  });

  socket.on("create_lobby", (data) => {
    let numPlayers = data.size
    let lobbyCode = 0 // TODO: generate lobby codes

    lobbies.push({lobbyCode, players: []})

    socket.emit('created_lobby');
  });

});

// Controller, Quiz, Duel connections ---------------------------------
BallCamController = require('./controller/main.controller')
BallCamController.mainMoveLeft(1000)

DuelEngine = require('./duel/duelEngine')
DuelEngine.initMap()

QuizEngine = require('./quiz/quizEngine')
QuizEngine.generateQuestions()





