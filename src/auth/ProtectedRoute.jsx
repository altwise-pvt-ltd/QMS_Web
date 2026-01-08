import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * ProtectedRoute is a wrapper component that restricts access to authenticated users only.
 * If the user is not logged in, they are redirected to the login page.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The component(s) to render if authenticated.
 * @returns {JSX.Element} The protected content or a redirect to login.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // While the authentication status is being determined, show a loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to /login and store the current path for later redirection
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;
