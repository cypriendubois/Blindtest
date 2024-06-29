import React, { useState, useEffect } from 'react';
import PlaylistLoader from '../components/monitor/PlaylistLoader';
import GameScreen from '../components/monitor/GameScreen';
import ResultScreen from '../components/monitor/ResultScreen';
import socket from '../services/socket';
import {handleSocketEventsGame} from '../services/socketEvents';


const MonitorPage = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [users, setUsers] = useState([])
  useEffect(() => {
    handleSocketEventsGame(setGameStarted, setGameFinished, setUsers);
    return () => {
      socket.off('startGame');
      socket.off('showResults');
      setGameStarted(false);
    };
  }, []);

  return (
    <>
      {
        gameFinished ? <ResultScreen users={users}/>: (
          gameStarted ? <GameScreen /> : <PlaylistLoader />
        )

      }
    </>
  );
};

export default MonitorPage;
