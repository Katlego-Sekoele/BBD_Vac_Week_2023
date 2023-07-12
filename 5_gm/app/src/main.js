//import "./socket.io/client-dist/socket.io.js";
import {createMap} from "./MapStuff/mapMain.js";
// for navigation purposes
const startGameContainer = document.getElementById('start-game-container');
const setUpGameContainer = document.getElementById('set-up-game-container');
const qrScreenMainBox = document.getElementById('QR-screen-main-box');
const questionPageMainBox = document.getElementById('question-page-main-box');
const mapContainer = document.getElementById('map-container');

let players = [];
let currentLobbyCode = null;

// Event listeners or any other logic to trigger the container changes
document.getElementById("homescreen-start-btn").addEventListener("click", showQRScreenMainBox);
document.getElementById("start-game-btn").addEventListener("click", emitTheSocket);
document.getElementById('quit_btn').addEventListener("click", showStartGameContainer)

document.getElementById('pixel_map_container').innerHTML = ""; 
// Socket.io stuff
const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com" ? "https://server-bbd-vac-week.onrender.com/" : "http://localhost:3000";
const DEFAULT_SIZE = 4
let socket = io.connect(SERVER_URL);
// manager connects to socket server




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

socket.on('start_quiz', () => {
    showQuestionPageMainBox();
});
socket.on('on_error', (error) => {
    alert(error);
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

socket.emit('generate_initial_map');
socket.on('on_generated_map', (data) => {
	console.log(data);
	createMap(data);
});

socket.on('current_players', (currentPlayers) => {
    players = currentPlayers;
    updateScoreboard(players);
});

socket.on("lobby_code", lobbyCode => {
    document.getElementById("lobby_code").innerText = lobbyCode;
});

socket.on('duel', (playerControllingTheBall) => {
    document.getElementById("who_controlling_ball").innerText = playerControllingTheBall.username +" is controlling the ball";
    // TODO: get the info using the camera now to cause map updates
});
socket.on('duel_done', () => {
    document.getElementById("who_controlling_ball").innerText = "No one is controlling the ball";
});


socket.on('on_next_question', (question) => {
    //update the question and answers
    document.getElementById("question_holder").innerText = question.Question;
    document.getElementById("answer_1").innerText = "A: " + question.Answers[0]; //TODO: idk how the question object is structured
    document.getElementById("answer_2").innerText = "B: " + question.Answers[1];
    document.getElementById("answer_3").innerText = "C: " + question.Answers[2];
    document.getElementById("answer_4").innerText = "D: " + question.Answers[3];

    document.getElementById("answer_1").style.backgroundColor = "var(--purple)";
    document.getElementById("answer_2").style.backgroundColor = "var(--purple)";
    document.getElementById("answer_3").style.backgroundColor = "var(--purple)";
    document.getElementById("answer_4").style.backgroundColor = "var(--purple)";
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
    document.getElementById("answer_" + (indexOfCorrectAnswer + 1)).style.backgroundColor = "var(--correctGreen)";
    updateScoreboard(players);
});


function updateScoreboard(currentPlayers) {
    for (var i = 0; i < 8; i++) { // this is added so that if the number of players decreases then the others will be removed
        // Update div content with usernames and score
        var divUsername = document.getElementById("username_" + (i + 1));
        divUsername.innerText = "";
        var divScore = document.getElementById("score_" + (i + 1));
        divScore.innerText = ""; 
        var lobbyUsername = document.getElementById('lobby_username_' + (i+1));
        lobbyUsername.innerText = "";
      }

    for (var i = 0; i < currentPlayers.length; i++) {
        var player = currentPlayers[i];
  
        // Update div content with usernames and score
        var divUsername = document.getElementById("username_" + (i + 1));
        divUsername.innerText = player.username;
        var divScore = document.getElementById("score_" + (i + 1));
        divScore.innerText = player.score; 
        var lobbyUsername = document.getElementById('lobby_username_' + (i+1));
        lobbyUsername.innerText = player.username;
        document.getElementById('numJoined').innerText = players.length + "/8 joined";
      }
}   
    
    //nav functions
    function showStartGameContainer() {
     document.getElementById('pixel_map_container').innerHTML = "";   
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
    updateScoreboard(players);
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'block';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the question page main box container and hide the rest
function showQuestionPageMainBox() {
    updateScoreboard(players);
    document.getElementById("who_controlling_ball").innerText = "No one is controlling the ball";
    socket.emit('generate_initial_map', 4);
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'block';
    mapContainer.style.display = 'none';
    document.getElementById('question_holder').innerText = "Question will appear here";
    document.getElementById('answer_1').innerText = "A: ";
    document.getElementById('answer_2').innerText = "B: ";
    document.getElementById('answer_3').innerText = "C: ";
    document.getElementById('answer_4').innerText = "D: ";
}

// Function to show the map container and hide the rest
function showMapContainer() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'block';
}

function emitTheSocket(){
    socket.emit("game_start");
}

