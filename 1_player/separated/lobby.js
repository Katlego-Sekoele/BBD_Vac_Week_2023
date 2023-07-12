const SERVER_URL = "http://localhost:3000";
let socket = io.connect(SERVER_URL);

socket.on("startQuiz", (res) => {
    connectToGame(res)
})

function connectToGame()
{
    window.location.assign("quiz.html");
}

/*document.addEventListener("DOMContentLoaded", function() {
    var queuedPlayers = [
        "Player A",
        "Player B",
        "Player C",
        "Player D"
    ];
      var queuedPlayerListElement = document.getElementById("player-list");
      
        // Function to populate the list with players
        function populatePlayerList() {
            queuedPlayers.forEach(function(player) {
                var listItem = document.createElement("li");
                listItem.textContent = player;
                queuedPlayerListElement.appendChild(listItem);
            });
        }
        // Call the function to populate the list
        populatePlayerList();
});*/