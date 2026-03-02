import React from "react";
import { Navigate, useLocation } from "react-router-dom";
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
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // If already authenticated, redirect to /dashboard (or the path they were trying to reach)
    if (isAuthenticated) {
        const from = location.state?.from?.pathname || "/dashboard";
        return <Navigate to={from} replace />;
    }

    // If not authenticated, render the children components
    return children;
};

export default PublicRoute;
