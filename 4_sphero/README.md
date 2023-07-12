# Using the Sphero Ball

Info was taken from the sphero.js npm website, from [here](https://www.npmjs.com/package/sphero)

## Install sphero library
Run the command:
```bash
npm install sphero
```

## To connect vie BLE:
```javascript
var sphero = require("sphero"),
    bb8 = sphero("F3:F2:6D:55:71:09"); // change BLE address accordingly
 
bb8.connect(function() {
  // roll BB-8 in a random direction, changing direction every second
  setInterval(function() {
    var direction = Math.floor(Math.random() * 360);
    bb8.roll(150, direction);
  }, 1000);
});
```

This seems to be easy to connect to and use the ball.
Line 2 above just uses the Bluetooth Low Energy Address of the ball, thereafter, the `roll` command is used. In this case, 150 is the speed and direction is the heading relative to the last calibrated direction.

## Methods we will use:
The functions are [here](https://www.npmjs.com/package/sphero?activeTab=code)

## Spherov2.js
- Install this library, you will need to install [this](https://visualstudio.microsoft.com/downloads/) first. click on free download and install c++ desktop development suite. Then run `npm install spherov2.js`. Make sure you also have python installed on your device.

## Python
Basically, everything above is wrong, we used python to work with the ball.
You have to run pip install the following packages:
```bash
spherov2 - for ball
socketio - for server/client comms
```
Then to find the ball on your device, you use: 
```python
from spherov2 import scanner
from spherov2.sphero_edu import SpheroEduAPI

toy = scanner.find_BB8()

if toy == None:
    print("No toy found")
else:
    print(f"Toy: {toy.name} found")
```
Then to use it, use: 
```python
with SpheroEduAPI(toy) as api:
  # watherver  
```

The with line takes long to execute, but then everything else takes quick. GLHF `:)`