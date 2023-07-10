const express = require("express");
const app = express();
const port = 3000;

// static content endpoints
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// socket interface

const { Server } = require("socket.io");

const io = new Server(3000, { /* options */ });

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