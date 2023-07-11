/* Modal */
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
// const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
// closeModalBtn.addEventListener("click", closeModal);
// overlay.addEventListener("click", closeModal);

// open modal function
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
    //setTimeout(closeModal, 1200);
};

// --- NAVIGATION ELEMENTS ---
const joinGameContainer = document.getElementById('join-game-container');
const controlContainer = document.getElementById('control-container');
const lobbyContainer = document.getElementById('lobby-container');
const quizContainer = document.getElementById('quiz-container');

// --- EVENT LISTENERS ---
// ...
// TEMP NAV
document.getElementById("join-game").addEventListener("click", showJoinGameContainer);
document.getElementById("lobby").addEventListener("click", showLobbyContainer);
document.getElementById("quiz").addEventListener("click", showQuizContainer);
document.getElementById("control").addEventListener("click", showControllerContainer);

// --- SOCKET.IO ---
// Socket connection
const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com" ? "https://server-bbd-vac-week.onrender.com/" : "http://localhost:3000";
const DEFAULT_SIZE = 4
let socket = io.connect(SERVER_URL);

// 
socket.on("generic_event", (data) => {
    //     TODO: decide on events with server team
});




// --- FUNCTIONS ---
// Navigation: Join Game Container
function showJoinGameContainer() {
    console.log('join');
    joinGameContainer.style.display = 'block';
    lobbyContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    controlContainer.style.display = 'none';
}

// Navigation: Lobby Container
function showLobbyContainer() {
    console.log('lobby');
    joinGameContainer.style.display = 'none';
    lobbyContainer.style.display = 'block';
    quizContainer.style.display = 'none';
    controlContainer.style.display = 'none';
}

// Navigation: Quiz Container
function showQuizContainer() {
    joinGameContainer.style.display = 'none';
    lobbyContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    controlContainer.style.display = 'none';
    // USer userNme
    document.getElementById("playerName").innerHTML = "Player " + (player.playerId+1);
}

// Navigation: Controller Container
function showControllerContainer() {
    joinGameContainer.style.display = 'none';
    lobbyContainer.style.display = 'none';
    quizContainer.style.display = 'none';
    controlContainer.style.display = 'block';
}

// --- JOIN GAME ---

document.getElementById("joinButton").onclick = () => {
    // establish connection to socket server

    let gameCode = document.getElementById("gameCodeValue").value;
    console.log(gameCode);

    if (
        gameCode === "" ||
        gameCode === null
    ) {
        alert("Input fields cannot be empty");
        return;
    }

    //create json object to send username and gamecode
    let connectObject = { "gameCode": gameCode };

    // request to join lobby
    socket.emit("join_lobby", connectObject)
    // socket.emit("join_lobby", JSON.stringify(connectObject))

    socket.on("player_joined", (data) => {
        //check whether a userId was received
        if (data) {
            console.log(data);
            //redirect to lobby
            showLobbyContainer();
        } else {
            alert("Error connecting. Please try again.");
        }
    })

    socket.on("on_error", (data) => {
        alert(data);
    })
}


// --- LOBBY ---
//[commented out because "startQuiz" was constantly emitting]

socket.on("start_quiz", (res) => {
    connectToGame(res)
})

function connectToGame()
{
    showQuizContainer();
}

// --- QUIZ ---

var answer;
var question;
var btn_class = "answer-button"
var player;
var is_duel_player = false;

function convertintChar(integer) {
    let character = 'a'.charCodeAt(0);
    return String.fromCharCode(character + integer).toLocaleUpperCase();
}

function changeBtn(disable) {
    for (var button of document.getElementsByClassName(btn_class)) {
        button.disabled = disable;
    }
}

function sendAns(e, ans) {
    answer = ans;
    e.preventDefault();
    socket.emit("return_player_answer", { question: question, answer: ans });
    changeBtn(true); // disable after option has been selected
}

