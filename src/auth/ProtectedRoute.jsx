import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { db } from "../db";

/**
 * ProtectedRoute is a wrapper component that restricts access to authenticated users only.
 * If the user is not logged in, they are redirected to the login page.
 * It also checks if the onboarding (company info) is completed.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The component(s) to render if authenticated.
 * @returns {JSX.Element} The protected content or a redirect to login/onboarding.
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [onboardingLoading, setOnboardingLoading] = useState(true);
  const [hasCompanyInfo, setHasCompanyInfo] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkOnboarding = async () => {
      if (isAuthenticated) {
        try {
          const count = await db.company_info.count();
          setHasCompanyInfo(count > 0);
        } catch (error) {
          console.error("Failed to check onboarding status:", error);
        }
      }
      setOnboardingLoading(false);
    };

    checkOnboarding();
  }, [isAuthenticated]);

  // While the authentication or onboarding status is being determined, show a loading indicator
  if (authLoading || onboardingLoading) {
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

  // If authenticated but company info is missing, redirect to onboarding (unless already there)
  if (!hasCompanyInfo && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  // If authenticated, render the children components
  return children;
};

export default ProtectedRoute;
