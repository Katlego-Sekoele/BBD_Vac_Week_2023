const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com"?  "https://server-bbd-vac-week.onrender.com/":"http://localhost:3000";


const socket = io.connect(SERVER_URL);
console.log("Hello World");
socket.on("on_ball_control", (msg) => console.log(msg));

