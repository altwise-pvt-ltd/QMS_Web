import axios from "axios";
import { store } from "../store";
import { updateToken, logout } from "../store/slices/authSlice";

/**
 * Axios instance configured with a base URL and interceptors for token management.
 */
const api = axios.create({
  baseURL: "/api", // QMS API Base URL via Vite Proxy
});

/**
 * Request Interceptor:
 * Automatically attaches the Access Token to the Authorization header
 * for every outgoing request if it exists in the Redux store.
 */
api.interceptors.request.use((config) => {
  // Pull token from Redux store state
  const state = store.getState();
  let token = state.auth.accessToken;

  // Fallback to localStorage if Redux state is not yet updated (e.g., during login cleanup)
  if (!token) {
    token = localStorage.getItem("accessToken");
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor:
 * Handles global API response logic, most importantly token refreshing.
 * If a request fails with a 401 (Unauthorized), it attempts to use the
 * Refresh Token to get a new session.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 (Unauthorized) and haven't already retried this request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        // Attempt to call the refresh-token endpoint
        const response = await axios.post(
          "/api/AdminUser/RefreshToken",
          {
            refreshToken: refreshToken,
          },
        );

        // On success, save the new tokens in Redux (which also updates localStorage)
        const newAccessToken = response.data.accessToken || response.data.access_token;
        const newRefreshToken = response.data.refreshToken || response.data.refresh_token;

        store.dispatch(
          updateToken({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          }),
        );

        // Update the header of the original request and retry it
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh call itself fails, the session is truly dead
        console.error("Session expired, logging out...", refreshError);
        store.dispatch(logout());
        window.location.href = "/login"; // Force the user back to login
      }
    }
    return Promise.reject(error);
  },
);

export default api;
