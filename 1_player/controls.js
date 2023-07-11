const SERVER_URL = "http://localhost:3000";

const socket = io.connect(SERVER_URL);
var numberOfMoves = 5;
var moves = [];

function saveDir(e, dir) {
    e.preventDefault();
    moves.push(dir)
    numberOfMoves --
    console.log(dir + ": number of moves left " + numberOfMoves);

    if(numberOfMoves <= 0){
        sendDirs()
    }
}

function sendDirs(){
    socket.emit("ball_moves", moves)
    numberOfMoves = 5
    moves = []
    window.location.assign("quiz.html");
}

document.getElementById("up").addEventListener('click', (e) => {
    saveDir(e, 0);
});

document.getElementById("left").addEventListener('click', (e) => {
    saveDir(e, 270);
});

document.getElementById("down").addEventListener('click', (e) => {
    saveDir(e, 180);
});

document.getElementById("right").addEventListener('click', (e) => {
    saveDir(e, 90);
});