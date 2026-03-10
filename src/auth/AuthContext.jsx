import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getProfile } from "./authService";
import organizationService from "../features/onboarding/services/organizationService";
import { matchUserOrg } from "../utils/organizationUtils";
import api from "./api";
import {
  setCredentials,
  logout as logoutAction,
  selectCurrentUser,
  selectCurrentOrganization,
  selectIsAuthenticated,
} from "../store/slices/authSlice";

const AuthContext = createContext(null);

const fixAvatarUrl = (url) => {
  if (!url) return null;
  const secondHttpIndex = url.indexOf("http", 5);
  if (secondHttpIndex > 0) return url.substring(secondHttpIndex);
  return url;
};

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);
  const organization = useSelector(selectCurrentOrganization);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("accessToken");

      if (token && !user) {
        try {
          // 1. Fetch and unwrap profile
          const rawProfile = await getProfile(token);
          const profileData = rawProfile?.isSuccess
            ? rawProfile.value
            : rawProfile;

          if (profileData?.avatar) {
            profileData.avatar = fixAvatarUrl(profileData.avatar);
          }

          // Ensure tokens are in localStorage for the next call (should be there, but defensive)
          localStorage.setItem("accessToken", token);
          const rf = localStorage.getItem("refreshToken");

          // 2. Fetch and unwrap organization list
          const orgResponse = await organizationService.getAllOrganizations();
          const orgList = Array.isArray(orgResponse)
            ? orgResponse
            : orgResponse?.isSuccess
              ? orgResponse.value
              : [];

          // 3. Match strictly by organizationId
          const orgData = matchUserOrg(profileData, orgList);

          dispatch(
            setCredentials({
              user: profileData,
              organization: orgData,
              accessToken: token,
              refreshToken: rf,
            }),
          );
        } catch (error) {
          console.error("Auth initialization failed:", error);
          dispatch(logoutAction());
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [dispatch, user]);

  /**
   * login — called from your login page after successful authentication.
   */
  const login = (userData, orgData = null) => {
    dispatch(
      setCredentials({
        user: userData,
        organization: orgData,
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
      }),
    );
  };

  const logout = async () => {
    try {
      await api.post("/AdminUser/Logout");
    } catch (error) {
      console.error("API Logout failed:", error);
    } finally {
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

export const useAuth = () => useContext(AuthContext);
