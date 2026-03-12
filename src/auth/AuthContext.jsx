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

const AuthContext = createContext(null);

const fixAvatarUrl = (url) => {
  if (!url) return null;
  const secondHttpIndex = url.indexOf("http", 5);
  if (secondHttpIndex > 0) return url.substring(secondHttpIndex);
  return url;
};

export const normalizeOrg = (org) => {
  if (!org) return null;
  return {
    organizationId: org.organizationId || org.OrganizationId || org.id || org.Id,
    name: org.legalCompanyName || org.LegalCompanyName || org.name || org.Name || "",
    industry: org.industrySector || org.IndustrySector || "",
    phone: org.businessPhone || org.BusinessPhone || org.phone || org.Phone || "",
    websiteUrl: org.corporateWebsite || org.CorporateWebsite || org.websiteUrl || org.WebsiteUrl || "",
    address: org.registeredAddress || org.RegisteredAddress || org.address || org.Address || "",
    logo: org.logoPath || org.LogoPath || org.companyLogoPath || org.CompanyLogoPath || org.CompanyLogo || org.logo || org.Logo || null,
    status: org.status || org.Status,
    createdAt: org.createdAt || org.CreatedAt,
    createdBy: org.createdBy || org.CreatedBy,
  };
};

/**
 * Helper: fetch orgs from API and match to a user profile.
 * Tries organizationId first, then falls back to createdBy.
 * Uses String() coercion to avoid number-vs-string mismatches.
 */
export const fetchAndMatchOrg = async (profileData) => {
  const orgResponse = await organizationService.getAllOrganizations();

  const orgList = Array.isArray(orgResponse)
    ? orgResponse
    : orgResponse?.isSuccess
      ? orgResponse.value
      : [];

  if (orgList.length === 0) return null;

  const currentUserId = profileData?.id || profileData?.adminUserId;
  let matched = null;

  // Priority 1: match by organizationId from user profile
  if (profileData?.organizationId) {
    matched = orgList.find(
      (org) =>
        String(org.organizationId || org.OrganizationId) ===
        String(profileData.organizationId),
    );
  }

  // Priority 2: fall back to createdBy
  if (!matched && currentUserId) {
    matched = orgList.find(
      (org) => String(org.createdBy || org.CreatedBy) === String(currentUserId),
    );
  }

  return normalizeOrg(matched);
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
          const profileData = await getProfile(token);

          if (profileData?.avatar) {
            profileData.avatar = fixAvatarUrl(profileData.avatar);
          }

          let orgData = null;
          try {
            orgData = await fetchAndMatchOrg(profileData);
          } catch (orgError) {
            console.error(
              "Failed to fetch organization during init:",
              orgError,
            );
          }

          dispatch(
            setCredentials({
              user: profileData,
              organization: orgData,
              accessToken: localStorage.getItem("accessToken"),
              refreshToken: localStorage.getItem("refreshToken"),
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
   * Now accepts an optional orgData param so callers can pass it if available.
   * If not passed, ProtectedRoute will fetch it before deciding to redirect.
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
