import React, { useState, useEffect } from 'react';
import PreGameScreen from '../components/player/PreGameScreen';
import PlayersFooter from '../components/common/PlayersFooter';
import PlayerGameScreen from '../components/player/PlayerGameScreen';
import {handleSocketEventsInGame, handleSocketEventsUser} from '../services/socketEvents';

const PlayerPage = () => {

  const [gameStarted, setGameStarted] = useState(false);
  const [username, setUsername] = useState('');
  useEffect(() => {
    handleSocketEventsInGame(setGameStarted);
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