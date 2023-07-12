//import "./socket.io/client-dist/socket.io.js";
import {createMap} from "./MapStuff/mapMain.js";
// for navigation purposes
const startGameContainer = document.getElementById('start-game-container');
const setUpGameContainer = document.getElementById('set-up-game-container');
const qrScreenMainBox = document.getElementById('QR-screen-main-box');
const questionPageMainBox = document.getElementById('question-page-main-box');
const mapContainer = document.getElementById('map-container');

let players = [];
let currentLobbyCode = null;

let videoCapture;
let canvas;
let sketch;
let detector;

let mapWidth = 640;
let mapHeight = 480;

function gotDetections(error, result) {
    if(error) {
        console.log(error);
    }

    // Draw bounding boxes
    const objects = [];
    for(let object of result) {
        sketch.fill(0, 255, 0, 125 * object.confidence);
        sketch.rect(object.x, object.y, object.width, object.height);

        objects.push({
            label: object.label,
            x: object.x,
            y: object.y,
        });
    }

    socket.emit("on_labels", objects);
    
    detector.detect(videoCapture, gotDetections);
}

function preload(sk) {
    sketch = sk; 
    detector = ml5.objectDetector('cocossd');
}

function setup(sketch) {    
    canvas = sketch.createCanvas(mapWidth, mapHeight);

    canvas.parent('pixel_map_container');
    videoCapture = sketch.createCapture(sketch.VIDEO);
    detector.detect(videoCapture, gotDetections);

    videoCapture.size(mapWidth, mapHeight);
    videoCapture.hide();
}

function draw(sketch) {
    sketch.background(255);
    sketch.image(videoCapture, 0, 0, mapWidth, mapHeight);
}


// Event listeners or any other logic to trigger the container changes
document.getElementById("homescreen-start-btn").addEventListener("click", showQRScreenMainBox);
document.getElementById("start-game-btn").addEventListener("click", emitTheSocket);
document.getElementById('quit_btn').addEventListener("click", showStartGameContainer)
document.getElementById("videoToggle").addEventListener("click",toggleCamera);
document.getElementById("videoToggle1").addEventListener("click",toggleCamera);


document.getElementById('pixel_map_container').innerHTML = ""; 
// Socket.io stuff
const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com" ? "https://server-bbd-vac-week.onrender.com/" : "http://localhost:3000";
const DEFAULT_SIZE = 4
let socket = io.connect(SERVER_URL);
// manager connects to socket server


socket.on("connect", () => {
	// connect event
	const engine = socket.io.engine;

	engine.on("packet", ({ type, data }) => {
		// called for each packet received
	});

	engine.on("packetCreate", ({ type, data }) => {
		// called for each packet sent
	});
});

socket.on('start_quiz', () => {
    const parent = document.getElementById("pixel_map_container");
    parent.innerHTML = "";

    const sk = (sketch) => {
        sketch.preload = () => preload(sketch);
        sketch.setup = () => setup(sketch);
        sketch.draw = () => draw(sketch);
    }
    
    new p5(sk);

    canvas.parent("pixel_map_container");
    showQuestionPageMainBox();
});
socket.on('on_error', (error) => {
    alert(error);
});

// disconnect event
socket.on("disconnect", () => {});

socket.on("generic_event", (data) => {
	//     TODO: decide on events with server team
});

socket.on("player_join", (data) => {
	//     TODO: decide on events with server team
});

//send payload to server and invoke another_generic_event on server side
//socket.emit("another_generic_event", payload)

socket.emit('generate_initial_map');
socket.on('on_generated_map', (data) => {
	console.log(data);
	createMap(data);
});

socket.on('current_players', (currentPlayers) => {
    players = currentPlayers;
    updateScoreboard(players);
});

socket.on("lobby_code", lobbyCode => {
    document.getElementById("lobby_code").innerText = 'LOBBY CODE: ' + lobbyCode;
});

