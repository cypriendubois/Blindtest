var User = require("./User");
var db = require("./Songs");

var Game = {
  io: null,
  MAX_USERS: 16,
  MAX_SONGS: 30,
  POINT_RIGHT_ANSWER: 10,
  POINT_PENALTY: 2,
  users: [],
  round: null,
  currentSong: null,
  currentUser: null,
  songCounter:0,

  init: function(io) {
    Game.io = io;
    console.log("Launching...");
    Game.waitForUsers();
  },

  waitForUsers: function() {
    console.log("Waiting for players");
    Game.io.sockets.on("connection", function(socket) {
      var user = new User(Game, socket);
      Game.addUser(user);
    });
  },

  addUser: function(user) {
    Game.users.push(user);
    if (Game.users.length >= Game.MAX_USERS) {
      user.refuse();
      return;
    }
    console.log(`addUser: ${Game.users.length} users`);
  },

  removeUser: function(user) {
    var idx = Game.users.indexOf(user);
    Game.users.splice(idx, 1);
    console.log(`removeUser: ${Game.users.length} users`);
    Game.updatePlayers();
  },

  newRound: function() {
    console.log("=================================================");
    console.log("New round!");
    //check that round is finished

    for (var i = 0, l = Game.users.length; i < l; i++) {
      //Reset scores
      Game.users[i].resetScore();
      //Pending users can play now
      Game.users[i].join();
    }
    Game.nextSong();
  },

  nextSong: function() {
    if (Game.songCounter == Game.MAX_SONGS) {
      setTimeout(() => {
        Game.newRound();
      }, 10000);
    }
    db.getRandomSong(function(data) {
      song = data;
      Game.currentSong = song;
      Game.currentSongErrors = 0;
      Game.songCounter ++;
      console.log("Now playing : " + song.artist.name + " - " + song.title);

      for (var i = 0, l = Game.users.length; i < l; i++) {
        Game.users[i].unlock();
      }

      Game.io.sockets.in("game").emit("song", { song: song });
    });
  },

  manualCheckStart: function(user, button) {
    this.currentUser = user;
    console.log(button);
    if (button == -1){
      console.log('User ' + user.getName() + ' buzzed.');
      Game.io.sockets.in('game').emit('buzz', { player: user.getName(), song: Game.currentSong.title});
    }
  },
  manualCheckResolve: function(buzzerDecision) {
    console.log("Buzzer decision : " + buzzerDecision)
    if (buzzerDecision == 1) {
      console.log(this.currentUser.getName() + " is right!");
      this.currentUser.increase_score(Game.POINT_RIGHT_ANSWER);
      console.log(this.currentUser.getName() + ' increases their tally by ' + Game.POINT_RIGHT_ANSWER);
      this.currentUser.isRight();
      setTimeout(() => {
        Game.nextSong();
      }, 5000);
    } else {
      this.currentUser.isWrong();
      console.log(this.currentUser.getName() + " is wrong!");
      this.currentUser.decrease_score(Game.POINT_PENALTY);
      console.log(this.currentUser.getName() + ' decreases their tally by ' + Game.POINT_PENALTY);
      Game.io.sockets.in("game").emit("resume");
      Game.currentSongErrors++;
      if (Game.currentSongErrors >= Game.users.length - 1) {
        console.log("All users are wrong");
        Game.io.sockets.in("game").emit("answer");
        setTimeout(() => {
          Game.nextSong();
        }, 10000);
      }
    }
    this.currentUser = null;
  },

  updatePlayers: function() {
    var users = [];
    for (var i = 0, l = Game.users.length; i < l; i++) {
      if ("" === Game.users[i].getName()) {
        continue;
      }
      users.push({
        username: Game.users[i].getName(),
        score: Game.users[i].getScore(),
        hasJoined: Game.users[i].hasJoined
      });
    }
    Game.io.sockets.in("game").emit("users", { users: users });
  }
};

module.exports = Game;
