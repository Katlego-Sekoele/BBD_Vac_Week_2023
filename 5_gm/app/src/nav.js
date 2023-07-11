// Get references to the container elements
const startGameContainer = document.getElementById('start-game-container');
const setUpGameContainer = document.getElementById('set-up-game-container');
const qrScreenMainBox = document.getElementById('QR-screen-main-box');
const questionPageMainBox = document.getElementById('question-page-main-box');
const mapContainer = document.getElementById('map-container');

// Function to show the start game container and hide the rest
function showStartGameContainer() {
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
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'block';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the question page main box container and hide the rest
function showQuestionPageMainBox() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'block';
    mapContainer.style.display = 'none';
}

// Function to show the map container and hide the rest
function showMapContainer() {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'block';
}

// Event listeners or any other logic to trigger the container changes

document.getElementById("homescreen-start-btn").addEventListener("click", showSetUpGameContainer);
document.getElementById("nextbutton").addEventListener("click", showQRScreenMainBox);
document.getElementById("start-game-btn").addEventListener("click", showQuestionPageMainBox);