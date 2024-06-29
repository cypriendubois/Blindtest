const sanitizer = require("sanitizer");

function User(game, socket) {
  this.game = game;
  this.socket = socket;
  this.username = "";
  this.score = 0;
  this.locked = true;
  this.hasJoined = false;
  this.bindEvents();
}

// Bind socket events to the user
User.prototype.bindEvents = function() {
  const self = this;

  // Handle user login
  this.socket.on("login", function(data) {
    if (!data.username) return;
    const username = sanitizer.escape(data.username);
    self.username = username;
    self.socket.emit("loginSuccess", {username:username});
    self.socket.join("players");
    self.game.updatePlayers();
    console.log(">>> " + username);
  });

  // Handle user disconnection
  this.socket.on("disconnect", function() {
    self.game.removeUser(self);
  });

  // Monitor events
  this.socket.on("spectate", function() {
    self.socket.join("game");
    console.log('Monitor is live');
    self.game.updatePlayers();
    self.game.resetGame();
  });

  this.socket.on("loadPlaylist", async (data) => {
    console.log(data);
    await self.game.loadPlaylist(data.playlistUrl);
    self.socket.emit("playlistLoaded");
  });

  this.socket.on("start", function() {
    self.game.newRound();
  });

  this.socket.on("next", function() {
    console.log("Requesting next song --");
    self.game.io.sockets.in("game").emit("enableBuzzers");
    self.game.nextSongFromIdList();
  });

  this.socket.on("buzzerDecision", function(data) {
    console.log("Giving or removing points");
    const buzzerDecision = parseInt(data.buzzerDecision, 10);
    console.log(buzzerDecision);
    self.game.manualCheckResolve(buzzerDecision);
  });

  this.socket.on("answerTimeout", function() {
      self.game.manualCheckResolve(0);
  });

  // Handle button press by a player
  this.socket.on("buzz", function(data) {
    if (self.locked) return;
    self.lock();
    self.game.io.sockets.in("game").emit("startTimer", { username: data.username });
    self.game.addSelfToCheckList(self);
    if (self.game.buzzerList.length == 1){
      self.game.manualCheckStart(self);
    }
  });

};

// Allow the user to join the game
User.prototype.join = function() {
  if (this.username !== "") {
    this.hasJoined = true;
    this.socket.join("game");
    this.game.updatePlayers();
    console.log("+++ " + this.username);
  }
};

// Notify the user if they are refused entry to the game
User.prototype.refuse = function() {
  this.socket.emit("refused");
};

// Lock and unlock user actions
User.prototype.lock = function() {
  this.locked = true;
};

User.prototype.unlock = function() {
  this.locked = false;
};

// Notify the user if their answer is wrong
User.prototype.isWrong = function() {
  this.socket.emit("answer");
};

// Notify the user and others if their answer is right
User.prototype.isRight = function() {
  this.socket.in("game").emit("answerRight", { username: this.username });
};

// Notify the user and others if they are the winner
User.prototype.isWinner = function() {
  this.socket.emit("winner", this.username);
  this.socket.broadcast.emit("winner", this.username);
  this.game.updatePlayers();
};

// Get the user's name
User.prototype.getName = function() {
  return this.username;
};

// Get the user's score
User.prototype.getScore = function() {
  return this.score;
};

// Reset the user's score
User.prototype.resetScore = function() {
  this.score = 0;
};

// Increase the user's score and notify them
User.prototype.increase_score = function(points) {
  this.score += points;
  this.game.updatePlayers();
};

// Decrease the user's score and notify them
User.prototype.decrease_score = function(points) {
  this.score -= points;
  this.game.updatePlayers();
};

module.exports = User;
