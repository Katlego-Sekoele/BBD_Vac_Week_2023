// Access video, canvas, and coordinate elements
const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

const xCoordinate = document.getElementById("x-coordinate");
const yCoordinate = document.getElementById("y-coordinate");

// Request access to the webcam
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();
    trackBall();
  })
  .catch((error) => {
    console.error("Error accessing the webcam: ", error);
  });

// Function to track the ball
function trackBall() {
  // Draw video frames onto the canvas repeatedly
  function draw() {
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    trackBallPosition();
    requestAnimationFrame(draw);
  }

  // Identify the ball position
  function trackBallPosition() {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    let ballDetected = false;

    // Loop through each pixel of the canvas
    for (let i = 0; i < data.length; i += 4) {
      const red = data[i];
      const green = data[i + 1];
      const blue = data[i + 2];

      // Check if the pixel represents the ball color (adjust the values as per your ball color)
      if (red > 200 && green < 100 && blue < 100) {
        const x = (i / 4) % canvas.width;
        const y = Math.floor(i / 4 / canvas.width);

        drawCircle(x, y);
        updateCoordinates(x, y);
        ballDetected = true;
      }
    }

    if (!ballDetected) {
      clearCoordinates();
    }
  }

  // Draw an outline of a circle at the given position
  function drawCircle(x, y) {
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI);
    context.strokeStyle = "red";
    context.lineWidth = 2;
    context.stroke();
  }

  // Update the coordinate values in the textbox
  function updateCoordinates(x, y) {
    xCoordinate.value = x;
    yCoordinate.value = y;
  }

  // Clear the coordinate values in the textbox
  function clearCoordinates() {
    xCoordinate.value = "";
    yCoordinate.value = "";
  }

  // Start drawing frames
  draw();
}
