import socket from './socket';

const handleSocketEvents = (setPlaylistLoaded) => {
  socket.on('playlistLoaded', () => {
    console.log('Playlist loaded');
    setPlaylistLoaded(true);
  });

  socket.on('startGame', () => {
    console.log('Game starting');
    setGameStarted(true);
  });

  socket.on('connect', () => {
    console.log('Connected to server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
};

export default handleSocketEvents;
