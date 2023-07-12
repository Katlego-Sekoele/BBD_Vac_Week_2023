var answer = null;
var question;
var btn_class = "answer-button"
var player;
var is_duel_player = false;
var userName;

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
// document.getElementById("join-game").addEventListener("click", showJoinGameContainer);
// document.getElementById("lobby").addEventListener("click", showLobbyContainer);
// document.getElementById("quiz").addEventListener("click", showQuizContainer);
// document.getElementById("control").addEventListener("click", showControllerContainer);

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
    // USer userNme
    document.getElementById("playerName").innerHTML = userName;
    joinGameContainer.style.display = 'none';
    lobbyContainer.style.display = 'none';
    quizContainer.style.display = 'block';
    controlContainer.style.display = 'none';
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
    // Clear error messages
    document.getElementById("errorGameCode").classList.add("hidden");
    document.getElementById("errorUsername").classList.add("hidden");

    // establish connection to socket server

    let gameCode = document.getElementById("gameCodeValue").value;
    userName = document.getElementById("userNameValue").value;

    if ( gameCode === "" ||
    gameCode === null ||  userName === "" ||
    userName === null) {
        if (
            gameCode === "" ||
            gameCode === null
        ) {
            document.getElementById("errorGameCode").innerHTML = "Please enter a value for the game code";
            document.getElementById("errorGameCode").classList.remove("hidden");
        }

        if ( userName === "" ||
        userName === null) {
            document.getElementById("errorUsername").innerHTML = "Please enter a value for the username";
            document.getElementById("errorUsername").classList.remove("hidden");
        }
        return;
    }
    //create json object to send username and gamecode
    let connectObject = {
        gameCode: gameCode.toLocaleUpperCase(),
        username: userName
      };

    // request to join lobby
    socket.emit("join_lobby", connectObject);
    // socket.emit("join_lobby", JSON.stringify(connectObject))

    socket.on("player_joined", (data) => {
        //check whether a userId was received
        if (data) {
            showLobbyContainer();
        } else {
            document.getElementById("errorGameCode").innerHTML = "Error connecting. Please try again.";
            document.getElementById("errorGameCode").classList.remove("hidden");
        }
    });

    socket.on("on_error", (data) => {
        document.getElementById("errorGameCode").innerHTML = data;
        document.getElementById("errorGameCode").classList.remove("hidden");
    });
}

// --- LOBBY ---
//[commented out because "startQuiz" was constantly emitting]

socket.on("start_quiz", (res) => {
    connectToGame(res)
})

document.getElementById("quitButton").addEventListener("click", () => {
    window.location.reload();
});

function connectToGame()
{
    showQuizContainer();
}

// --- QUIZ ---

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

    document.getElementById(convertintChar(ans)).style.background = '#E1E2EF';
    document.getElementById(convertintChar(ans)).style.color = '#000000';
}

function resetButtons() {
    let no_answers = question["Answers"].length;
    let buttons = "";
    answer = '';

    for (var i = 0; i < no_answers; i++) {
        buttons += 
        `<div class="buttonParent">
            <button id="${convertintChar(i).toUpperCase()}" class="${btn_class}">${convertintChar(i).toUpperCase()}</button>
        </div>`
    }

    document.getElementById("answer-container-id").innerHTML = "";
    document.getElementById("answer-container-id").innerHTML = buttons;

    for (var node of document.getElementsByClassName(btn_class)) {

        node.addEventListener('click', (e) => {
            var id = e.currentTarget.id;
            console.log(id);
            sendAns(e, id.charCodeAt(0) - 'A'.charCodeAt(0)); // convert to int
        })
    }
}

// Events
socket.on("on_next_question", (currentQuestion) => {
    question = currentQuestion;
    console.log(currentQuestion);

    // let buttons = "";
    // for (var i = 0; i < no_answers; i++) {
    //     buttons += 
    //     `<div class="buttonParent">
    //         <button id="${convertintChar(i).toUpperCase()}" class="${btn_class}">${convertintChar(i).toUpperCase()}</button>
    //     </div>`
    // }

    // document.getElementById("answer-container-id").innerHTML = "";
    // document.getElementById("answer-container-id").innerHTML = buttons;
    resetButtons();
});

socket.on("current_players", (players) => {
    const currentPlayer = players.find((player) => player.socketId == socket.id);
    player = currentPlayer; // get score
    console.log(players);
})

socket.on("on_correct_answer", (correctAnswerIndex) => {
    // Change selected option to green if the user answered correctly else change all options to red
    changeBtn(true);

    console.log("Correct Answer: " + convertintChar(correctAnswerIndex));
    console.log("Answer: " + answer);

    if (answer == correctAnswerIndex) {
        document.getElementById(convertintChar(convertintChar(answer))).style.background = '#00FF00';
    } else if (answer != null) {
        document.getElementById(convertintChar(conveertintChar(answer))).style.background = '#FF0000';
    } else {
        resetButtons();
        changeBtn(true);
    }

    document.getElementById("score").innerHTML = player.score;
});

socket.on("duel", (dualPlayer) => {
    is_duel_player = dualPlayer.socketId === socket.id;
    if (is_duel_player) {
        // Get score
        player.score = dualPlayer.score;

        // Redirect to controls page
        showControllerContainer();
    } else {
        document.getElementById("modal_text").innerHTML = `${dualPlayer.username} is duelling.`.toUpperCase();
        openModal();
        //alert(`Player ${player.username} is duelling.`);
    }
});

socket.on("duel_done", () => {
    if (is_duel_player) { showQuizContainer(); }
    else { closeModal(); }
});

// --- CONTROLLER ---

function sendMove(e, dir) {
    e.preventDefault();
    socket.emit("move_ball", {"dir": dir})
    // document.removeEventListener('touchstart', _eventTouchStart);
    // document.removeEventListener('touchend', _eventTouched);
}

// document.getElementById("up").addEventListener('click', (e) => {
//     sendMove(e, 1);
// });

// document.getElementById("left").addEventListener('click', (e) => {
//     sendMove(e, 271);
// });

// document.getElementById("down").addEventListener('click', (e) => {
//     sendMove(e, 181);
// });

// document.getElementById("right").addEventListener('click', (e) => {
//     sendMove(e, 91);
// });

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

