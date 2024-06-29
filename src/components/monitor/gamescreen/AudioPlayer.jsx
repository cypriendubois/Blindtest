import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ProgressBar from 'react-bootstrap/ProgressBar';
import ReactPlayer from 'react-player/lazy';
import socket from '../../../services/socket';

import { handleSocketEventsAudioPlayer, handleSocketEventsAnswer } from '../../../services/socketEvents';



const AudioPlayer = () => {
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0); // Duration of the audio snippet
  const [playedSeconds, setPlayedSeconds] = useState(0); // Played time in seconds
  const [_, placeholder] = useState(0); 
  

  useEffect(() => {
    handleSocketEventsAudioPlayer(setAudioUrl, setIsPlaying);
    handleSocketEventsAnswer(placeholder,placeholder,setPlayedSeconds);
    return () => {
      socket.off('audioUrl');
      socket.off('isPlaying');
    };
  }, []);

  // Calculate progress
  const progress = (playedSeconds / duration) * 100;

  const handleSongEnd = () => {
    setPlayedSeconds(0);
    setTimeout(()=>{
      console.log('Song ended, emitting next event');
      socket.emit('next');
    }, 3000);
  };

  return (
    <Container>
      <Row>
        <Col className="text-center">
          <ReactPlayer
            url={audioUrl}
            playing={isPlaying}
            volume={0.3}
            onDuration={(dur) => setDuration(dur)}
            onProgress={({ playedSeconds }) => setPlayedSeconds(playedSeconds)}
            onEnded={handleSongEnd}
            progressInterval={10}
            style={{ display: 'none' }}
          />
          <ProgressBar now={progress} />
        </Col>
      </Row>
    </Container>
  );
};

export default AudioPlayer;
