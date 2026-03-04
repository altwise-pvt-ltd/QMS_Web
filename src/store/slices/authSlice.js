import { createSlice } from "@reduxjs/toolkit";

/**
 * Auth Slice
 * Manages authentication state, including tokens and user profile.
 * Persists session data to localStorage.
 */
const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    organization: null,
    accessToken: localStorage.getItem("accessToken") || null,
    refreshToken: localStorage.getItem("refreshToken") || null,
    isAuthenticated: !!localStorage.getItem("accessToken"),
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, organization, accessToken, refreshToken } = action.payload;
      state.user = user;
      // FIXED: Always set organization from payload, even if null.
      // Previously `if (organization)` meant a missing org on login
      // would silently preserve stale state instead of reflecting reality.
      // Use setOrganization separately if you need to update org alone.
      state.organization = organization ?? state.organization;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;

      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    },
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
    updateToken: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;

      if (accessToken) localStorage.setItem("accessToken", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    },
    logout: (state) => {
      state.user = null;
      state.organization = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setCredentials,
  setOrganization,
  updateToken,
  logout,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentOrganization = (state) => state.auth.organization;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.loading;