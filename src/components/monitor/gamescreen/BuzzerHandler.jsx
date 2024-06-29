import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import socket from '../../../services/socket';

import { handleSocketEventsBuzzer } from '../../../services/socketEvents';
import CountdownSpinner from './Timer'
const BuzzerHandler = () => {
  const [buzzingPlayer, setBuzzingPlayer] = useState(null); 

  useEffect(() => {
    handleSocketEventsBuzzer(setBuzzingPlayer);
    return () => {
      socket.off('audioUrl');
      socket.off('isPlaying');
    };
  }, []);

  const handlePlayerWrong = () => {
    console.log('Player was wrong');
    setBuzzingPlayer(null);
    socket.emit("buzzerDecision", {
        buzzerDecision: 0
      });
  };

  const handlePlayerRight = () => {
    console.log('Player was right');
    setBuzzingPlayer(null);
    socket.emit("buzzerDecision", {
        buzzerDecision: 1
      });  
  };

  if (!buzzingPlayer) {
    return null; 
  }

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <p>{buzzingPlayer} buzzed!<br />Does he have the answer?</p>
        </Col>
      </Row>
      <Row>
        <Col className="text-center">
          <Button variant="danger" onClick={handlePlayerWrong}>No</Button>{' '}
        </Col>
        <Col className="text-center">
        <CountdownSpinner/>
        </Col>
        <Col className="text-center">
          <Button variant="success" onClick={handlePlayerRight}>Yes</Button>{' '}
        </Col>
      </Row>
    </Container>
  );
};

export default BuzzerHandler;
