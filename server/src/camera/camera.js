// Access video, canvas, and coordinate elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d", { willReadFrequently: true });

// Colors
const Player1 = [170, 239, 61];// Light Green
const Player2 = [0, 175, 203]; // Light Blue
const Player3 = [246, 21, 144]; // Light pink/purple
const Player4 = [225, 255, 0];  // Light yellow
const Ball = [225, 0, 0]; // Red

function absoluteDifference(pixel, color) {
  let ans = 0
  for (let i = 0; i < 3; i++) {
    const diff = Math.abs(pixel[i] - color[i]);
    ans += diff;
  };

  return ans;
}

function updatePositions(pixel, x, y, positions) {
  let threshold = 65;

  if (absoluteDifference(pixel, Ball) <= threshold) {
    positions.ball = [x, y];
  } else if (absoluteDifference(pixel, Player1) <= threshold) {
    positions.player1 = [x, y];
  }
  else if (absoluteDifference(pixel, Player2) <= threshold) {
    positions.player2 = [x, y];
  } else if (absoluteDifference(pixel, Player3) <= threshold) {
    positions.player3 = [x, y];
  } else if (absoluteDifference(pixel, Player4) <= threshold) {
    positions.player4 = [x, y];
  }
}

function getCameraPermission() {
  // Request access to the webcam
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    })
    .catch((error) => {
      console.error("Error accessing the webcam: ", error);
    });
}

// Function to track the ball
function getMap() {
  return trackBallPosition();
}

// Identify the ball position
function trackBallPosition() {
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const positions = {
    ball: [-1, -1],
    player1: [-1, -1],
    player2: [-1, -1],
    player3: [-1, -1],
    player4: [-1, -1],
    dimensions: [canvas.width, canvas.height]
  };

  // Loop through each pixel of the canvas
  for (let i = 0; i < data.length; i += 4) {
    const red = data[i];
    const green = data[i + 1];
    const blue = data[i + 2];

    // Check if the pixel represents the ball color (adjust the values as per your ball color)
    const x = (i / 4) % canvas.width;
    const y = Math.floor(i / 4 / canvas.width);
    let pixel = [red, green, blue];
    updatePositions(pixel, x, y, positions);
  }

  return JSON.stringify(positions);
}
