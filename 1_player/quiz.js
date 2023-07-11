const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com"?  "https://server-bbd-vac-week.onrender.com/":"http://localhost:3000";

const socket = io.connect(SERVER_URL);
var answer;
var question;
var btn_class = "answer_button"
var playerScore = 0;

function convertintChar(integer) {
    let character = 'a'.charCodeAt(0);
    return String.fromCharCode(character + integer);
}

function changeBtn(disable) {
    for (var button of document.getElementsByClassName(btn_class)) {
        button.disabled = disable;
    }
}

function sendAns(e, ans) {
    answer = ans;
    e.preventDefault();
    socket.emit("return_player_answer", {question: question, answer: ans});
    changeBtn(true); // disable after option has been selected
}

// Events
socket.on("on_next_question", (currentQuestion) => {
    question = currentQuestion["Question"];
    var no_answers = question["Answers"].length;
    
    var buttons = "";
    for (var i = 0; i < no_answers; i++) {
        buttons += `<div>
            <button id=${convertintChar(i)} class=${btn_class}>${convertintChar(i).toUpperCase()}</button>
        </div>`
    }

    document.getElementById("btn_container").innerHTML = buttons;
});

socket.on("current_players", (players) => {
    currentPlayer = players.find((player) => player.socket.id == socket.socket.sessionid);
    playerScore = currentPlayer.score; // get score
})

socket.on("on_correct_answer", (correctAnswerIndex) => {
    // Change selected option to green if the user answered correctly else change all options to red
    changeBtn(true);

    if (correctAnswerIndex == answer) {
        document.getElementById(answer).style.background='#00FF00';
    } else {
        for (var button of document.getElementsByClassName(btn_class)) {
            button.style.background = '#FF0000';
        }
    }

    document.getElementById("score").innerHTML = playerScore;
});

socket.on("duel", (player) => {
    if (player.socket.id == socket.socket.sessionid) {
        // Get score
        playerScore = player.score;

        // Redirect to controls page
        window.location.assign("controls.html");
    } else {
        alert(`Player ${player.username} is duelling.`);
    }
});

// Answer options
for (var node of document.getElementsByClassName(btn_class)) {
    node.innerHTML = node.id;

    document.getElementById(node.id).addEventListener('click', (e) => {
        var id = e.currentTarget.id;
        sendAns(e, id.charCodeAt(0) - 'A'.charCodeAt(0)); // convert to int
    })
}

function quit()
{
    window.location.assign("/"); // leave session
}
