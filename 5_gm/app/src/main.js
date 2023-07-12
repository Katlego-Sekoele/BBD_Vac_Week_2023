//import "./socket.io/client-dist/socket.io.js";
import {createMap} from "./MapStuff/mapMain.js";
// for navigation purposes
const startGameContainer = document.getElementById('start-game-container');
const setUpGameContainer = document.getElementById('set-up-game-container');
const qrScreenMainBox = document.getElementById('QR-screen-main-box');
const questionPageMainBox = document.getElementById('question-page-main-box');
const mapContainer = document.getElementById('map-container');

// Event listeners or any other logic to trigger the container changes
document.getElementById("homescreen-start-btn").addEventListener("click", showSetUpGameContainer);
document.getElementById("nextbutton").addEventListener("click", showQRScreenMainBox);
document.getElementById("start-game-btn").addEventListener("click", showQuestionPageMainBox);

// Socket.io stuff
const SERVER_URL = "http://localhost:3000";
const DEFAULT_SIZE = 4
let socket = io.connect(SERVER_URL);
// manager connects to socket server

document.getElementById("start-game-btn").onclick = () => {

	socket.emit("create_lobby", {size: DEFAULT_SIZE});

	socket.on("created_lobby", (data) => {
		console.log('lobby has been created');
	});
}

socket.on("connect", () => {
	// connect event
	const engine = socket.io.engine;

	engine.on("packet", ({ type, data }) => {
		// called for each packet received
	});

	engine.on("packetCreate", ({ type, data }) => {
		// called for each packet sent
	});
});

// disconnect event
socket.on("disconnect", () => {});

socket.on("generic_event", (data) => {
	//     TODO: decide on events with server team
});

socket.on("player_join", (data) => {
	//     TODO: decide on events with server team
});

//send payload to server and invoke another_generic_event on server side
//socket.emit("another_generic_event", payload)

import {createMap} from "./MapStuff/mapMain.js";
socket.emit('update_map');
socket.on('updated_map', (data) => {
	console.log(data);
	createMap(data);
});

socket.on('current_players', (currentPlayers) => {
    players = currentPlayers;
    updateScoreboard();
});

socket.on("lobby_code", lobbyCode => {
    currentLobbyCode = lobbyCode;
    // TODO: document.getElementById("lobby_code").innerText = lobbyCode;
});

socket.on('duel', (playerControllingTheBall) => {
    document.getElementById("who_controlling_ball").innerText = playerControllingTheBall.username +" is controlling the ball";
    // TODO: get the info using the camera now to cause map updates
});
socket.on('done_duel', () => {
    document.getElementById("who_controlling_ball").innerText = "No one is controlling the ball";
});


socket.on('on_next_question', (question) => {
    //update the question and answers
    document.getElementById("question_holder").innerText = question.question;
    document.getElementById("answer_1").innerText = question.answers[0]; //TODO: idk how the question object is structured
    document.getElementById("answer_2").innerText = question.answers[1];
    document.getElementById("answer_3").innerText = question.answers[2];
    document.getElementById("answer_4").innerText = question.answers[3];
    
    document.getElementById("answer_1").style.backgroundColor = "pink";
    document.getElementById("answer_2").style.backgroundColor = "pink";
    document.getElementById("answer_3").style.backgroundColor = "pink";
    document.getElementById("answer_4").style.backgroundColor = "pink";
});

// TODO: add the code so when the next question button is pressed then the socket.emit is called
document.getElementById("next_question_btn").onclick = () => {
	socket.emit("make_next_question"); //I don't think there is data to this event
};

//TODO: add the code so when the 'evaluate' button is pressed then the socket.emit is called
document.getElementById("evaluate_btn").onclick = () => {
    socket.emit("evaluate");
};

socket.on('on_correct_answer', (indexOfCorrectAnswer) => {
    document.getElementById("answer_" + (indexOfCorrectAnswer + 1)).style.backgroundColor = "green";
    updateScoreboard();
});


function updateScoreboard() {
    for (var i = 1; i < 9; i++) { // this is added so that if the number of players decreases then the others will be removed
        // Update div content with usernames and score
        var divUsername = document.getElementById("username_" + (i + 1));
        divUsername.innerText = "";
        var divScore = document.getElementById("score_" + (i + 1));
        divScore.innerText = ""; 
      }

    for (var i = 1; i < players.length; i++) {
        var player = players[i];
  
        // Update div content with usernames and score
        var divUsername = document.getElementById("username_" + (i + 1));
        divUsername.innerText = username;
        var divScore = document.getElementById("score_" + (i + 1));
        divScore.innerText = player.score; 
      }
    }
    
    
    //nav functions
    function showStartGameContainer() {
        startGameContainer.style.display = 'block';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the set up game container and hide the rest
function showSetUpGameContainer() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'block';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the QR screen main box container and hide the rest
function showQRScreenMainBox() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'block';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the question page main box container and hide the rest
function showQuestionPageMainBox() {
    socket.emit('generate_initial_map', 4);
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'block';
    mapContainer.style.display = 'none';
}

// Function to show the map container and hide the rest
function showMapContainer() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'block';
}