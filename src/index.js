const path = require("path");
const http = require("http");
const express = require("express");
const Filter = require("bad-words");
const { Server } = require("socket.io");
const { generateMessage, generateLocation } = require("./utils/messages");
const {
  addUser,
  getUser,
  getUsersInRoom,
  removeUser,
} = require("./utils/users");
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
  // console.log("welcome user");

  //send message
  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback("profanity is not allowed!");
    }
    io.to(user.room).emit("message", generateMessage(user.username, message));
    callback();
  });
  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        generateMessage("sys", `${user.username} has left`)
      );
      io.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });
    }
  });

  //listen for sendLocation
  socket.on("sendLocation", (location, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit(
      "locationMessage",
      generateLocation(
        user.username,
        `https://google.com/maps?q=${location.latitude},${location.longitude}`
      )
    );
    callback("Location shared");
  });
  socket.on("join", ({ userName, roomName }, callback) => {
    const { user, error } = addUser({
      id: socket.id,
      username: userName,
      room: roomName,
    });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.emit(
      "message",
      generateMessage("Admin", `welcome ${user.username} !`)
    );
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        generateMessage("Admin", `${user.username} has joined !`)
      );
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
    callback();
  });
});

server.listen(port, () => {
  console.log("server started");
});
