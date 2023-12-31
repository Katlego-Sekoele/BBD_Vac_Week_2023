import Two from '../../node_modules/two.js/src/two.js';


  // Function to create the visual map using Two.js
export function createMap(data) {

    const containerWidth = document.getElementById("pixel_map_container").offsetWidth;
    const containerHeight = document.getElementById("pixel_map_container").offsetHeight;
    const cellWidth = containerWidth / data[0].length;
    const cellHeight = containerHeight / data.length;
  const two = new Two({
    //width: data[0].length * 5, // Adjust the width based on the number of columns
    //height: data.length * 5, // Adjust the height based on the number of rows
    width: containerWidth*2,
    height: containerHeight
  }).appendTo(document.getElementById('pixel_map_container'));

  // Loop through the rows of the 2D array
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    // Loop through the cells in the row
    for (let j = 0; j < row.length; j++) {
      const value = row[j];

      // Calculate the position of the shape
      // const x = j * 5 + 2;
      // const y = i * 5 + 2;

      const x = j * cellWidth + cellWidth / 2;
      const y = i * cellHeight + cellHeight / 2;

      // const x = j * cellSize + cellSize;
      // const y = i * cellSize + cellSize;
      const circle = null;
      const triangle = null;
      const square = null;
      // Create a shape based on the value in the 2D array
      if (value === '1' || value === '2' || value === '3' || value === '4'|| value === '5' || value === '6' || value === '7' || value === '8') { // 1 is a cone
        const triangle = two.makePolygon(x, y, 20, 3);
        triangle.fill = 'orange';
      } else if (value === 'B') { // 2 is a circle (ball)
        const circle = two.makeCircle(x, y, 20);
        circle.fill = 'red';
      }

      // Add the shape to the Two.js scene
      two.add(circle || triangle || square);
    }
  }

  // Render the scene
  two.update();
}

// Call the createMap function with the mapData array
//createMap(mapData);

