const express = require("express");
const http = require("http"); // usamos http porque es necesario para el socket.io
const socketIo = require("socket.io");
const User = require("../models/User");
const Message = require("../models/Message");

const app = express();

const mongoose = require("mongoose");

const PORT = 3100;
const MONGODB_CONNECTION = "mongodb://localhost/chat";

mongoose
  .connect(MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Base de datos lista");

    app.use(express.json());
  });

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const server = http.createServer(app);

const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("new-message", async (message) => {
    console.log(message);

    const socketId = socket.id;
    const { username } = await User.findOne({ socketId });

    io.emit("new-message-ok", { username, message });
  });

  socket.on("set-username", async (username) => {
    console.log(username);
    const user = await User.findOneAndUpdate(
      {
        username,
      },
      { username, socketId: socket.id },
      { upsert: true, new: true }
    );
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});

server.listen(3100, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
