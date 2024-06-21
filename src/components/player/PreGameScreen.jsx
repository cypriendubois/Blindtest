import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import socket from '../../services/socket';

const PreGameScreen = () => {
  const [username, setUsername] = useState('');
  const [joinedGame, setJoinedGame] = useState(false);

  useEffect(() => {
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleUserJoin = () => {
    console.log('Emitting login with username:', username);
    setJoinedGame(true);
    socket.emit("login", {
        username: username,
        socketId: socket.id
    });
  };

  if (joinedGame) {
    return (
      <Container>
        <Row>
          <Col className="text-center">
            <h4>Waiting for game to start...</h4>
          </Col>
        </Row>
      </Container>
    );
  };

  return (
    <Container>
      <Row>
        <Col>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label htmlFor="username">Choose a name</Form.Label>
            <Form.Control
              type="text"
              id="playlistUrl"
              placeholder={'Username'}
              onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
          <Button variant="primary" onClick={handleUserJoin}>Join game</Button>{' '}
        </Col>
      </Row>
    </Container>
  );
};

export default PreGameScreen;