socket.on('duel', (playerControllingTheBall) => {
    document.getElementById("who_controlling_ball").innerText = playerControllingTheBall.username +" is controlling the ball";
    // TODO: get the info using the camera now to cause map updates

    beginMapUpdate();
});
socket.on('duel_done', () => {
    document.getElementById("who_controlling_ball").innerText = "No one is controlling the ball";
    endMapUpdate()
});


socket.on('on_next_question', (question) => {
    //update the question and answers
    document.getElementById("question_holder").innerText = question.Question;
    document.getElementById("answer_1").innerText = "A: " + question.Answers[0]; //TODO: idk how the question object is structured
    document.getElementById("answer_2").innerText = "B: " + question.Answers[1];
    document.getElementById("answer_3").innerText = "C: " + question.Answers[2];
    document.getElementById("answer_4").innerText = "D: " + question.Answers[3];

    document.getElementById("answer_1").style.backgroundColor = "var(--purple)";
    document.getElementById("answer_2").style.backgroundColor = "var(--purple)";
    document.getElementById("answer_3").style.backgroundColor = "var(--purple)";
    document.getElementById("answer_4").style.backgroundColor = "var(--purple)";
});

// TODO: add the code so when the next question button is pressed then the socket.emit is called
document.getElementById("next_question_btn").onclick = () => {
	socket.emit("make_next_question"); //I don't think there is data to this event
};

//TODO: add the code so when the 'evaluate' button is pressed then the socket.emit is called
document.getElementById("evaluate_btn").onclick = () => {
    socket.emit("evaluate");
};

socket.on('on_correct_answer', (indexOfCorrectAnswer) => {
    document.getElementById("answer_" + (indexOfCorrectAnswer + 1)).style.backgroundColor = "var(--correctGreen)";
    updateScoreboard(players);
});


function updateScoreboard(currentPlayers) {
    for (var i = 0; i < 8; i++) { // this is added so that if the number of players decreases then the others will be removed
        // Update div content with usernames and score
        var divUsername = document.getElementById("username_" + (i + 1));
        divUsername.innerText = "";
        var divScore = document.getElementById("score_" + (i + 1));
        divScore.innerText = ""; 
        var lobbyUsername = document.getElementById('lobby_username_' + (i+1));
        lobbyUsername.innerText = "";
      }

    for (var i = 0; i < currentPlayers.length; i++) {
        var player = currentPlayers[i];
  
        // Update div content with usernames and score
        var divUsername = document.getElementById("username_" + (i + 1));
        divUsername.innerText = player.username;
        var divScore = document.getElementById("score_" + (i + 1));
        divScore.innerText = player.score; 
        var lobbyUsername = document.getElementById('lobby_username_' + (i+1));
        lobbyUsername.innerText = player.username;
        document.getElementById('numJoined').innerText = players.length + "/8 joined";
      }
}   

