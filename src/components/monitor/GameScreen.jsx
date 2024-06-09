import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import logo from '../../assets/pedro.gif';
import AudioPlayer from './AudioPlayer';
import BuzzerHandler from './BuzzerHandler'
import PlayersFooter from './PlayersFooter';
import AnswerFeedback from './AnswerFeedback';

const GameScreen = () => {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Game Screen</h1>
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