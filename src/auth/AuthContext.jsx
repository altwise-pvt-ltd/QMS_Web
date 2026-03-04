import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loginUser, getProfile } from "./authService";
import organizationService from "../features/onboarding/services/organizationService";
import api from "./api";
import {
  setCredentials,
  setOrganization,
  logout as logoutAction,
  selectCurrentUser,
  selectCurrentOrganization,
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
  const organization = useSelector(selectCurrentOrganization);
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

          // Also fetch organization data
          let orgData = null;
          try {
            const orgResponse = await organizationService.getAllOrganizations();
            if (
              orgResponse &&
              orgResponse.isSuccess &&
              orgResponse.value &&
              orgResponse.value.length > 0
            ) {
              const currentUserId = profileData?.adminUserId || profileData?.id;
              orgData = orgResponse.value.find(
                (org) => (org.CreatedBy || org.createdBy) == currentUserId,
              );
            }
          } catch (orgError) {
            console.error("Failed to fetch organization during init", orgError);
          }

          dispatch(
            setCredentials({
              user: profileData,
              organization: orgData,
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
      value={{ user, organization, isAuthenticated, loading, login, logout }}
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
