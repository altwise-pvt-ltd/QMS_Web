import axios from "axios";
import { store } from "../store";
import { updateToken, logout } from "../store/slices/authSlice";
import { handleError } from "../utils/errorHandler";

/**
 * Axios instance configured with a base URL and interceptors for token management.
 */
const api = axios.create({
  baseURL: "/api", // QMS API Base URL via Vite Proxy
  timeout: 15000,   // 15s timeout
});

/**
 * Request Interceptor:
 * Automatically attaches the Access Token to the Authorization header
 */
api.interceptors.request.use((config) => {
  const state = store.getState();
  let token = state.auth.accessToken || localStorage.getItem("accessToken");

  if (token && !config.skipAuth) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor:
 * Handles global API response logic, retries, and error mapping.
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Handle Token Refresh (401)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/AdminUser/RefreshToken")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await axios.post("/api/AdminUser/RefreshToken", {
          refreshToken: refreshToken,
        });

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

        store.dispatch(
          updateToken({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Session expired, logging out...", refreshError);
        store.dispatch(logout());
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(handleError(refreshError));
      }
    }

    // 2. Handle Transient Retries (503/504)
    if (
      [503, 504].includes(error.response?.status) &&
      !originalRequest._retryCount
    ) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      if (originalRequest._retryCount <= 2) {
        const delay = originalRequest._retryCount * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(originalRequest);
      }
    }

    // 3. Centralized Error Transformation
    return Promise.reject(handleError(error));
  }
);

export default api;
