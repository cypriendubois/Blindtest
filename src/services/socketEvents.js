import socket from './socket';

const handleSocketEventsPlaylistLoader = (setPlaylistLoaded) => {
  socket.on('playlistLoaded', () => {
    console.log('Playlist loaded');
    setPlaylistLoaded(true);
  });
};

const handleSocketEventsInGame = (setGameStarted) => {
  socket.on('startGame', () => {
    console.log('Game starting');
    setGameStarted(true);
  });
};

const handleSocketEventsGameScreen = (setAudioUrl, setIsPlaying, setBuzzingPlayer) => {
  socket.on("song", function(song) {
    console.log('Received song: ' + song.song.preview);
    setAudioUrl(song.song.preview);
    setIsPlaying(true);
  });
    socket.on("song", function(song) {
    console.log('Received song: ' + song.song.preview);
    setAudioUrl(song.song.preview);
    setIsPlaying(true);
  });
  socket.on("buzz", function(buzz){
    console.log('Pausing game...');
    setIsPlaying(false);
    setBuzzingPlayer(buzz.player);
  })

  socket.on("resume", function() {
    console.log('Resuming game...');
    setIsPlaying(true);
  });
    
  // socket.on("users", function(data) {
  //   var users = data.users;
  //   var out = "";
  //   for (var i = 0, l = users.length; i < l; i++) {
  //     if (users[i].hasJoined) {
  //       out +=
  //         "<li>" + users[i].username + " (" + users[i].score + ")" + "</li>";
  //     } else {
  //       out += "<li>" + users[i].username + " (ready)" + "</li>";
  //     }
  //   }
  //   $("#header").show()
  //   $("#players").html(out);
  // });
  // socket.on("answer", function(username) {
  //   if (username && username.username) {
  //     App.showAnswer(username.username);
  //   } else {
  //     App.showAnswer();
  //   }
  // });
  // socket.on("winner", function(winner) {
  //   App.showWinner(winner);
  // });
}

export { handleSocketEventsPlaylistLoader, handleSocketEventsInGame , handleSocketEventsGameScreen};