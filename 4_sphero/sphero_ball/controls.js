const { Scanner, Utils } = require('spherov2.js');

let ball;

//connects to the ball
const connectBall = async () =>{
     ball = await Scanner.findSpheroMini();
    
    if (!sphero){
        logToMain({type:"connection", message:"error"});
    } else {
        logToMain({type:"connection", message:"success"});
    }
}

//moves the ball 
const moveBall = async(speed, angle) => {
    if (!sphero){
        logToMain({type:"move", message:"error"});
        return;
    }

    angle = 90;
    speed = 100;

    ball.roll(speed, angle);

    let dir = [speed, angle];
    logToMain({type:"move", message: dir});
}

const logToMain = async (JSONObject) => {
    console.log(JSONObject);
}