// Function to show the start game container and hide the rest
export function showStartGameContainer(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer) {
    startGameContainer.style.display = 'block';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the set up game container and hide the rest
export function showSetUpGameContainer(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer) {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'block';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the QR screen main box container and hide the rest
export function showQRScreenMainBox(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer) {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'block';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'none';
}

// Function to show the question page main box container and hide the rest
export function showQuestionPageMainBox(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer) {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'block';
    mapContainer.style.display = 'none';
}

// Function to show the map container and hide the rest
export function showMapContainer(startGameContainer, setUpGameContainer, qrScreenMainBox, questionPageMainBox, mapContainer) {
    startGameContainer.style.display = 'none';
    setUpGameContainer.style.display = 'none';
    qrScreenMainBox.style.display = 'none';
    questionPageMainBox.style.display = 'none';
    mapContainer.style.display = 'block';
}