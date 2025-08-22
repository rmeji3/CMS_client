import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importing pages
import Landing from './pages/landing';
import Login from './pages/login';
import Home from './pages/home';

// Importing components
import Navbar from './components/navbar';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';


function App() {
  return (
    <Router>
      <Navbar />
      <div className="relative min-h-screen overflow-x-hidden bg-gray-100">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;