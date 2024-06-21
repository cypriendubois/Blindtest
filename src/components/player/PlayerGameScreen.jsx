import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import socket from '../../services/socket';
import {handleSocketEventsBuzzerStatus} from '../../services/socketEvents';


const PlayerGameScreen = ({ username }) => {
  const [buzzerDisabled, setBuzzer] = useState(false);
  useEffect(() => {
    handleSocketEventsBuzzerStatus(setBuzzer);
    return;
  }, []);

  const handleBuzz = () => {
    console.log('Emitting buzz for user:', username);
    setBuzzer(true);
    socket.emit("buzz", {
      username: username
    });
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col className="d-flex justify-content-center">
          <Button variant="danger" size="lg" onClick={handleBuzz} disabled={buzzerDisabled}>BUZZ</Button>{' '}
        </Col>
      </Row>
    </Container>
  );
};

export default PlayerGameScreen;
