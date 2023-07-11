const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com"?  "https://server-bbd-vac-week.onrender.com/":"http://localhost:3000";
let socket = io.connect(SERVER_URL);
// manager connects to socket server

document.getElementById("connectBtn").onclick = () => {
	// establish connection to socket server

	let username = document.getElementById("usernameInput").value;
	let gameCode = document.getElementById("gameCodeInput").value;

	if (
		username === "" ||
		gameCode === "" ||
		username === null ||
		gameCode === null
	) {
		alert("Input fields cannot be empty");
		return;
	}

	//create json object to send username and gamecode
	let connectObject = {"username": username  , "gamecode" : gameCode};

	socket.emit("join_lobby", connectObject)

	socket.on("joined_lobby", (data) => {
		//check whether a userId was received
		if (data) {
			//redirect to lobby
			window.location.assign("lobby.html");
		} else {
			alert("Error connecting. Please try again.");
		}
	})
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
