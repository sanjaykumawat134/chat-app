const path = require("path");
const http = require("http");
const express = require("express");
const Filter = require("bad-words");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = new Server(server); //configure express with socketio

const port = process.env.PORT || 3000;
const publicDirpath = path.join(__dirname, "../public");
app.use(express.static(publicDirpath));
// var count = 0;
// io.on(
//     'connection', (socket) => {
//         console.log("new WebSocket connection");
//         // socket.emit('countUpdated', count);
//         // socket.on('increment', () => {
//         //     count++;
//         //     // socket.emit('countUpdated',count)
//         //     // console.log('Hey i am listining for changes')
//         //     io.emit('countUpdated',count)
//         // })
//     }
// )

io.on("connection", (socket) => {
  console.log("welcome user");
  socket.emit("message", "welcome user");
  socket.broadcast.emit("message", "A new user has joined!");
  //send message
  socket.on("sendMessage", (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("profanity is not allowed!");
    }
    io.emit("message", message);
    callback();
  });
  socket.on("disconnect", () => {
    io.emit("message", "A user has left");
  });

  //listen for sendLocation
  socket.on("sendLocation", (location, callback) => {
    io.emit(
      "message",
      `https://google.com/maps?q=${location.latitude},${location.longitude}`
    );
    callback("Location shared");
  });
});

server.listen(port, () => {
  console.log("server started");
});
