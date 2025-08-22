import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem("accessToken"); // Check if the access token exists

    if (!token) {
        // If no token, redirect to login
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>; // Render the protected component
};

export default ProtectedRoute;
