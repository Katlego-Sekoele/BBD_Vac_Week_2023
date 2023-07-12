const express = require("express");
const app = express();
const http = require("http");

const DuelEngine = require("./duel/duelEngine");
const QuizEngine = require("../../2_quiz/QuizGenQuestionGenerator");

app.use("/", express.static("../1_player"));
app.use("/gm", express.static("../5_gm/app"));

const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: { origin: "*" },
});
server.listen(3000, () => console.log("listening on http://localhost:3000"));

let gameIsRunning = false;
let allSockets = [];
let players = [];
const mainGameCode = "abcd";

let playerWhoAnsweredFirstId = -1;
let currentQuestion = undefined;

function getPlayerWithSocket(socket) {
  return players.filter((value) => value.socketId === socket.id);
}

io.on("connection", (socket) => {
  allSockets.push(socket);
  socket.emit("lobby_code", mainGameCode);

  console.log("a user connected with ID: " + socket.id);

  socket.on("disconnect", () => {
    console.log("a user disconnected with ID: " + socket.id);
    allSockets = allSockets.filter((value) => value.id != socket.id);
    players = players.filter((value) => value.socketId != socket.id);

    if(players.length === 0) {
      gameIsRunning = false;
    }

    io.emit("current_players", players);
  });

  socket.on("restart", () => {
    io.emit("on_game_restart", {});
  })

  // player requests to join a lobby
  socket.on("join_lobby", (data) => {
    if(gameIsRunning) {
      socket.emit("on_error", "Game is already running.");
      return;
    }

    if (data.gameCode !== mainGameCode) {
      socket.emit("on_error", "Invalid game code.");
      return;
    }

    players.push({
      score: 0,
      playerId: players.length,
      username: data.username,
      socketId: socket.id,
      coneNumber: players.length,
    });

    console.log("join_lobby: ", data);
    //assumes that the users lobby code is correct

    // server response to game master to notifying that a player has joined
    socket.emit("player_joined", players[players.length - 1]);
    io.emit("current_players", players);
  });

  socket.on("generate_initial_map", (data) => {
    const map = DuelEngine.initializeMap(players.length); // We have to something here to specify nr of cones
    console.log(map);
    socket.emit("on_generated_map", map);
  });

  socket.on("game_start", () => {
    gameIsRunning = true;
    io.emit("start_quiz", {});
  });

  socket.on("make_next_question", () => {
    playerWhoAnsweredFirstId = -1;

    const playerScores = players.map((el) => el.score);
    // const playerThatCanDuel = DuelEngine.getPlayerDuel(playerScores);
    const playerThatCanDuel = -1;
    if (playerThatCanDuel < 0) {
      currentQuestion = QuizEngine.getQuiz();
      io.emit("on_next_question", currentQuestion);
    } else {
      const duelPlayer = players[playerThatCanDuel];
      duelPlayer.score = 0;
      io.emit("duel", duelPlayer);

      for (const p of players) {
        if (p.playerId !== duelPlayer.playerId) {
          p.score = Math.max(0, p.score - 1);
        }
      }
    }
  });

  socket.on("evaluate", (data) => {
    io.emit("on_correct_answer", currentQuestion.Correct_Answer_Index);
  });

  socket.on("return_player_answer", (data) => {
    const isCorrect = QuizEngine.checkAnswer(data.question, data.answer);

    if (playerWhoAnsweredFirstId < 0) {
      if (isCorrect) {
        const player = getPlayerWithSocket(socket);
        player.score += 1;
        io.emit("current_players", players);

        playerWhoAnsweredFirstId = player.playerId;
      }
    }
  });

  socket.on("move_ball", (msg) => {
    io.emit("on_ball_control", msg);
    setTimeout(()=> io.emit("duel_done", {}), 3000);
    // TODO: Get duel remianing players

    // Last man standing is the winner
    if(players.length == 1) {
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
