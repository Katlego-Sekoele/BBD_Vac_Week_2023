const SERVER_URL = window.location.host === "server-bbd-vac-week.onrender.com"?  "https://server-bbd-vac-week.onrender.com/":"http://localhost:3000";

const socket = io.connect(SERVER_URL);

function sendMove(e, dir, speed) {
    e.preventDefault();
    socket.emit("move_ball", dir, speed)
    window.location.assign("quiz.html");
}

// Variables to store initial touch position and timestamp
let startX, startY, startTime;

// Constants for angle calculation
const RAD_TO_DEG = 180 / Math.PI;

// Event listener for touch start
document.addEventListener('touchstart', function(event) {
  // Store initial touch position and timestamp
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
  startTime = Date.now();
});

// Event listener for touch end
document.addEventListener('touchend', function(event) {
  // Calculate drag distance
  const endX = event.changedTouches[0].clientX;
  const endY = event.changedTouches[0].clientY;
  const distanceX = endX - startX;
  const distanceY = endY - startY;

  // Calculate angle in degrees
  const angle = Math.atan2(distanceY, distanceX) * RAD_TO_DEG;

  // Calculate drag speed
  const endTime = Date.now();
  const duration = endTime - startTime;
  const speed = Math.sqrt((distanceX * distanceX + distanceY * distanceY)) / duration;

  // Output the calculated values
  console.log('Angle: ' + angle + ' degrees');
  console.log('Speed: ' + speed + ' pixels per millisecond');

  sendMove(e, angle, speed);
});

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