let cameraOn = true;
 function toggleCamera(){
    if(cameraOn){
        document.getElementById("video").style.display = "none";
        cameraOn = false;
        document.getElementById("videoToggle").innerHTML = "TOGGLE CAMERA ON"
        document.getElementById("videoToggle1").innerHTML = "TOGGLE CAMERA ON"

    }else{
        document.getElementById("video").style.display = "block";
        cameraOn = true;
        document.getElementById("videoToggle").innerHTML = "TOGGLE CAMERA OFF"
        document.getElementById("videoToggle1").innerHTML = "TOGGLE CAMERA OFF"
    }

 }
    
    //nav functions
    function showStartGameContainer() {
    socket.emit("game_master_quit_game");
     document.getElementById('pixel_map_container').innerHTML = "";   
    startGameContainer.style.display = 'block';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the set up game container and hide the rest
function showSetUpGameContainer() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'block';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the QR screen main box container and hide the rest
function showQRScreenMainBox() {
    updateScoreboard(players);
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'block';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the question page main box container and hide the rest
function showQuestionPageMainBox() {
    updateScoreboard(players);
    document.getElementById("who_controlling_ball").innerText = "No one is controlling the ball";
    socket.emit('generate_initial_map', 4);
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'block';
    mapContainer.style.display = 'none';
    document.getElementById('question_holder').innerText = "Question will appear here";
    document.getElementById('answer_1').innerText = "A: ";
    document.getElementById('answer_2').innerText = "B: ";
    document.getElementById('answer_3').innerText = "C: ";
    document.getElementById('answer_4').innerText = "D: ";
}

// Function to show the map container and hide the rest
function showMapContainer() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'block';
}

function convertImageCoOrdToGrid(coOrdinatesArray){
    //initialise mapGrid with default values
    var mapGrid = new Array(yLen)

    for (var i = 0; i < yLen; i++)
    {
        mapGrid[i] = [];
        for (var j = 0; j < xLen; j++)
        {
            mapGrid[i][j] = 'W';
        }
    }

    //place all the items
    for (var i = 0; i < coOrdinatesArray.length; i++){
        //store the type (either player number or "B" for ball)
        sValue = coOrdinatesArray[0]
        //store the co-ordinates
        xCoOrd = coOrdinatesArray[1]
        yCoOrd = coOrdinatesArray[2]

        //assign the value in the grid if it is currently a "W"
        if (mapGrid[xCoOrd][yCoOrd] == "W"){
            mapGrid[xCoOrd][yCoOrd] = sValue
        }
        else{
            //f the space is already filled by another object then place it in it's previous spot
            coOrds = findObject(sValue)
            xCoOrd = coOrds[0]
            yCoOrd = coOrds[1]

            mapGrid[xCoOrd][yCoOrd] = sValue
        }
    }

    map = mapGrid
}


function populateObjectArray(objects){
    //objects = require('./../controller/') //path to the .json file [NEEDS TO BE FINISHED]
    //jason layout can be found in branch 4_experimental, in the readME under "src/camera"
    //initialise object array as empty
    objectsArray = []

    /*temporary object
    const objects = {
        ball: [10, 20],
        Player1: [30, 40],
        Player2: [50, 60],
        Player3: [70, 80],
        Player4: [90, 10],
        dimension: [500, 300]
    };*/
    
    array = Object.entries(objects)
    // store the width and the height of what the camera can see
    dimensions = objects.dimension

    xDimension = dimensions[0]
    yDimension = dimensions[1]
    
    //get all the information about the ball
    let sphero = (array[0])[1]
    xSphero = sphero[0]
    ySphero = sphero[1]

    // calculate the balls true x and y co-ordinate, convert it to a 100-by-100 grid
    xFinal = Math.round((xSphero / xDimension) * 100)
    yFinal = Math.round((ySphero / yDimension) * 100)

    //push the ball information into the object array
    objectsArray.push(["B", xFinal, yFinal])

    for (let playerIndex = 1; playerIndex < (array.length - 1); playerIndex++){
        sPlayerNumber = playerIndex.toString()

        //store the co-ordinates array
        currentPlayerCoOrds = array[playerIndex][1]

        //store the X and Y
        playerX = currentPlayerCoOrds[0]
        playerY = currentPlayerCoOrds[1]

        // calculate the balls true x and y co-ordinate, convert it to a 100-by-100 grid
        xFinal = Math.round((playerX / xDimension) * 100)
        yFinal = Math.round((playerY / yDimension) * 100)

        //store the information in the player information array
        objectsArray.push([sPlayerNumber, xFinal, yFinal])
    }
    

    //return the array of objects
    return objectsArray
}


let intervalId = -1;

function beginMapUpdate(){
    intervalId = setInterval(()=> {
        const map = getMap();
        const objectArray = populateObjectArray(map);
        const convertedMap = convertImageCoOrdToGrid(objectArray);
        createMap(convertedMap);
    }, 1000);
}

function endMapUpdate() {
    clearInterval(intervalId);
}

function emitTheSocket(){
    socket.emit("game_start");
}

