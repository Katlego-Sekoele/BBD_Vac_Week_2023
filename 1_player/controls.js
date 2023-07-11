const SERVER_URL = "http://localhost:3000";

const socket = io.connect(SERVER_URL);
var numberOfMoves = 5;

function saveDir(e, dir) {
    e.preventDefault();
    sendDir(dir)
    numberOfMoves --
    console.log(dir + ": number of moves left " + numberOfMoves);

    if(numberOfMoves <= 0){
        numberOfMoves = 5
        window.location.assign("quiz.html");
    }
}

function sendDir(dir){
    socket.emit("move_ball", dir)
}

document.getElementById("up").addEventListener('click', (e) => {
    saveDir(e, 1);
});

document.getElementById("left").addEventListener('click', (e) => {
    saveDir(e, 271);
});

document.getElementById("down").addEventListener('click', (e) => {
    saveDir(e, 181);
});

document.getElementById("right").addEventListener('click', (e) => {
    saveDir(e, 91);
});