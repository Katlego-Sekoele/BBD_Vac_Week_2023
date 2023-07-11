const SERVER_URL = "http://localhost:3000";
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

	socket.emit("join_lobby", JSON.stringify(connectObject))

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
