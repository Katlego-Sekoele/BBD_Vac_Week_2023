import Two from '../../node_modules/two.js/src/two.js';


  // Function to create the visual map using Two.js
export function createMap(data) {
  const two = new Two({
    width: data[0].length * 30, // Adjust the width based on the number of columns
    height: data.length * 30, // Adjust the height based on the number of rows
  }).appendTo(document.getElementById('draw-shapes'));

  // Loop through the rows of the 2D array
  for (let i = 0; i < data.length; i++) {
    const row = data[i];

    // Loop through the cells in the row
    for (let j = 0; j < row.length; j++) {
      const value = row[j];

      // Calculate the position of the shape
      const x = j * 20 + 10;
      const y = i * 20 + 10;
      const circle = null;
      const triangle = null;
      const square = null;
      // Create a shape based on the value in the 2D array
      if (value === 'W') { // 0 is a square (empty space)
        const square = two.makePolygon(x, y, 10, 4);
        square.fill = 'grey';
      } else if (value === '1' || value === '2' || value === '3' || value === '4') { // 1 is a cone
        const triangle = two.makePolygon(x, y, 10, 3);
        triangle.fill = 'orange';
      } else if (value === 'B') { // 2 is a circle (ball)
        const circle = two.makeCircle(x, y, 10);
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

