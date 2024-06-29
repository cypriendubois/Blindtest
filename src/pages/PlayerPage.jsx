import React, { useState, useEffect } from 'react';
import PreGameScreen from '../components/player/PreGameScreen';
import PlayersFooter from '../components/common/PlayersFooter';
import PlayerGameScreen from '../components/player/PlayerGameScreen';
import {handleSocketEventsGame, handleSocketEventsUser} from '../services/socketEvents';

const PlayerPage = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);
  const [username, setUsername] = useState('');
  const [_, placeholder] = useState(false);
  
  useEffect(() => {
    handleSocketEventsGame(setGameStarted, setGameFinished, placeholder);
    handleSocketEventsUser(setUsername);
    return () => {
    };
  }, []);
  return (
    <div>
      {gameStarted ? <PlayerGameScreen username={username} /> : <PreGameScreen />}
      <PlayersFooter/>
    </div>
  );
};

export default PlayerPage;