import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { handleSocketEventsAnswer } from '../../services/socketEvents';

function AnswerFeedback() {
  const [modalShow, setOverlayState] = useState(false);
  const [player, setPlayerForOverlay] = useState('');
  useEffect(() => {
    handleSocketEventsAnswer(setOverlayState, setPlayerForOverlay);
    // Hide modal after 2.5 seconds when it's shown
    if (modalShow) {
      const timer = setTimeout(() => {
        setOverlayState(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [modalShow]);
  return (
    <Modal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      show={modalShow}
      centered
    >
      <Modal.Body>
        <Row>
          <Col className="text-center">
            <h4>{player} guessed correctly!</h4>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default AnswerFeedback;