import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing pages
import Landing from './pages/landing';
import Login from './pages/login';

// Importing components
import Navbar from './components/navbar';

import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="relative min-h-screen overflow-x-hidden bg-gray-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;