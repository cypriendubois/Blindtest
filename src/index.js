import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/App.css';
import { io } from 'socket.io-client';

const container = document.getElementById('root');
const root = createRoot(container);

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

root.render(<App />);
