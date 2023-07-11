const SERVER_URL = "http://localhost:3000";

const socket = io.connect(SERVER_URL);

function convertintChar(integer) {
    let character = 'a'.charCodeAt(0);
    return String.fromCharCode(character + integer);
}

function sendAns(e, dir) {
    e.preventDefault();
    socket.emit("return_player_answer", dir);
}

// Events
socket.on("on_next_question", (msg) => {
    question_answer = JSON.parse(msg);
    
    buttons = "";
    for (var i = 0; i < question_answer.answers.length; i++) {
        buttons += `<div>
            <button id=${convertintChar(i)} class="answer_button">${convertintChar(i).toUpperCase()}</button>
        </div>`
    }

    document.getElementById("btn_container").innerHTML = buttons;
});

socket.on("on_answer_status", (msg) => {
    console.log(msg);
});

// Answer options
for (const node of document.getElementsByClassName("answer_button")) {
    node.innerHTML = node.id;

    document.getElementById(node.id).addEventListener('click', (e) => {
        sendAns(e, node.id);
    })
}

function quit()
{
    window.location.assign("connect.html");
}