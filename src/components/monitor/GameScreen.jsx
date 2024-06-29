import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import logo from '../../assets/pedro.gif';
import AudioPlayer from './gamescreen/AudioPlayer';
import BuzzerHandler from './gamescreen/BuzzerHandler'
import PlayersFooter from '../common/PlayersFooter';
import AnswerFeedback from './gamescreen/AnswerFeedback';
import { handleSocketSongCounter } from '../../services/socketEvents';

const GameScreen = () => {
  const [songNumber, setSongNumber] = useState(0);
  const [maxSongs, setMaxSong] = useState(0);
   

  useEffect(() => {
    handleSocketSongCounter(setSongNumber, setMaxSong);
    return
  }, []);


  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Song {songNumber}/{maxSongs}</h1>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <img src={logo} alt="Pedro" />
        </Col>
      </Row>
      <AudioPlayer/>
      <BuzzerHandler/>
      <PlayersFooter/>
      <AnswerFeedback/>
    </Container>
  );
};

export default GameScreen;