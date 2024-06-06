const Game = require("../server/lib/Game");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", function(_req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/about", function(_req, res) {
  res.sendFile(__dirname + "/public/about.html");
});

app.get("/spectate", function(_req, res) {
  res.redirect("/monitor/index.html");
});

Game.init(io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT
    
  }`);
  console.log(`Monitor: http://localhost:${PORT}/monitor`);
});
