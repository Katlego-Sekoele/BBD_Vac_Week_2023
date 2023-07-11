ballController = require('./ball.controller')
cameraController = require('./camera.controller')

console.log("Time")
ballController.moveLeft(1000)

function mainMoveLeft(time){
    console.log("in main controller")
}


module.exports = { mainMoveLeft }