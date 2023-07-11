const SERVER_URL = "http://localhost:3000";

const socket = io.connect(SERVER_URL);

function sendAwns(e, awns) {
    e.preventDefault();
    socket.emit("return_player_answer", awns);
}

socket.on("controle", (msg) => {
    window.location.assign("controls.html");
    console.log(msg)
});

document.getElementById("A").addEventListener('click', (e) => {
    sendAwns(e, "A");
});

document.getElementById("B").addEventListener('click', (e) => {
    sendAwns(e, "B");
});

document.getElementById("C").addEventListener('click', (e) => {
    sendAwns(e, "C");
});

document.getElementById("D").addEventListener('click', (e) => {
    sendAwns(e, "D");
});

function quit(){
    window.location.assign("connect.html");
}