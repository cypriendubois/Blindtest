import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../../styles/Footer.css';
import { handleSocketEventsUserList } from '../../services/socketEvents';

const PlayersFooter = () => {
  const [usersList, setUsersList] = useState([]);
  
  useEffect(() => {
    handleSocketEventsUserList(setUsersList);
    return;
  }, []);

  return (
    <Container>
      <Row className="player-footer fixed-bottom">
        {usersList.map((columnContent, index) => (
        <Col key={index} className="text-center">
            {columnContent}
        </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PlayersFooter;
