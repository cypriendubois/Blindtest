import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import socket from '../../../services/socket';


const CountdownSpinner = () => {
  const [time, setTime] = useState(10);

  useEffect(() => {
    if (time > 0) {
      const timer = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
    else {
      console.log('Emitting timeout')
      setTime(10);
      socket.emit('answerTimeout');
    }
  }, [time]);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <Spinner animation="border" role="status">
      </Spinner>
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 'bold',
        }}
      >
        {time}
      </div>
    </div>
  );
};

export default CountdownSpinner;
