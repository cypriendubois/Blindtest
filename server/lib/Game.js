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
    this.io = io;
    console.log("Launching...");
    this.waitForUsers();
  },
  
  resetGame(){
    this.songCounter = 0;
    return;
  },

  // Wait for users to connect
  waitForUsers() {
    console.log("Waiting for players");
    this.io.sockets.on("connection", (socket) => {
      const user = new User(Game, socket);
      this.addUser(user);
    });
  },

  // Add a new user to the game
  addUser(user) {
    this.users.push(user);
    if (this.users.length >= this.MAX_USERS) {
      user.refuse();
      return;
    }
    console.log(`addUser: ${this.users.length} users`);
  },

  // Remove a user from the game
  removeUser(user) {
    const idx = this.users.indexOf(user);
    this.users.splice(idx, 1);
    console.log(`removeUser: ${this.users.length} users`);
    this.updatePlayers();
  },
  
  // Load a playlist from a URL and emit a playlistLoaded event when done
  async loadPlaylist(playlistUrl) {
    try {
      console.log(playlistUrl);
      const ids = await songUtils.getPlaylistFromURL(playlistUrl, this.MAX_SONGS);
      if (ids && ids.length > 0) {
        this.song_id_list = ids;
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
    for (let i = 0; i < this.users.length; i++) this.users[i].join();
    this.io.sockets.in("game").emit("startGame");
    this.nextSongFromIdList();
  },

  // Move to the next song in the list
  nextSongFromIdList() {
    if (this.songCounter === this.MAX_SONGS) {
      this.showGameRecap();
      return;
    }
    this.buzzerList = [],
    songUtils.getTrackFromID(this.song_id_list[0], (data) => {
      const song = data;
      this.currentSong = song;
      this.currentSongErrors = 0;
      this.songCounter++;
      this.song_id_list.shift();
      console.log(`Now playing : ${song.artist.name} - ${song.title}`);
      for (let i = 0; i < this.users.length; i++) {
        this.users[i].unlock();
      }
      this.io.sockets.in("game").emit("song", { 
        song:song,
        songNumber: this.songCounter,
        maxSongs: this.MAX_SONGS
      });
    });
  },

  // Handle manual check start
  addSelfToCheckList(user) {
    console.log(`User ${user.getName()} buzzed.`);
    this.buzzerList.push(user);
  },
  
  manualCheckStart() {
    if (this.locked) return;
    this.lock();
    this.currentUser = this.buzzerList.pop();
    console.log(`Handling user ${this.currentUser.getName()}`);
    this.io.sockets.in("game").emit("buzz", { player: this.currentUser.getName(), song: this.currentSong.title });
  },

  // Resolve the buzzer decision
  manualCheckResolve(buzzerDecision) {
    console.log(`Buzzer decision : ${buzzerDecision}`);
    if (buzzerDecision === 1) {
      console.log(`${this.currentUser.getName()} is right!`);
      this.currentUser.increase_score(this.POINT_RIGHT_ANSWER);
      console.log(`${this.currentUser.getName()} increases their tally by ${this.POINT_RIGHT_ANSWER}`);
      this.currentUser.isRight();
    } else {
      console.log(`${this.currentUser.getName()} is wrong!`);
      this.currentUser.decrease_score(this.POINT_PENALTY);
      console.log(`${this.currentUser.getName()} decreases their tally by ${this.POINT_PENALTY}`);
      this.currentSongErrors++;
      if (this.buzzerList.length>0) {
        this.unlock();
        this.manualCheckStart();
        return;
      } else {
        this.io.sockets.in("game").emit("resume");
      }
      this.currentUser.isWrong();
      if (this.currentSongErrors >= this.users.length - 1) {
        console.log("All users are wrong");
        this.io.sockets.in("game").emit("answerWrong");
      }
    }
    this.currentUser = null;
    this.unlock();
  },

  // Update the list of players and emit the update
  updatePlayers() {
    const users = this.users.filter(item=>item.getName() != "").map(item => {
        return { username: item.getName(), score: item.getScore(), hasJoined: item.hasJoined};
      });
    this.io.sockets.in("game").emit("users", {users});
  },
  
  showGameRecap() {
    console.log("=================================================");
    console.log("Game Over!");
    this.users.sort((a, b) => {
      return a.score - b.score;
    });
    const users = this.users.filter(item=>item.getName() != "").map(item => {
        return { username: item.getName(), score: item.getScore()};
      });
    this.io.sockets.in("game").emit("showResults", {users});
    for (let i = 0; i < this.users.length; i++) this.users[i].resetScore();
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
