const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");

// Controller, Quiz, Duel connections ---------------------------------
BallCamController = require("./controller/main.controller");
// BallCamController.mainMoveLeft(1000);

DuelEngine = require("./duel/duelEngine");
// DuelEngine.initMap();

QuizEngine = require("../../2_quiz/QuizGenQuestionGenerator");


app.use(function (req, res, next) {
	const allowedOrigins = [
		"http://localhost:3000",
		"address of our hosted frontend",
	];
	const origin = req.headers.origin;
	if (allowedOrigins.includes(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
	}
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.header("Access-Control-Allow-credentials", true);
	res.header(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, UPDATE"
	);
	next();
});

app.use("/", express.static("../1_player"));
app.use("/gm", express.static("../5_gm/app"));

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {origin: '*'}
})
server.listen(3000, () => console.log('listening on http://localhost:3000'));

let lobbies = [];

const allSockets = [];

io.on("connection", (socket) => {
	allSockets.push(socket);

	console.log("a user connected with ID: " + socket.id);

	socket.on("disconnect", () => {
		console.log("a user disconnected with ID: " + socket.id);
	});

	// player requests to join a lobby
	socket.on("join_lobby", (data) => {
		if (!data) {
			//empty or null data
			return;
		}

		for (let i = 0; i < lobbies.length; i++) {
			if (+lobbies[i].gamecode === +data.gamecode) {

				if (lobbies[i].numPlayers >= lobbies[i].lobbySize){
					socket.emit("lobby_full", {response: "lobby full"})
					console.log("lobby full")
					return;
				}

				lobbies[i].players.push({
					score: 0,
					playerNumber: lobbies[i].numPlayers,
				});
				lobbies[i].numPlayers++;


				console.log("join_lobby: ", data);
				//assumes that the users lobby code is correct

				// server response to game master to notifying that a player has joined
				socket.emit("player_joined", lobbies[i]);

				// game master response confirming receipt of player_joined event
				socket.on("player_in_lobby", () => {
					// server response to client notifying them that they are in the lobby
					socket.emit("joined_lobby", { response: "success" });
				});

			}
		}

	});

	socket.on("create_lobby", (data) => {
		let gamecode = Math.floor(Math.random() * 1000) + 1000;

		lobbies.push({
			gamecode,
			players: [],
			lobbySize: data.size,
			numPlayers: 0,
		});

		console.log(lobbies)
		socket.emit("created_lobby");
	});

  socket.on("move_ball", (msg) => {
		console.log(msg);
		socket.emit("response", "ball moved!");
		for (const socket of allSockets) {
			socket.emit("on_ball_control", msg);
		}
	});

  socket.on('update_map', () => {
    const map = DuelEngine.initializeMap(4);
    console.log(map);
    socket.emit('updated_map', map);
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


// Get init map from Duel and give to GM (for cone placement)
numCones = lobbies[0]?.lobbySize || 4
initialMap = DuelEngine.initializeMap(numCones)

// start game loop!
var gameOn = true
while(gameOn){
  
}



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



const QuizQuestionInfo = QuizEngine.getQuiz();

// // Controller, Quiz, Duel connections ---------------------------------
// BallCamController = require('./controller/main.controller')
// BallCamController.mainMoveLeft(1000)

// DuelEngine = require('./duel/duelEngine')
// DuelEngine.initMap()

// QuizEngine = require('./quiz/quizEngine')
// QuizEngine.generateQuestions()



// socket.emit('sendQuestionData', QuizQuestionInfo)



// socket.on('sendQuestionData', (data) =>{
//   currentQuestion = data.currentQuestion
//   optionalAnswers = data.answers
//   correctAnswer = data.correctAnswer
// })