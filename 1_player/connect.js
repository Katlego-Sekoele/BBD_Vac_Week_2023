import "./socket.io/client-dist/socket.io.js";

const SERVER_URL = 'http://localhost:3001'
let socket // manager connects to socket server

document.getElementById('connectBtn').onclick = function (){
    // establish connection to socket server
    socket = io.connect(SERVER_URL);
}

socket.on("connect", () => {
    // connect event
    const engine = socket.io.engine;

    engine.on("packet", ({ type, data }) => {
        // called for each packet received
    });

    engine.on("packetCreate", ({ type, data }) => {
        // called for each packet sent
    });

});

// disconnect event
socket.on("disconnect", () => {

});

socket.on("generic_event", (data) => {
//     TODO: decide on events with server team
});

// send payload to server and invoke another_generic_event on server side
// socket.emit("another_generic_event", payload)