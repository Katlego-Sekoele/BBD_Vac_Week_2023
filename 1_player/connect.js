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
	let connectObject = {"gamecode" : gameCode};

	// request to join lobby
	socket.emit("join_lobby", connectObject)
	// socket.emit("join_lobby", JSON.stringify(connectObject))

	socket.on("player_joined", (data) => {
		//check whether a userId was received
		if (data) {
			//redirect to lobby
			window.location.assign("lobby.html");
		} else {
			alert("Error connecting. Please try again.");
		}
	})

	socket.on("on_error", (data) => {
		alert(data);
	})
}
