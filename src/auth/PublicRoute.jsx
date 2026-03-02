import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

/**
 * PublicRoute is a wrapper component that restricts access to unauthenticated users only.
 * If the user is already logged in, they are redirected to the dashboard.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The component(s) to render if not authenticated.
 * @returns {JSX.Element} The public content or a redirect to dashboard.
 */
const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    // While checking auth status, show loading
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If already authenticated, redirect to /dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // If not authenticated, render the children (e.g., Login page)
    return children;
};

export default PublicRoute;
