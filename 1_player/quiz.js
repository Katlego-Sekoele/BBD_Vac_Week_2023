const SERVER_URL = "http://localhost:3000";

const socket = io.connect(SERVER_URL);

function sendDir(e, dir) {
    e.preventDefault();
    socket.emit("return_player_answer", dir);
}

socket.on("controle", (msg) => {
    window.location.assign("controls.html");
    console.log(msg)
});

document.getElementById("A").addEventListener('click', (e) => {
    sendDir(e, "A");
});

document.getElementById("B").addEventListener('click', (e) => {
    sendDir(e, "B");
});

document.getElementById("C").addEventListener('click', (e) => {
    sendDir(e, "C");
});

document.getElementById("D").addEventListener('click', (e) => {
    sendDir(e, "D");
});



// function sendAnswer(userInput)
// {
//     //create json object to send gameAnswer
//     var quizJSON = '{"answer": '+ userInput + '}';

//     console.log(userInput);
// }

function quit()
{
    window.location.assign("connect.html");
}