const SERVER_URL = "http://localhost:3000";

const socket = io.connect(SERVER_URL);

function sendDir(e, dir) {
	e.preventDefault();
	socket.emit("move_ball", dir);
}

socket.on("response", (msg) => console.log(msg));

function sendMoveNoEvent(dir, speed) {
	socket.emit("move_ball", dir, speed);
}

let joystick = new JoyStick("joyDiv");
let dirX, dirY;
let mag, dir;
setInterval(() => {
	dirX = joystick.GetX();
	dirY = joystick.GetY();

	if (dirX !== 0) {
		mag = Math.sqrt(Math.pow(dirX, 2) + Math.pow(dirY, 2));

		let vector = math.complex(dirX, dirY);
		dir = (vector.arg() * 180) / 3.14;
		dir = Math.abs(dir - 90);
	} else {
		mag = Math.abs(dirY);
		dir = dirY < 0 ? 180 : 0;
	}

	mag = Math.floor(mag);
	dir = Math.floor(dir);
	console.log(mag, dir);
	sendMoveNoEvent(dir, mag);
}, 200);

/*// Variables to store initial touch position and timestamp
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
});*/

/*
document.getElementById("up").addEventListener('click', (e) => {
    sendDir(e, 0);
});

document.getElementById("left").addEventListener('click', (e) => {
    sendDir(e, 270);
});

document.getElementById("down").addEventListener('click', (e) => {
    sendDir(e, 180);
});

document.getElementById("right").addEventListener('click', (e) => {
    sendDir(e, 90);
});
*/
