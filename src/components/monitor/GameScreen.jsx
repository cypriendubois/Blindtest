import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import socket from '../../services/socket';
import handleSocketEvents from '../../services/socketEvents';
import logo from '../../assets/pedro.gif';

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
            <img src={logo} alt="Pedro"/>
        </Col>
      </Row>
      </Container>
    );
};

export default GameScreen;