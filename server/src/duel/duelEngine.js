var xLen = 100;
var yLen = 100;
var test = [1,3,0];
var map = new Array(yLen)

function initializeMap(numCones)
{
    // Get the starting map with all empty positions
    //might need line below
    //var map = new Array(yLen);
    for (var i = 0; i < yLen; i++)
    {
        map[i] = [];
        for (var j = 0; j < xLen; j++)
        {
            map[i][j] = 'W';
        }
    }

    // Place the ball in the center (bottom right center)
    var centerX = Math.floor(xLen/2);
    var centerY = Math.floor(yLen/2);
    map[centerY][centerX] = 'B';

    // Random offset for distance of cones from center
    var centerOffset = Math.floor(Math.random()*(Math.min(centerX, centerY)-1-1))+1;
    //console.log(centerOffset);

    // Place the cones equally around
    if (numCones < 2 || numCones > 8)
        numCones = 2;
    for (var i = 0; i < numCones; i++)
    {
        var angle = (360/numCones)*Math.PI/180*i;
        //console.log(angle);
        var newCoord = ellipticalDiscToSquare(angle);
        var correctedY = Math.round(newCoord[0]*centerOffset)+centerY
        var correctedX = Math.round(newCoord[1]*centerOffset)+centerX

        map[correctedY][correctedX] = i.toString();
    }


    //var lineSquares = calcStraightLine(2, 2, 4, 4);
    //console.log(lineSquares);

    //for (var i = 0; i < lineSquares.length; i++)
    //{
    //    map[lineSquares[i][1]][lineSquares[i][0]] = 'T';
    //}


    return map;
}

// Elliptical Grid mapping
// mapping a circular disc to a square region
// input: angle in circle
// output: (x,y) coordinates in the square
function ellipticalDiscToSquare(angle)
{
    u = Math.cos(angle);
    v = Math.sin(angle);

    var u2 = u * u;
    var v2 = v * v;
    var twosqrt2 = 2.0 * Math.sqrt(2.0);
    var subtermx = 2.0 + u2 - v2;
    var subtermy = 2.0 - u2 + v2;
    var termx1 = Math.abs(subtermx + u * twosqrt2);
    var termx2 = Math.abs(subtermx - u * twosqrt2);
    var termy1 = Math.abs(subtermy + v * twosqrt2);
    var termy2 = Math.abs(subtermy - v * twosqrt2);
    x = 0.5 * Math.sqrt(termx1) - 0.5 * Math.sqrt(termx2);
    y = 0.5 * Math.sqrt(termy1) - 0.5 * Math.sqrt(termy2);

    return [x, y]
}

// Takes in two coordinate pairs and returns a minimal traced
// line between the two using the Bresenham algorithm
function calcStraightLine(x1, y1, x2, y2)
{
    var coordinatesArray = new Array();

    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    // Set first coordinates
    coordinatesArray.push([x1, y1]);

    // Loop until end point reached
    while (!((x1 == x2) && (y1 == y2)))
    {
        var e2 = err << 1;
        if (e2 > -dy)
        {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx)
        {
            err += dx;
            y1 += sy;
        }
        // Set coordinates
        coordinatesArray.push([x1, y1]);
    }

    // Return the result
    return coordinatesArray;
}

//Determine if a player is allowed to duel
function initiateDuel(playerScores){
    const streakVal = 3;
    const playerDuelStates = new Array(playerScores.length);
    playerScores.forEach((playerScore,index) => {
        const multiplier = calculateMulitplier(index);
        if (playerScore==streakVal){
            //playerDuelStates[index] = true;
            playerDuelStates[index] = 10*multiplier;
        }
        else{
            //playerDuelStates[index] = false;
            playerDuelStates[index] = 0;
        }
    });
    //return array of states to determine if a player can duel.

    return playerDuelStates;
}


