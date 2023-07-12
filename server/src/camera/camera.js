const canvas = document.getElementById("canvas");
const video = document.getElementById("video");
const context = canvas.getContext("2d", { willReadFrequently: true });

// Ball colour followed by player colours
const CONFIG = [
    [200, 0, 0],
    [170, 239, 61],
    [0, 175, 203],
    [246, 21, 144],
    [225, 225, 0]
];

const THRESHOLD = 75;
const NO_CLASS = -1;

function getAveragePosition(pos1, pos2) {
    result = [0, 0];
    result[0] = Math.floor((pos1[0] + pos2[0]) / 2);
    result[1] = Math.floor((pos1[1] + pos2[1]) / 2);
    return result;
}

function getColourSimilarity(pixel, color) {
    let ans = Math.abs(pixel[0] - color[0]);
    ans += Math.abs(pixel[1] - color[1]);
    ans += Math.abs(pixel[2] - color[2]);
    return ans;
}

function getColourClass(pixelValue) {
    for (let i = 0; i < CONFIG.length; ++i) {
        if (getColourSimilarity(pixelValue, CONFIG[i]) <= THRESHOLD) {
            return i;
        }
    }

    return NO_CLASS;
}

function assignMatchingColour(image, index, positions) {
    let red = image[index];
    let green = image[index + 1];
    let blue = image[index + 2];

    let x = (index / 4) % canvas.width;
    let y = Math.floor((index / 4) / canvas.width);
    let pixelLocation = [x, y];

    let pixelValue = [red, green, blue];
    let colourClass = getColourClass(pixelValue);

    if (colourClass == NO_CLASS)
        return;

    positions[colourClass] = pixelLocation;
}


function getObjectPositions() {
    const image = context.getImageData(0, 0, canvas.width, canvas.height).data;

    let bottomRightPositions = new Array(CONFIG.length).fill([-1, -1]);
    let topLeftPositions = new Array(CONFIG.length).fill([-1, -1]);

    // Loop through each pixel of the canvas
    for (let i = 0; i < image.length; i += 4) {
        assignMatchingColour(image, i, bottomRightPositions);
    }

    for (let i = image.length - 4; i >= 0; i -= 4) {
        assignMatchingColour(image, i, topLeftPositions);
    }

    const finalPositions = new Array(CONFIG.length).fill([-1, -1]);

    for (let i = 0; i < CONFIG.length; ++i) {
        finalPositions[i] = getAveragePosition(bottomRightPositions[i], topLeftPositions[i]);
    }

    context.beginPath();
    context.fillStyle = "green";
    // This will put a dot at the centre of player 2's colour
    context.arc(finalPositions[0][0], finalPositions[0][1], 5, 0, Math.PI * 2, true);
    context.fill();

    jsonObj = {
        ball: finalPositions[0]
    };

    for (let i = 1; i < CONFIG.length; ++i) {
        let key = "Player" + i.toString();
        jsonObj[key] = finalPositions[i];
    }

    jsonObj.dimension = [canvas.width, canvas.height];

    return JSON.stringify(jsonObj);
}

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

// Use this function for simply returning the JSON object
// function getMap() {
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     return getObjectPositions();
// }

// This implementation will redraw the image with highlighting the found ball with a green dot
function getMap() {
    function draw() {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        getObjectPositions();
        requestAnimationFrame(getMap);
    }

    draw();
}