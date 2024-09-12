import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import PasswordManager from './components/PasswordManager';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Signup />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/password-manager" element={<PasswordManager />} />
      </Routes>
    </Router>
  );
}

export default App;
