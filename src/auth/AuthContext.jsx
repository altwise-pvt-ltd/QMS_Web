import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, getProfile } from "./authService";
import api from "./api";
import {
  setCredentials,
  logout as logoutAction,
  selectCurrentUser,
  selectIsAuthenticated,
} from "../store/slices/authSlice";

/**
 * AuthContext provides global authentication state and utility functions.
 * It now acts as a bridge to Redux state for backward compatibility.
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(true);

  // Initial check on application mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token && !user) {
        try {
          // Attempt to fetch the user profile verify the token is still valid
          const profileData = await getProfile(token);
          dispatch(
            setCredentials({
              user: profileData,
              accessToken: token,
              refreshToken: localStorage.getItem("refreshToken"),
            }),
          );
        } catch (error) {
          console.error("Auth initialization failed", error);
          dispatch(logoutAction());
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [dispatch, user]);

  const login = (userData) => {
    // This is now primarily handled in login.jsx via dispatch(setCredentials)
    // but kept here for compatibility if other components use it.
    dispatch(
      setCredentials({
        user: userData,
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    );
  };

  const logout = async () => {
    try {
      // Try to notify the API about the logout
      await api.post("/AdminUser/Logout");
    } catch (error) {
      console.error("API Logout failed", error);
    } finally {
      // Always clear local state regardless of API success
      dispatch(logoutAction());
    }
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
