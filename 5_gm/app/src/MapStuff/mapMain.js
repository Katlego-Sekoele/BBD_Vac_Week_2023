import Two from '../../node_modules/two.js/src/two.js';

// // Make an instance of two and place it on the page.
// var params = {
//     fullscreen: true
//   };
//   var elem = document.body;
//   var two = new Two(params).appendTo(elem);
  
//   // Two.js has convenient methods to make shapes and insert them into the scene.
//   var radius = 50;
//   var x = two.width * 0.5;
//   var y = two.height * 0.5 - radius * 1.25;
//   var circle = two.makeCircle(x, y, radius);
  
//   y = two.height * 0.5 + radius * 1.25;
//   var width = 100;
//   var height = 100;
//   var rect = two.makeRectangle(x, y, width, height);
  
//   // The object returned has many stylable properties:
//   circle.fill = '#FF8000';
//   // And accepts all valid CSS color:
//   circle.stroke = 'orangered';
//   circle.linewidth = 5;
  
//   rect.fill = 'rgb(0, 200, 255)';
//   rect.opacity = 0.75;
//   rect.noStroke();
  
//   // Don’t forget to tell two to draw everything to the screen
//   two.update();
const mapData = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

  // Function to create the visual map using Two.js
function createMap(data) {
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
      if (value === 0) { // 0 is a square (empty space)
        const circle = two.makePolygon(x, y, 10, 4);
        circle.fill = 'grey';
      } else if (value === 1) { // 1 is a cone
        const triangle = two.makePolygon(x, y, 10, 3);
        triangle.fill = 'orange';
      } else if (value === 2) { // 2 is a circle (ball)
        const triangle = two.makeCircle(x, y, 10);
        triangle.fill = 'red';
      }

      // Add the shape to the Two.js scene
      two.add(circle || triangle);
    }
  }

  // Render the scene
  two.update();
}

// Call the createMap function with the mapData array
createMap(mapData);
