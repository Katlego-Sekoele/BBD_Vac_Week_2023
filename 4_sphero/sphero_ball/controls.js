// const sphero = require('sphero');
// const { Scanner, Utils } = require('spherov2.js');

// let ball;

// //connects to the ball
// const connectBall = async () =>{
//     ball = await Scanner.findBB9E();
//     while (!ball){
//         console.log("cc")
//         ball = await Scanner.findBB9E();
//     }
//     if (!ball){
//         logToMain({type:"connection", message:"error"});
//     } else {
//         logToMain({type:"connection", message:"success"});
//     }
// }

// //moves the ball 
// const moveBall = async(speed, angle) => {

//     if (!ball){
//         logToMain({type:"move", message:"error no ball"});
//         return;
//     } else {
//         angle = 90;
//         speed = 100;

//         ball.roll(speed, angle);

//         let dir = [speed, angle];
//         logToMain({type:"move", message: dir});
//         return;
//     }
// }

// const logToMain = async (JSONObject) => {
//     console.log(JSONObject);
// }

// // logToMain({hello: "world"});

// connectBall();
// console.log("Y")
// while (true){
//     moveBall(1, 2);
// }




const { exec } = require('child_process');

// Function to call the Python script
function callPythonScript() {
  exec('/groupa_bbd_vacweek_2023/.venv/Scripts/python.exe /groupa_bbd_vacweek_2023/4_sphero/sphero_ball/python/ballControl.py', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Python script: ${error}`);
      return;
    }
    console.log('Python script executed successfully');
    console.log(stdout);
  });
}

// Call the Python script function
callPythonScript();
