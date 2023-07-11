//import "./socket.io/client-dist/socket.io.js";

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
document.getElementById("go-to-map-btn").addEventListener("click", showMapContainer);
document.getElementById("back-to-game-btn").addEventListener("click", showQuestionPageMainBox);

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

// send payload to server and invoke another_generic_event on server side
// socket.emit("another_generic_event", payload)

// import {createMap} from "./MapStuff/mapMain.js";
// socket.emit('update_map');
// socket.on('updated_map', (data) => {
// 	console.log(data);
// 	createMap(data);
// });


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
    console.log("showSetUpGameContainer");
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