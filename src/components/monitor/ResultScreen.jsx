import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ResultsTable from './resultscreen/ResultsTable'

const GameScreen = ({users}) => {
  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Results</h1>
        </Col>
      </Row>
        <Col className="text-center">
          <ResultsTable users={users}/>
        </Col>
    </Container>
  );
};

export default GameScreen;