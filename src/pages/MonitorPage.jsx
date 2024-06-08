import React, { useState, useEffect } from 'react';
import PlaylistLoader from '../components/monitor/PlaylistLoader';
import GameScreen from '../components/monitor/GameScreen';
import socket from '../services/socket';
import handleSocketEvents from '../services/socketEvents';

const MonitorPage = () => {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    handleSocketEvents(setGameStarted);

    return () => {
      socket.off('startGame')
    };
  }, []);

  return (
    <>
      {gameStarted ? <GameScreen /> : <PlaylistLoader />}
    </>
  );
};

export default MonitorPage;
