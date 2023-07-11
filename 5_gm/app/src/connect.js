//import "./socket.io/client-dist/socket.io.js";

const SERVER_URL = "http://localhost:3000";
const DEFAULT_SIZE = 4;
let socket = io.connect(SERVER_URL);

socket.on("on_ball_control", (msg) => console.log(msg));
// manager connects to socket server

document.getElementById("startBtn").onclick = () => {
	socket.emit("create_lobby", { size: DEFAULT_SIZE });

	socket.on("created_lobby", (data) => {
		console.log("lobby has been created");
	});
};

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

// send payload to server and invoke another_generic_event on server side
// socket.emit("another_generic_event", payload)
import { createMap } from "./MapStuff/mapMain.js";
socket.emit("update_map");
socket.on("updated_map", (data) => {
	console.log(data);
	createMap(data);
});

//import "./socket.io/client-dist/socket.io.js";

document.getElementById("startBtn").onclick = () => {
	let size = document.getElementById("sizeInput").value || DEFAULT_SIZE;

	socket.emit("create_lobby", { size: size });

	socket.on("created_lobby", (data) => {
		alert("started")
		//window.location.assign("/gm/"); // TODO: redirect correctly
	});
};

socket.on("player_joined", (lobby) => {
	console.log("Player Joined:", lobby);
	io.emit("player_in_lobby");
});

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

// send payload to server and invoke another_generic_event on server side
// socket.emit("another_generic_event", payload)
