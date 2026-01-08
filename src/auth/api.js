import axios from "axios";

/**
 * Axios instance configured with a base URL and interceptors for token management.
 */
const api = axios.create({
  baseURL: "https://api.escuelajs.co/api/v1", // Platzi Fake API Base URL
});

/**
 * Request Interceptor:
 * Automatically attaches the Access Token to the Authorization header
 * for every outgoing request if it exists in LocalStorage.
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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
          "https://api.escuelajs.co/api/v1/auth/refresh-token",
          {
            refreshToken: refreshToken,
          }
        );

        // On success, save the new tokens
        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("refreshToken", response.data.refresh_token);

        // Update the header of the original request and retry it
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${response.data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If the refresh call itself fails, the session is truly dead
        console.error("Session expired, logging out...", refreshError);
        localStorage.clear();
        window.location.href = "/login"; // Force the user back to login
      }
    }
    return Promise.reject(error);
  }
);

export default api;
