var rows = 5;
var cols = 5;


function initializeMap(numPlayers)
{
    //Get the starting map with all empty positions
    var map = new Array(rows);
    for (var i = 0; i < rows; i++)
    {
        map[i] = [];
        for (var j = 0; j < cols; j++)
        {
            map[i][j] = 'W';
        }
    }

    //Place the ball in the center (top left center)
    var centerRow = Math.floor(rows/2);
    var centerCol = Math.floor(cols/2);
    map[centerRow][centerCol] = 'B';

    //Place the cones around the center
    //Generate random starting angle
    if (numPlayers == 2)
    {

    }



    return map;
}

function calcStraightLine (x1, y1, x2, y2)
{
    var coordinatesArray = new Array();

    // Define differences and error check
    var dx = Math.abs(x2 - x1);
    var dy = Math.abs(y2 - y1);
    var sx = (x1 < x2) ? 1 : -1;
    var sy = (y1 < y2) ? 1 : -1;
    var err = dx - dy;

    // Set first coordinates
    coordinatesArray.push(new Coordinates(y1, x1));

    // Main loop
    while (!((x1 == x2) && (y1 == y2)))
    {
        var e2 = err << 1;
        if (e2 > -dy) {
            err -= dy;
            x1 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y1 += sy;
        }
        // Set coordinates
        coordinatesArray.push(new Coordinates(y1, x1));
    }

    // Return the result
    return coordinatesArray;
}














console.log(initializeMap(2));
