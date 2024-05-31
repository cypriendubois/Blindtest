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
  playlistURL : null,
  song_id_list: [],
  currentSong: null,
  currentUser: null,
  songCounter:0,
  locked: false,

  init: function(io, playlistURL) {
    Game.io = io;
    console.log("Launching...");
    Game.playlistURL = playlistURL;

    Game.waitForUsers();
  },

  // Function to get the playlist ID from its URL, even if it is a sharing link
  getPlaylistIdFromURL: function(playlistURL, callback) {
    db.getPlaylistIdFromURL(playlistURL, function(playlistID) {
      callback(playlistID);
    });
  },

  // Function to initialize song_id_list using getIDsFromPlaylist
  initializeSongIdList: function(playlistID) {
    //console.log(playlistID);
    db.getIDsFromPlaylist(playlistID, function(ids) {
      if (ids.length <= 30) {
        Game.song_id_list = Game.shuffle(ids); // Shuffle the array if 30 elements or fewer
      } else {
        Game.song_id_list = Game.getRandomElements(ids, 30); // Get 30 random elements
      }
      Game.MAX_SONGS = Game.song_id_list.length; // Assign the length of song_id_list to MAX_SONGS
      console.log("Song ID list initialized:", Game.song_id_list);
      console.log("MAX_SONGS set to:", Game.MAX_SONGS);
      return;
    });
  },

  // Function to shuffle an array
  shuffle: function(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // Function to get N random elements from an array
  getRandomElements: function(array, n) {
    let result = [];
    let clonedArray = [...array];
    for (let i = 0; i < n; i++) {
      const randomIndex = Math.floor(Math.random() * clonedArray.length);
      result.push(clonedArray[randomIndex]);
      clonedArray.splice(randomIndex, 1); // Remove the element to avoid duplicates
    }
    return Game.shuffle(result); // Shuffle the result array before returning
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
        // Call the function to initialize song_id_listj
        Game.getPlaylistIdFromURL(Game.playlistURL, function (playlistID) {
          if (playlistID) {
            console.log("Playlist being added:", playlistID);
            Game.initializeSongIdList(playlistID);
            Game.nextSongFromIdList();
                       
          } else {
            console.error("Failed to get playlist ID from URL:", playlistURL);
          }
        });
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

  nextSongFromIdList: function() {
    if (Game.songCounter == Game.MAX_SONGS) {
      setTimeout(() => {
        Game.newRound();
      }, 10000);
    }
    db.getTrackFromID(Game.song_id_list[0], function(data) {
      song = data;
      Game.currentSong = song;
      Game.currentSongErrors = 0;
      Game.songCounter ++;
      Game.song_id_list.shift();
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
        Game.nextSongFromIdList();
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
          Game.nextSongFromIdList();
        }, 10000);
      }
    }
    this.currentUser = null;
    this.unlock();
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
  },
  
  lock: function(){
    this.locked = true;
  },
  
  unlock: function(){
    this.locked = false;
  }

};

module.exports = Game;
