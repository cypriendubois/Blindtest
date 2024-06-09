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

const handleSocketEventsAudioPlayer = (setAudioUrl, setIsPlaying) => {
  socket.on("song", function(song) {
    console.log('Received song: ' + song.song.preview);
    setAudioUrl(song.song.preview);
    setIsPlaying(true);
  });

  socket.on("resume", function() {
    console.log('Resuming game...');
    setIsPlaying(true);
  });
    
    socket.on("buzz", function(buzz){
    console.log('Pausing game...');
    setIsPlaying(false);
    });
}

const handleSocketEventsUserList = (setUsersList) => {
  socket.on("users", function(data) {
    var users = data.users;
    const outputList = [];
    for (var i = 0, l = users.length; i < l; i++) {
      if (users[i].hasJoined) {
        outputList.push(users[i].username + " (" + users[i].score + ")");
      } else {
        outputList.push(users[i].username + " (ready)");
      }
    }
    setUsersList(outputList);
  });
};

const handleSocketEventsBuzzer = (setBuzzingPlayer) => {
  socket.on("buzz", function(buzz){
    console.log('Pausing game...');
    setBuzzingPlayer(buzz.player);
  })
};

const handleSocketEventsAnswer = (setOverlayState, setPlayerForOverlay) => {
  socket.on("answer", function(username) {
    console.log({username}+' has won the round.');
    setOverlayState(true);
    setPlayerForOverlay(username.username);
  });

  // socket.on("winner", function(winner) {
  //   setOverlayState(true);
  //   setPlayerForOverlay(winner);
  // });
};


export { 
  handleSocketEventsPlaylistLoader, 
  handleSocketEventsInGame, 
  handleSocketEventsAudioPlayer,
  handleSocketEventsUserList,
  handleSocketEventsBuzzer,
  handleSocketEventsAnswer
};