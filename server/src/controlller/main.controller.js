const ball = require("./ball.controller.js");

function moveBall(direction){
    // Call Ball functions to move here
    console.log("MB " + direction);
    ball.test(direction);
    return "Ball moved";
}

function getMap(){
    // Call Map functions to get map here
    return "Map returned";
}

module.exports = {
    moveBall, getMap
}