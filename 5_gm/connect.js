//import "./socket.io/client-dist/socket.io.js";

const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com"?  "https://server-bbd-vac-week.onrender.com/":"http://localhost:3000";
let socket = io.connect(SERVER_URL);
// manager connects to socket server

document.getElementById("startBtn").onclick = () => {

	socket.emit("create_lobby");

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

// send payload to server and invoke another_generic_event on server side
// socket.emit("another_generic_event", payload)