//currentPlayer is an integer based index for the current player
//takes in the player currently controlling the ball and returns a value between 1 and maxMultiplier
function calculateMulitplier(currentPlayer){
    //the max value of the multiplier, max will be at the edge of the game map
    maxMultiplier = 3
    currentPlayer += 1
    //store the current player as a string
    let sCurrentPlayer = currentPlayer.toString()

    // declare coOrdinate with deault value that are impossible
    let coOrdinate = {
        x : -1,
        y : -1
    }

    // find the x and y of the current coOrdinate
    map.forEach((row, index) => {
        const playerPosition = row.indexOf(sCurrentPlayer);
        if (playerPosition > -1) {
          coOrdinate.x = playerPosition;
          coOrdinate.y = index;
        }
      });


    //if there has been an error log it to the console
    if ((coOrdinate.x < 0) || (coOrdinate.y < 0)){
        console.log("ERROR! PLAYER CONE NOT FOUND. ENSURE THAT PLAYER IS REPRESENTED AS A NUMBER FROM 1 - 8 AND THE MAP IS PROPERLY INITIALISED")
    }

    //find the shortest distance to an edge
    if (coOrdinate.x <= (map.length / 2)){
        xDistanceToEdge = coOrdinate.x
    }
    else{
        xDistanceToEdge = map.length - coOrdinate.x - 1
    }
    if (coOrdinate.y <= (map.length / 2)){
        yDistanceToEdge = coOrdinate.y
    }
    else{
        yDistanceToEdge = map.length - coOrdinate.y - 1
    }

    if (xDistanceToEdge > yDistanceToEdge){
        shortestDistanceToEdge = yDistanceToEdge
    }
    else{
        shortestDistanceToEdge = xDistanceToEdge
    }

    // final calculation of multiplier
    return 1 + ((maxMultiplier - 1) - ((maxMultiplier - 1) * (shortestDistanceToEdge / (map.length / 2))))
} 

function checkIfBallHasLeftPlayingZone(){

    //initialise the ball being found as false
    ballFound = false

    //loop through all the rows and columns of the array and try find the ball, if you cannot find it then call handle ball loss
    map.forEach(row => {
        const ballPosition = row.indexOf("B");
        if (ballPosition > -1) {
            ballFound = true;
        }
      });

    //return wether the ball has been found
    return ballFound
}

function replaceBallInCentre(){
    
    //if the ball has not been found then handle the reset
    if (ballFound){
        centreCoOrdinate = Math.floor(map.length / 2)

        //check if the centre cell is occupied by anythin, if it is not then fill it otherwise find a different suitable location
        if (map[centreCoOrdinate][centreCoOrdinate] == "W"){
            //insert the ball in the centre
            map[centreCoOrdinate][centreCoOrdinate] = "B"
        }

        //otherwise generate a random co-ordinate near the centre
        notFound = true

        while (notFound) {
            //calculate the min and max bound of the minimum 
            min = -Math.ceil(map.length / 10)
            max = Math.ceil(map.length / 10) + 1

            
            //generate a random distance from the centre and find that co-ordinate
            x = centreCoOrdinate + (Math.floor(Math.random() * (max - min) ) + min)
            y = centreCoOrdinate + (Math.floor(Math.random() * (max - min) ) + min)

            if (map[x][y] == "W"){
                notFound = false
            }
        }

        //insert the ball at the new co-ordinate
        map[x][y] == "B"
    }
    return map
}

function findRemainingPlayers(){
    //store the amount of rows and columns in a varaible
    let dimension = map.length

    //an array to store all the remaining players
    let remainingPlayers = []

    //loop through all the rows and columns
    for (let row = 0; row < dimension; row++){
        for (let column = 0; column < dimension; column++){
            //check wether the current index is not pre-occupied
            if ((map[row][column] != "W") && (map[row][column] != "B")){
                remainingPlayers.push(map[row][column])
            }
        }
    }

    //return the remaing players
    return remainingPlayers
}

function checkWin(){
    //if one player is remaing then they have won
    if (findRemainingPlayers().length == 1){
        return true
    }
    return false

    //if this function returns a true then use getPlayerWin to find which player has won
}

function getPlayerWin(){
    //call when checkWin is true to get who won the game
    return parseInt(findRemainingPlayers()[0])
}

//hand in integer that indexes the current player,creturns true if the player has lost, returns false if they have not lost
function checkPlayerLoss(currentPlayer){
    //get the dimension of the map
    let dimension = map.length

    //loop through all the rows and columns
    for (let row = 0; row < dimension; row++){
        for (let column = 0; column < dimension; column++){
            //check wether the current index is not pre-occupied
            if (map[row][column] == currentPlayer.toString()){
                return false
            }
        }
    }
    return true
}


//console.log(initializeMap(4));
//console.log(initiateDuel(test));
//console.log(getPlayerWin())


module.exports = {initializeMap}
