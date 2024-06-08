const User = require("./User");
const songUtils = require("./Songs");

const Game = {
  io: null,
  MAX_USERS: 16,
  MAX_SONGS: 30,
  POINT_RIGHT_ANSWER: 10,
  POINT_PENALTY: 2,
  users: [],
  round: null,
  song_id_list: [],
  currentSong: null,
  currentUser: null,
  songCounter: 0,
  locked: false,

  // Initialize the game with the socket.io instance
  init(io) {
    Game.io = io;
    console.log("Launching...");
    Game.waitForUsers();
  },

  // Wait for users to connect
  waitForUsers() {
    console.log("Waiting for players");
    Game.io.sockets.on("connection", (socket) => {
      const user = new User(Game, socket);
      Game.addUser(user);
    });
  },

  // Add a new user to the game
  addUser(user) {
    Game.users.push(user);
    if (Game.users.length >= Game.MAX_USERS) {
      user.refuse();
      return;
    }
    console.log(`addUser: ${Game.users.length} users`);
  },

  // Remove a user from the game
  removeUser(user) {
    const idx = Game.users.indexOf(user);
    Game.users.splice(idx, 1);
    console.log(`removeUser: ${Game.users.length} users`);
    Game.updatePlayers();
  },
  
  // Load a playlist from a URL and emit a playlistLoaded event when done
  async loadPlaylist(playlistUrl) {
    try {
      console.log(playlistUrl);
      const ids = await songUtils.getPlaylistFromURL(playlistUrl, Game.MAX_SONGS);
      if (ids && ids.length > 0) {
        Game.song_id_list = ids;
        return
      } else {
        console.error("Failed to get playlist from URL:", playlistUrl);
      }
    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  },

  // Start a new round of the game
  newRound() {
    console.log("=================================================");
    console.log("New round!");
    Game.io.sockets.in("game").emit("startGame");
    for (let i = 0; i < Game.users.length; i++) {
      Game.users[i].resetScore();
      Game.users[i].join();
    }
    Game.nextSongFromIdList();
  },

  // Move to the next song in the list
  nextSongFromIdList() {
    if (Game.songCounter === Game.MAX_SONGS) {
      setTimeout(() => {
        Game.newRound();
      }, 10000);
      return;
    }
    songUtils.getTrackFromID(Game.song_id_list[0], (data) => {
      const song = data;
      Game.currentSong = song;
      Game.currentSongErrors = 0;
      Game.songCounter++;
      Game.song_id_list.shift();
      console.log(`Now playing : ${song.artist.name} - ${song.title}`);
      for (let i = 0; i < Game.users.length; i++) {
        Game.users[i].unlock();
      }
      Game.io.sockets.in("game").emit("song", { song });
    });
  },

  // Handle manual check start
  manualCheckStart(user, button) {
    this.currentUser = user;
    console.log(button);
    if (button === -1) {
      console.log(`User ${user.getName()} buzzed.`);
      Game.io.sockets.in("game").emit("buzz", { player: user.getName(), song: Game.currentSong.title });
    }
  },

  // Resolve the buzzer decision
  manualCheckResolve(buzzerDecision) {
    console.log(`Buzzer decision : ${buzzerDecision}`);
    if (buzzerDecision === 1) {
      console.log(`${this.currentUser.getName()} is right!`);
      this.currentUser.increase_score(Game.POINT_RIGHT_ANSWER);
      console.log(`${this.currentUser.getName()} increases their tally by ${Game.POINT_RIGHT_ANSWER}`);
      this.currentUser.isRight();
      setTimeout(() => {
        Game.nextSongFromIdList();
      }, 5000);
    } else {
      this.currentUser.isWrong();
      console.log(`${this.currentUser.getName()} is wrong!`);
      this.currentUser.decrease_score(Game.POINT_PENALTY);
      console.log(`${this.currentUser.getName()} decreases their tally by ${Game.POINT_PENALTY}`);
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

  // Update the list of players and emit the update
  updatePlayers() {
    const users = [];
    for (let i = 0; i < Game.users.length; i++) {
      if (Game.users[i].getName() === "") {
        continue;
      }
      users.push({
        username: Game.users[i].getName(),
        score: Game.users[i].getScore(),
        hasJoined: Game.users[i].hasJoined,
      });
    }
    Game.io.sockets.in("game").emit("users", { users });
  },
  
  lock() {
    this.locked = true;
  },
  
  unlock() {
    this.locked = false;
  },
};

module.exports = Game;
