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