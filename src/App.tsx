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

import { useFetchProfileQuery, profileApi } from "./services/profile";
import { useLogoutMutation } from "./services/auth";
import { antiforgeryApi } from "./services/antiforgery";
import { authApi } from "./services/auth";
import { clearAntiForgeryStorage } from "./services/csrf";
import { useDispatch } from "react-redux";

import './App.css';


function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data: profileData, isLoading, refetch } = useFetchProfileQuery();
  const [logout] = useLogoutMutation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    // Refetch profile data on mount
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple logout attempts
    setIsLoggingOut(true);
    try {
      // Try to notify server, but UI state should be cleared regardless of outcome
      await logout().unwrap();
    } catch (e) {
      // Swallow errors; UI state is cleared in finally
    } finally {
      // Always clear client auth-related state
      try { clearAntiForgeryStorage(); } catch {}
      dispatch(profileApi.util.resetApiState());
      dispatch(authApi.util.resetApiState());
      dispatch(antiforgeryApi.util.resetApiState());
      setIsLoggingOut(false);
      navigate("/login", { replace: true });
    }
  };

  if (isLoading) return <div>Loading...</div>; // Show a loading state while checking session

  return (
    <>
      <Navbar onLogout={handleLogout} />
      <div className="relative min-h-screen overflow-x-hidden bg-gray-100">
        <Routes>
          <Route
            path="/"
            element={profileData ? <Navigate to="/home" replace /> : <Landing />}
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