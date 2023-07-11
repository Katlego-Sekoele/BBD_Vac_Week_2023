const { Server } = require("socket.io");
const io = new Server(3000, { /* options */ });
const express = require("express");
const app = express();
const port = 3000;

// static content endpoints
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

console.log("here")

io.on("connection", (socket) => {
  console.log("connected to socket", socket.id)
  socket.emit("connected", `You have successfully connected. ID: ${socket.id}`)

  socket.conn.on("packet", ({ type, data }) => {
    // called for each packet received
    console.log(`${socket.id}, ${type}: ${data}`)
    socket.emit("server_response", `Received: ${socket.id}, ${type}: ${data}`)
  });


  socket.conn.on("packetCreate", ({ type, data }) => {
    // called for each packet sent
  });

  socket.on("disconnect", (reason) => {
    console.log(`socket ${socket.id} has disconnected. Reason: ${reason}`)
  });
});


// Controller, Quiz, Duel connections ---------------------------------
BallCamController = require('./controller/main.controller')
BallCamController.mainMoveLeft(1000)

DuelEngine = require('./duel/duelEngine')
DuelEngine.initMap()

QuizEngine = require('./quiz/quizEngine')
QuizEngine.generateQuestions()