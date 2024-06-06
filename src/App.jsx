import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Monitor from './components/Monitor';
import Player from './components/Player';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Monitor />} />
        <Route path="/player" element={<Player />} />
      </Routes>
      <nav>
        <ul>
          <li><Link to="/">Monitor</Link></li>
          <li><Link to="/player">Player</Link></li>
        </ul>
      </nav>
    </Router>
  );
};

export default App;
