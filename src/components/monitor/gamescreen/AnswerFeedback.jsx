import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import socket from '../../../services/socket';

import { handleSocketEventsAnswer } from '../../../services/socketEvents';

function AnswerFeedback() {
  const [modalShow, setOverlayState] = useState(false);
  const [overlayText, setOverlayText] = useState('');
  const [_, placeholder] = useState('');
  
  useEffect(() => {
    handleSocketEventsAnswer(setOverlayState, setOverlayText, placeholder);
    // Hide modal after 2.5 seconds when it's shown
    if (modalShow) {
      const timerOverlay = setTimeout(() => {
        setOverlayState(false);
      }, 3000);
      const timerNext = setTimeout(() => {
        socket.emit("disableBuzzers");
        socket.emit("next");
      }, 5000);
      return ;
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
            <h4>{overlayText}</h4>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default AnswerFeedback;