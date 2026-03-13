import axios from "axios";
import { store } from "../store";
import { updateToken, logout } from "../store/slices/authSlice";
import { handleError } from "../utils/errorHandler";

/**
 * Axios instance configured with base URL
 */
const api = axios.create({
  baseURL: "/api",
  timeout: 60000,
});

/**
 * Attach access token automatically
 */
api.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.accessToken || localStorage.getItem("accessToken");

  if (token && !config.skipAuth) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response interceptor
 */
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.config) {
      return Promise.reject(handleError(error));
    }

    const originalRequest = error.config;

    // Handle 401 (token expired)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/AdminUser/RefreshToken")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) throw new Error("No refresh token available");

        const response = await api.post(
          "/AdminUser/RefreshToken",
          { refreshToken },
          { skipAuth: true }
        );

        const {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        } = response.data;

        store.dispatch(
          updateToken({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
          })
        );

        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        processQueue(null, newAccessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        store.dispatch(logout());

        const publicPaths = ["/login", "/confirm-password"];
        const isPublicPath = publicPaths.some((p) =>
          window.location.pathname.includes(p)
        );

        if (!isPublicPath) {
          window.location.href = "/login";
        }

        return Promise.reject(handleError(refreshError));
      } finally {
        isRefreshing = false;
      }
    }

    // Retry transient server errors
    if (
      [503, 504].includes(error.response?.status) &&
      (originalRequest._retryCount || 0) < 2
    ) {
      originalRequest._retryCount =
        (originalRequest._retryCount || 0) + 1;

      const delay = originalRequest._retryCount * 1000;

      await new Promise((resolve) => setTimeout(resolve, delay));

      return api(originalRequest);
    }

    return Promise.reject(handleError(error));
  }
);

export default api;