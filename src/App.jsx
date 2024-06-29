import React from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MonitorPage from './pages/MonitorPage';
import PlayerPage from './pages/PlayerPage';
import Navbar from './components/common/Navbar';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/monitor" element={<MonitorPage />} />
        <Route path="/player" element={<PlayerPage />} />
      </Routes>
    </div>
  );
};

export default App;
