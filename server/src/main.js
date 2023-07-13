const express = require("express");
const app = express();
const http = require("http");

const DuelEngine = require("./duel/duelEngine");
const QuizEngine = require("../../2_quiz/QuizGenQuestionGenerator");

app.use("/", express.static("../1_player"));
app.use("/gm", express.static("../5_gm/app"));

app.use(express.static("../1_player"));
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});
server.listen(3000, () => console.log("listening on http://localhost:3000"));

const kPointUnit = 10;

let gameIsRunning = false;
let quizRunning = false;
let allSockets = [];
let players = [];
let playerCounter = 0;

let playerWhoAnsweredFirstId = -1;
let currentQuestion = undefined;

function getPlayerWithSocket(socket) {
  return players.find((value) => value.socketId === socket.id);
}

function removePlayer(player) {
  players = players.filter((value) => value.socketId !== player.socketId);
}


function genCode() {
  let lobbyID = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let i = 0; i < 4; i++) {
    lobbyID += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return lobbyID;
}
const mainGameCode = genCode();

io.on("connection", (socket) => {
  allSockets.push(socket);
  socket.emit("lobby_code", mainGameCode);

  console.log("a user connected with ID: " + socket.id);

  socket.on("disconnect", () => {
    console.log("a user disconnected with ID: " + socket.id);
    allSockets = allSockets.filter((value) => value.id !== socket.id);
    players = players.filter((value) => value.socketId !== socket.id);

    if (players.length === 0) {
      gameIsRunning = false;
    }

    io.emit("current_players", players);
  });

  socket.on("restart", () => {
    io.emit("on_game_restart", {});
  });

  // player requests to join a lobby
  socket.on("join_lobby", (data) => {
    if (gameIsRunning) {
      socket.emit("on_error", "Game is already running.");
      return;
    }
    if(quizRunning){
      socket.emit("on_error_lobby", "Quiz is already running.");
      return;
    }

    if (data.gameCode !== mainGameCode) {
      socket.emit("on_error", "Invalid game code.");
      return;
    }
    if (players.length <= 7) {
      players.push({
        score: 0,
        playerId: playerCounter++,
        username: data.username,
        socketId: socket.id,
        coneNumber: players.length,
      });
    } else {
      socket.emit("on_error", "Lobby is full.");
      return;
    }

    console.log("join_lobby: ", data);
    //assumes that the users lobby code is correct

    // server response to game master to notifying that a player has joined
    socket.emit("player_joined", players[players.length - 1]);
    io.emit("current_players", players);
  });

  socket.on('game_master_quit_game', () => {
    io.emit('game_is_quit');
    players = [];
  });

  socket.on("generate_initial_map", (data) => {
    const map = DuelEngine.initializeMap(players.length); // We have to something here to specify nr of cones
    //console.log(map);
    socket.emit("on_generated_map", map);
  });

  socket.on("game_start", () => {
    if (players.length < 2) {
      socket.emit("on_error", "Not enough players to start game.");
      return;
    }

    gameIsRunning = true;
    io.emit("start_quiz", {});
  });

  socket.on("make_next_question", () => {
    quizRunning = true;
    console.log(players);
    playerWhoAnsweredFirstId = -1;

    const playersThatCanDuel = players.filter(el => el.score === 3 * kPointUnit);
    if (playersThatCanDuel.length > 0) {
      const duelPlayer = playersThatCanDuel[0];
      io.emit("duel", duelPlayer);
      setTimeout(function() {io.emit('duel_done', duelPlayer)}, 10000);
      for (const p of players) {
        if (p.playerId !== duelPlayer.playerId) {
          p.score = Math.max(0, p.score - kPointUnit);
        }
        else{
          p.score = 0;
        }
      }
      io.emit('current_players', players);
    } else {
      currentQuestion = QuizEngine.getQuiz();
      io.emit("on_next_question", currentQuestion);
    }
  });

  socket.on("evaluate", (data) => {
    if (currentQuestion !== undefined) {
      io.emit("on_correct_answer", currentQuestion.Correct_Answer_Index);
    }
  });

  socket.on("return_player_answer", (data) => {
    try {
      const isCorrect = QuizEngine.checkAnswer(data.question, data.answer);
    
      if (playerWhoAnsweredFirstId < 0) {
        if (isCorrect) {
          const player = getPlayerWithSocket(socket);
          players[players.indexOf(player)].score += kPointUnit;
          io.emit("current_players", players);

          playerWhoAnsweredFirstId = player.playerId;
        }
      }
    }
    catch (e) {
      console.log(e);
    }
  });

  socket.on("player_eliminated", (playerToEliminate) => {
    removePlayer(playerToEliminate);
    io.emit("current_players", players);
    io.emit('player_is_eliminated', playerToEliminate);
    console.log("player_eliminated: ", playerToEliminate);
    console.log("players: ", players);
    if(players.length === 1){
      io.emit('player_has_won', players[0]);
      players = [];
      gameIsRunning = false;
    }
  });


  socket.on("dev_duel_done", () => {
    io.emit("duel_done");
  });

  socket.on("dev_duel_start", () => {
    io.emit("duel", players[0]);
  });

  socket.on("move_ball", (msg) => {
    io.emit("on_ball_control", msg);

    // TODO: Get duel remaining players and check if someone was eliminated

    // When duel is done
    // io.emit("duel_done");

    // Last man standing is the winner
    if (players.length == 1) {
      io.emit("on_winner", players[0]);
      players.length = 0;
      gameIsRunning = false;
    }
  });
});

// ALL GAME LOGIC BELOW

// KATLEGO:
// Lobby needs to be created with server
// Lobby code
// Display lobby code (send to GM)
// Listen for players joining with that lobby code
// If player joins, add them to a lobby - update players[], and displayed players in gm
// Once lobby full (x players, max 8)
// Wait for host to say "start game"

// First, check if someone allowed to control ball duel (error check)
// If not, generate question ->
// send question info (question, options) to gm, and nothing to players.
// Wait for all the players to answer - timeout of x seconds
// Check answers for each player (quiz engine . checkAnswer()).
// As soon as a player gets a right answer, end of question and add "1 point" to the player who answered correctly, first
// Get newest scores
// Send newest scores to gm, duel, and check if time for a duel.
// If time for a duel,
// "reset" scores for all players, including if their duel
// DO A DUEL. --- Give player permission (socket.emit player turn to move ball with player ID), and
// amount of moves they can make (count for moves)
// Once button presses = count, send move info to controller, etc -\n
// call controller function to decode move, and then output from there to GM to BALL
// Remove permission to move after move has taken place (front end count condition reached)
// Get processed image / camera data from GM through to main through to duel (main -> duel in 2d array),
// update picture map on GM UI
// send updates to duel engine, to check eliminations. If eliminated, duel tells main to send event to deactivate players (check loss)
// kill player off, somehow, update to GM to fix leaderboard (dead, kick em off, cross out name w/ strikethru) etc.
// If win condition reached, display winner & end game. If not, prompt for next question.
// If not time for a duel, ie. score threshold not reached yet
// update scores, display scores, prompt for next question.
