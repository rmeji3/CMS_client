import { Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect } from "react";

// Importing pages
import Landing from './pages/landing';
import Login from './pages/login';
import Home from './pages/home';
import Account from './pages/account';

// Importing components
import Navbar from './components/navbar';
import ProtectedRoute from './components/ProtectedRoute';

import './App.css';


function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("https://localhost:7108/Profile/me", {
          credentials: "include",
        });
        if (!res.ok) {
          console.error("Session check failed");
        }
      } catch (error) {
        console.error("Session check failed:", error);
      }
    };

    checkSession();
  }, []);

  const handleLogout = () => {
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Navbar onLogout={handleLogout} />
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
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

export default App;