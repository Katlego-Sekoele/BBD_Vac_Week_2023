var xLen = 10;
var yLen = 10;


function initializeMap(numCones)
{
    // Get the starting map with all empty positions
    var map = new Array(yLen);
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

    // Place the cones equally around the center
    if (numCones == 3) // Top and bottom two corners
    {
        map[centerY-centerOffset][centerX] = '1';
        map[centerY+centerOffset][centerX-centerOffset] = '2';
        map[centerY+centerOffset][centerX+centerOffset] = '3';
    }
    else if (numCones == 4) // Above, below, left, right
    {
        map[centerY-centerOffset][centerX] = '1';
        map[centerY+centerOffset][centerX] = '2';
        map[centerY][centerX-centerOffset] = '3';
        map[centerY][centerX+centerOffset] = '4';
    }
    else // Above and below center, default option
    {
        map[centerY-centerOffset][centerX] = '1';
        map[centerY+centerOffset][centerX] = '2';
    }


    //var lineSquares = calcStraightLine(2, 2, 4, 4);
    //console.log(lineSquares);

    //for (var i = 0; i < lineSquares.length; i++)
    //{
    //    map[lineSquares[i][1]][lineSquares[i][0]] = 'T';
    //}


    return map;
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




console.log(initializeMap(4));
