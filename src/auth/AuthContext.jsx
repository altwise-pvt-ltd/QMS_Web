import React, { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

/**
 * AuthContext provides global authentication state and utility functions.
 * It manages the logged-in user, authentication status, and initial loading state.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider wraps the application to provide authentication context.
 * On mount, it attempts to restore a session from localStorage tokens.
 *
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - The children components to be wrapped.
 * @returns {JSX.Element} The provider component.
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Initial check on application mount
  useEffect(() => {
    const checkAuth = async () => {
      // Look for an existing access token in LocalStorage
      const token = localStorage.getItem("accessToken");

      if (token) {
        try {
          // Attempt to fetch the user profile verify the token is still valid
          const response = await api.get("/auth/profile");
          setUser(response.data);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Auth initialization failed", error);
          // If the profile call fails, the token is likely invalid or expired
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      }
      // Set loading to false once the check is complete
      setLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Updates the context state with user data after a successful login.
   * @param {Object} userData - The profile data of the logged-in user.
   */
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Resets the authentication state and clears tokens from storage.
   */
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to easily access authentication context from any component.
 * @returns {Object} The context values { user, isAuthenticated, loading, login, logout }.
 */
export const useAuth = () => useContext(AuthContext);