// Events
socket.on("on_next_question", (currentQuestion) => {
    question = currentQuestion["Question"];
    console.log(currentQuestion);
    let no_answers = currentQuestion["Answers"].length;

    let buttons = "";
    for (var i = 0; i < no_answers; i++) {
        buttons += 
        `<div class="buttonParent">
            <button id="${convertintChar(i).toUpperCase()}" class="${btn_class}">${convertintChar(i).toUpperCase()}</button>
        </div>`
    }

    document.getElementById("answer-container-id").innerHTML = "";
    document.getElementById("answer-container-id").innerHTML = buttons;

    // Answer options
    for (var node of document.getElementsByClassName(btn_class)) {

        node.addEventListener('click', (e) => {
            var id = e.currentTarget.id;
            console.log(id);
            sendAns(e, id.charCodeAt(0) - 'A'.charCodeAt(0)); // convert to int
        })
    }
});

socket.on("current_players", (players) => {
    const currentPlayer = players.find((player) => player.socketId == socket.id);
    player = currentPlayer; // get score
    console.log(players);
})

socket.on("on_correct_answer", (correctAnswerIndex) => {
    // Change selected option to green if the user answered correctly else change all options to red
    changeBtn(true);
    console.log(convertintChar(correctAnswerIndex));

    if (correctAnswerIndex == answer) {
        document.getElementById(convertintChar(answer)).style.background = '#00FF00';
    } else {
        for (var button of document.getElementsByClassName(btn_class)) {
            button.style.background = '#FF0000';
        }
    }

    //document.getElementById("score").innerHTML = player.score;
});

socket.on("duel", (dualPlayer) => {
    is_duel_player = dualPlayer.socketId === socket.id;
    if (is_duel_player) {
        // Get score
        player.score = dualPlayer.score;

        // Redirect to controls page
        showControllerContainer();
    } else {
        document.getElementById("modal_text").innerHTML = `Player ${dualPlayer.playerId+1} is duelling.`;
        openModal();
        //alert(`Player ${player.username} is duelling.`);
    }
});

// TODO: Respond to duel done event
socket.on("duel_done", () => {
    if (is_duel_player) { showQuizContainer(); }
    else { closeModal(); }
});

// --- CONTROLLER ---

function sendMove(e, dir, speed) {
    e.preventDefault();
    socket.emit("move_ball", {"dir": dir, "speed": speed})
    document.removeEventListener('touchstart', _eventTouchStart);
    document.removeEventListener('touchend', _eventTouched);
}

document.getElementById("up").addEventListener('click', (e) => {
    sendMove(e, 1);
});

document.getElementById("left").addEventListener('click', (e) => {
    sendMove(e, 271);
});

document.getElementById("down").addEventListener('click', (e) => {
    sendMove(e, 181);
});

document.getElementById("right").addEventListener('click', (e) => {
    sendMove(e, 91);
});

// // Variables to store initial touch position and timestamp
// let startX, startY, startTime;

// // Constants for angle calculation
// const RAD_TO_DEG = 180 / Math.PI;

// function AddControlListeners() {
//     // Event listener for touch start
//     document.addEventListener('touchstart', _eventTouchStart);

//     // Event listener for touch end
//     document.addEventListener('touchend', _eventTouched);
// }

// var _eventTouchStart = function(event) {
//     // Store initial touch position and timestamp
//     startX = event.touches[0].clientX;
//     startY = event.touches[0].clientY;
//     startTime = Date.now();
// }

// var _eventTouched = function(event) {
//     // Calculate drag distance
//     const endX = event.changedTouches[0].clientX;
//     const endY = event.changedTouches[0].clientY;
//     const distanceX = endX - startX;
//     const distanceY = endY - startY;

//     // Calculate angle in degrees
//     const angle = Math.atan2(distanceY, distanceX) * RAD_TO_DEG;

//     // Calculate drag speed
//     const endTime = Date.now();
//     const duration = endTime - startTime;
//     const speed = Math.sqrt((distanceX * distanceX + distanceY * distanceY)) / duration;

//     // Output the calculated values
//     console.log('Angle: ' + angle + ' degrees');
//     console.log('Speed: ' + speed + ' pixels per millisecond');

//     sendMove(event, angle, speed);
// }

/*
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
*/

// 'join-game-container'
// 'control-container'
// 'lobby-container'
// 'quiz-container'
