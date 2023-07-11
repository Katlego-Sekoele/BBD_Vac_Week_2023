const SERVER_URL = "http://localhost:3000";
const socket = io.connect(SERVER_URL);

function sendDir(e, dir) {
    e.preventDefault();
    socket.emit("move_ball", dir);
}

socket.on("response", (msg) => console.log(msg));

document.getElementById("up").addEventListener('click', (e) => {
    sendDir(e, 0);
});

document.getElementById("left").addEventListener('click', (e) => {
    sendDir(e, 270);
});

document.getElementById("down").addEventListener('click', (e) => {
    sendDir(e, 180);
});

document.getElementById("right").addEventListener('click', (e) => {
    sendDir(e, 90);
});