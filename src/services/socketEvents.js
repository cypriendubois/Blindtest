import socket from './socket';

const handleSocketEventsPlaylistLoader = (setPlaylistLoaded) => {
  socket.on('playlistLoaded', () => {
    console.log('Playlist loaded');
    setPlaylistLoaded(true);
  });
};

const handleSocketEventsGame = (setGameStarted, setGameFinished, setUsers) => {
  socket.on('startGame', () => {
    console.log('Game starting');
    setGameStarted(true);
  });
  socket.on('showResults', (data) => {
    console.log('Game ended');
    setGameFinished(true);
    setUsers(data.users);
  });
};

const handleSocketSongCounter = (setSongNumber, setMaxSong) => {
  socket.on('song', function(data) {
    setSongNumber(data.songNumber);
    setMaxSong(data.maxSongs);
  });
};

const handleSocketEventsAudioPlayer = (setAudioUrl, setIsPlaying) => {
  socket.on("song", function(data) {
    console.log('Received song: ' + data.song.preview);
    setAudioUrl(data.song.preview);
    setIsPlaying(true);
  });

  socket.on("resume", function() {
    console.log('Resuming game...');
    setIsPlaying(true);
  });
    
    socket.on("buzz", function(buzz){
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
  });
  socket.on("resume", function(){
    setBuzzingPlayer(null);
  });
};

const handleSocketEventsAnswer = (setOverlayState, setOverlayText, setPlayedSeconds) => {
  socket.on("answerRight", function(data) {
    let usernameStr = String(data.username);
    setOverlayText(usernameStr.concat(' guessed correctly!'));
    setPlayedSeconds(0);
    setOverlayState(true);
  });
  socket.on("answerWrong", function() {
    console.log('No one guessed.');
    setPlayedSeconds(0);
    setOverlayState(true);
    setOverlayText('No one guessed.');
  });

  // socket.on("winner", function(winner) {
  //   setOverlayState(true);
  //   setPlayerForOverlay(winner);
  // });
};

const handleSocketEventsUser = (setUsername) =>{
  socket.on("loginSuccess", function(data){
    console.log(data.username + " was logged in the game.")
    setUsername(data.username);
  });
};

const handleSocketEventsBuzzerStatus = (setBuzzer) =>{
  socket.on("answerRight", function(){
    setBuzzer(true);
  });
  socket.on("enableBuzzers", function(){
    console.log('Received enable buzzer message')
    setBuzzer(false);
  });
};


export { 
  handleSocketEventsPlaylistLoader, 
  handleSocketEventsGame, 
  handleSocketSongCounter,
  handleSocketEventsAudioPlayer,
  handleSocketEventsUserList,
  handleSocketEventsBuzzer,
  handleSocketEventsAnswer,
  handleSocketEventsUser,
  handleSocketEventsBuzzerStatus
};