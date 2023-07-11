const SERVER_URL = "http://localhost:3000";

const socket = io.connect(SERVER_URL);
console.log("Hello World");
socket.on("on_ball_control", (msg) => console.log(msg));

