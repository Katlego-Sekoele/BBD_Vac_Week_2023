//import "./socket.io/client-dist/socket.io.js";
import {showSetUpGameContainer, showQRScreenMainBox, showQuestionPageMainBox} from "./nav.js";

// for navigation purposes
const startGameContainer = document.getElementById('start-game-container');
const setUpGameContainer = document.getElementById('set-up-game-container');
const qrScreenMainBox = document.getElementById('QR-screen-main-box');
const questionPageMainBox = document.getElementById('question-page-main-box');
const mapContainer = document.getElementById('map-container');

// Event listeners or any other logic to trigger the container changes
document.getElementById("homescreen-start-btn").addEventListener("click", showSetUpGameContainer(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer));
document.getElementById("nextbutton").addEventListener("click", showQRScreenMainBox(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer));
document.getElementById("start-game-btn").addEventListener("click", showQuestionPageMainBox(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer));


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
// TODO: uncomment below
// import {createMap} from "./MapStuff/mapMain.js";
// socket.emit('update_map');
// socket.on('updated_map', (data) => {
// 	console.log(data);
// 	createMap(data);
// });

