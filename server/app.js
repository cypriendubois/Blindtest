const Game = require("./lib/Game");
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "../public")));

// Catch-all route to serve the React app's index.html
app.get("*", (req, res) => {
  console.log("Serving index.html for", req.url);
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

Game.init(io);

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Monitor: http://localhost:${PORT}/monitor`);
});
