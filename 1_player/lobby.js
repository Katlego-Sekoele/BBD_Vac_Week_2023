import "./socket.io/client-dist/socket.io.js";

const SERVER_URL = "http://localhost:3001";
let socket; // manager connects to socket server

socket = io.connect(SERVER_URL);

socket.on("StartGame", (res) => {
    connectToServer(res)
})


function connectToServer(gameSettings)
{
    window.location.assign("quiz.html");
}