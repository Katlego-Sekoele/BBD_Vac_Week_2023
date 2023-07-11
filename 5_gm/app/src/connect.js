const SERVER_URL = "http://localhost:3000";
const DEFAULT_SIZE = 4
let socket = io.connect(SERVER_URL);

socket.on("on_ball_control", (msg) => console.log(msg));

//import "./socket.io/client-dist/socket.io.js";

document.getElementById("startBtn").onclick = () => {

    let size = document.getElementById("sizeInput").value || DEFAULT_SIZE

    socket.emit("create_lobby", {size: size});

    socket.on("created_lobby", (data) => {
        window.location.assign("/gm/"); // TODO: redirect correctly
    });
}

socket.on("player_joined", (lobby) => {
    alert("Player Joined:" + lobby.numPlayers)
    socket.emit("player_in_lobby")
})

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
