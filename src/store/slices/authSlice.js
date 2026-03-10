import { createSlice } from "@reduxjs/toolkit";

/**
 * Auth Slice
 * Purely manages authentication state.
 * Side effects (localStorage persistence) are handled via setupAuthPersistence.
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
      // Assign explicitly to ensure null or updated orgs are correctly reflected
      state.organization = organization;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    setOrganization: (state, action) => {
      state.organization = action.payload;
    },
    updateToken: (state, action) => {
      const { accessToken, refreshToken } = action.payload;
      state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.organization = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
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

/**
 * Helper to sync auth state tokens with localStorage.
 * Listens to store updates and persists tokens.
 */
export const setupAuthPersistence = (store) => {
  let previousToken = store.getState().auth.accessToken;
  
  store.subscribe(() => {
    const state = store.getState().auth;
    
    // Persist accessToken
    if (state.accessToken !== previousToken) {
      if (state.accessToken) {
        localStorage.setItem("accessToken", state.accessToken);
      } else {
        localStorage.removeItem("accessToken");
      }
      previousToken = state.accessToken;
    }

    // Persist refreshToken
    if (state.refreshToken) {
      localStorage.setItem("refreshToken", state.refreshToken);
    } else if (!state.accessToken) {
      localStorage.removeItem("refreshToken");
    }
  });
};

export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentOrganization = (state) => state.auth.organization;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectAuthLoading = (state) => state.auth.loading;
