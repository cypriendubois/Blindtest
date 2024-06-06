const Game = require("./lib/Game");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

const PORT = process.env.PORT || 8080;

app.use(express.static("frontend/public"));
app.get("/", function(req, res) {
  res.redirect("/player/index.html");
});
app.get("/spectate", function(req, res) {
  res.redirect("/monitor/index.html");
});

Game.init(io, 'https://www.deezer.com/fr/playlist/3110419842');
server.listen(PORT);
console.log(`Monitor: http://localhost:${PORT}/monitor`);
