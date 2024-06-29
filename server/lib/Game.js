const User = require("./User");
const songUtils = require("./Songs");

const Game = {
  io: null,
  MAX_USERS: 16,
  MAX_SONGS: 30,
  POINT_RIGHT_ANSWER: 10,
  POINT_PENALTY: 2,
  users: [],
  song_id_list: [],
  currentSong: null,
  currentUser: null,
  buzzerList: [],
  songCounter: 0,
  locked: false,

  // Initialize the game with the socket.io instance
  init(io) {
    Game.io = io;
    console.log("Launching...");
    Game.waitForUsers();
  },
  
  resetGame(){
    Game.songCounter = 0;
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
    console.log("New round!");
    for (let i = 0; i < Game.users.length; i++) {
      Game.users[i].resetScore();
      Game.users[i].join();
    }
    Game.io.sockets.in("game").emit("startGame");
    Game.nextSongFromIdList();
  },

  // Move to the next song in the list
  nextSongFromIdList() {
    if (Game.songCounter === Game.MAX_SONGS) {
      Game.showGameRecap();
      return;
    }
    Game.buzzerList = [],
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
      Game.io.sockets.in("game").emit("song", { 
        song:song,
        songNumber: this.songCounter,
        maxSongs: this.MAX_SONGS
      });
    });
  },

  // Handle manual check start
  addSelfToCheckList(user) {
    console.log(`User ${user.getName()} buzzed.`);
    Game.buzzerList.push(user);
  },
  
  manualCheckStart() {
    if (this.locked) return;
    this.lock();
    this.currentUser = Game.buzzerList.pop();
    console.log(`Handling user ${this.currentUser.getName()}`);
    Game.io.sockets.in("game").emit("buzz", { player: this.currentUser.getName(), song: Game.currentSong.title });
  },

  // Resolve the buzzer decision
  manualCheckResolve(buzzerDecision) {
    console.log(`Buzzer decision : ${buzzerDecision}`);
    if (buzzerDecision === 1) {
      console.log(`${this.currentUser.getName()} is right!`);
      this.currentUser.increase_score(Game.POINT_RIGHT_ANSWER);
      console.log(`${this.currentUser.getName()} increases their tally by ${Game.POINT_RIGHT_ANSWER}`);
      this.currentUser.isRight();
    } else {
      console.log(`${this.currentUser.getName()} is wrong!`);
      this.currentUser.decrease_score(Game.POINT_PENALTY);
      console.log(`${this.currentUser.getName()} decreases their tally by ${Game.POINT_PENALTY}`);
      Game.currentSongErrors++;
      if (this.buzzerList.length>0) {
        this.unlock();
        this.manualCheckStart();
        return;
      } else {
        Game.io.sockets.in("game").emit("resume");
      }
      this.currentUser.isWrong();
      if (Game.currentSongErrors >= Game.users.length - 1) {
        console.log("All users are wrong");
        Game.io.sockets.in("game").emit("answerWrong");
      }
    }
    this.currentUser = null;
    this.unlock();
  },

  // Update the list of players and emit the update
  updatePlayers() {
    const users = Game.users.filter(item=>item.getName() != "").map(item => {
        return { username: item.getName(), score: item.getScore(), hasJoined: item.hasJoined};
      });
    Game.io.sockets.in("game").emit("users", {users});
  },
  
  showGameRecap() {
    console.log("=================================================");
    console.log("Game Over!");
    Game.users.sort((a, b) => {
      return a.score - b.score;
    });
    const users = Game.users.filter(item=>item.getName() != "").map(item => {
        return { username: item.getName(), score: item.getScore()};
      });
    Game.io.sockets.in("game").emit("showResults", {users});
    return
  },

  lock() {
    this.locked = true;
  },
  
  unlock() {
    this.locked = false;
  },
};

module.exports = Game;
