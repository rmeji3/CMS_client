import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";

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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch("https://localhost:7108/Profile/me", {
          credentials: "include",
        });
        setIsLoggedIn(res.ok);
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate("/login", { replace: true });
  };

  if (isLoggedIn === null) {
    return <div>Loading...</div>; // Show a loading state while checking session
  }

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div className="relative min-h-screen overflow-x-hidden bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={isLoggedIn ? <Navigate to="/home" replace /> : <Landing />}
          />
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