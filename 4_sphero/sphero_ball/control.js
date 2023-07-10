const sphero = require("sphero");
var orb = sphero("/dev/rfcomm0"); // change port accordingly

console.log(orb);

orb.connect(function() {
    console.log("connected");
});