//import "./socket.io/client-dist/socket.io.js";
import {createMap} from "./MapStuff/mapMain.js";

import {
    createTrack,
    enableAudio,
    getActiveTrackPath,
    getAudioBuffer,
    getAudioTime,
    setActiveTrack,
    setActiveTrackTrate,
    stopActiveTrack,
} from "./audio.js";

const audioBuffers = new Map();
const backgroundMusic = "bg_audio.mp3";
const startDuelMusic = "start_duel.mp3";
const endDuelMusic = "end_duel.mp3";
const onNewQuestionMusic = "on_new_question.mp3";

const allAudioTracks = [];

const audioFiles = [backgroundMusic, startDuelMusic, endDuelMusic, onNewQuestionMusic];

async function preloadAllAudio(){
    for (const song of audioFiles) {
        const url = `${window.location.protocol}//${window.location.host}/gm/audio/${song}`;
        const audioBuffer = await getAudioBuffer(url);
        audioBuffers.set(song, audioBuffer);
    }
}

function stopAllAudioTracks() {
    for (let track of allAudioTracks) {
        track.stop();
    }
}

export async function playPreloadedSong(songPath, loop) {
    const lastSlashIndex = songPath.lastIndexOf("/");
    if (lastSlashIndex != -1) {
      songPath = songPath.substring(lastSlashIndex + 1);
    }
  
    for (const songFile of audioBuffers.keys()) {
      if (songFile === songPath) {
        const songBuffer = audioBuffers.get(songFile);
        const track = await createTrack(songBuffer, loop);
  
        track.start();
        allAudioTracks.push(track);
        console.log("Song started ", songPath);
      }
    }
}

export async function playDuelMusic() {
    stopAllAudioTracks();
    await playPreloadedSong(startDuelMusic, true);
}

export async function playBackgroundMusic() {
    stopAllAudioTracks();
    await playPreloadedSong(backgroundMusic, true);    
}

window.onload = preloadAllAudio;

// for navigation purposes
const startGameContainer = document.getElementById('start-game-container');
const setUpGameContainer = document.getElementById('set-up-game-container');
const qrScreenMainBox = document.getElementById('QR-screen-main-box');
const questionPageMainBox = document.getElementById('question-page-main-box');
const mapContainer = document.getElementById('map-container');

let players = [];
let currentLobbyCode = null;

// Event listeners or any other logic to trigger the container changes
document.getElementById("homescreen-start-btn").addEventListener("click", async () => {
    showQRScreenMainBox();
    await enableAudio();
    await playBackgroundMusic();
    console.log("Sound enabled");
});
document.getElementById("start-game-btn").addEventListener("click", emitTheSocket);
document.getElementById('quit_btn').addEventListener("click", showStartGameContainer)
document.getElementById("videoToggle").addEventListener("click",toggleCamera);
//document.getElementById("videoToggle1").addEventListener("click",toggleCamera);

document.getElementById("username_1").onclick=function(){removeFromGame("1")};
document.getElementById("username_2").onclick=function(){removeFromGame("2")};
document.getElementById("username_3").onclick=function(){removeFromGame("3")};
document.getElementById("username_4").onclick=function(){removeFromGame("4")};
document.getElementById("username_5").onclick=function(){removeFromGame("5")};
document.getElementById("username_6").onclick=function(){removeFromGame("6")};
document.getElementById("username_7").onclick=function(){removeFromGame("7")};
document.getElementById("username_8").onclick=function(){removeFromGame("8")};



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
    playPreloadedSong(backgroundMusic);
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
    document.getElementById("lobby_code").innerText = 'LOBBY CODE: ' + lobbyCode;
});

socket.on('duel', (playerControllingTheBall) => {
    document.getElementById("who_controlling_ball").innerText = playerControllingTheBall.username +" is controlling the ball";
    // TODO: get the info using the camera now to cause map updates

    playDuelMusic();
});
socket.on('duel_done', () => {
    document.getElementById("who_controlling_ball").innerText = "No one is controlling the ball";

    stopAllAudioTracks();
    playPreloadedSong(endDuelMusic, false);
    playPreloadedSong(backgroundMusic, true);
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

    playPreloadedSong(onNewQuestionMusic, false);
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

let cameraOn = true;
 function toggleCamera(){
    if(cameraOn){
        document.getElementById("video").style.display = "none";
        cameraOn = false;
        document.getElementById("videoToggle").innerHTML = "TOGGLE CAMERA ON"
        document.getElementById("videoToggle1").innerHTML = "TOGGLE CAMERA ON"

    }else{
        document.getElementById("video").style.display = "block";
        cameraOn = true;
        document.getElementById("videoToggle").innerHTML = "TOGGLE CAMERA OFF"
        document.getElementById("videoToggle1").innerHTML = "TOGGLE CAMERA OFF"
    }

 }
    
    //nav functions
    function showStartGameContainer() {
    socket.emit("game_master_quit_game");
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

function removeFromGame(index){
    socket.emit("player_eliminated", players[index-1]);
}

