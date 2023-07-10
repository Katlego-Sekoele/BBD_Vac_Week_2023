import "./socket.io/client-dist/socket.io.js";

const SERVER_URL = "http://localhost:3001";
let socket; // manager connects to socket server

function connectToLobby() {
	console.log("Hier");

	// establish connection to socket server
	socket = io.connect(SERVER_URL);

	var username = document.getElementById("usernameInput").value;
	var gameCode = document.getElementById("gameCodeInput").value;

	if (
		username == "" ||
		gameCode == "" ||
		username == null ||
		gameCode == null
	) {
		alert("Input fields cannot be empty");
		return;
	}

	//create json object to send username and gamecode
	var connectJSON =
		'{"username": ' + username + ', "gamecode" : ' + gameCode + "}";

	console.log(username + " " + gameCode);

	var result = "Success";

	//check whether request was successful
	if (result == "Success") {
		//redirect to lobby
		window.location.assign("lobby.html");
	} else {
		alert("Error connecting. Please try again.");
	}
}

document.getElementById("connectBtn").onclick = connectToLobby;

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
