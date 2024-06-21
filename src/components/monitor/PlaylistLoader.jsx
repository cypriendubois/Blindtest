import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import socket from '../../services/socket';
import {handleSocketEventsPlaylistLoader} from '../../services/socketEvents';
import PlayersFooter from '../common/PlayersFooter';

const PlaylistLoader = () => {
  const [playlistUrl, setPlaylistUrl] = useState('https://deezer.page.link/jgWCyForWLp2M8687');
  const [playlistLoaded, setPlaylistLoaded] = useState(false);

  useEffect(() => {
    handleSocketEventsPlaylistLoader(setPlaylistLoaded);
    // Emit an event when the component loads
    console.log('Monitor loaded, emitting event');
    socket.emit('spectate');

    return () => {
      socket.off('playlistLoaded');
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const handleLoadPlaylist = () => {
    console.log('Emitting loadPlaylist with URL:', playlistUrl);
    socket.emit('loadPlaylist', { playlistUrl });
  };

  const handleStartGame = () => {
    console.log('Starting game...');
    socket.emit('start');
  };

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <h1>Monitor Page</h1>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Label htmlFor="playlistUrl">Deezer playlist URL</Form.Label>
          <Form.Control
            type="text"
            id="playlistUrl"
            value={playlistUrl}
            onChange={(e) => setPlaylistUrl(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Button variant="secondary" onClick={handleLoadPlaylist}>Load playlist</Button>{' '}
          <Button variant="primary" onClick={handleStartGame} disabled={!playlistLoaded}>Start game</Button>{' '}
        </Col>
      </Row>
      <PlayersFooter/>
    </Container>
  );
};

export default PlaylistLoader;