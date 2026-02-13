import api from "./api"; // Import the interceptor instance we just made
import axios from "axios"; // Import raw axios for the initial login only

const API_URL = "/api";

/**
 * Handles user login by sending credentials to the API.
 * On success, it stores the access and refresh tokens in localStorage.
 *
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The API response data containing tokens.
 */

export const loginUser = async (email, password) => {
  // We use raw axios here because we don't have a token yet
  const response = await axios.post(`${API_URL}/AdminUser/Login`, {
    email,
    password,
  });

  // Persist tokens for session maintenance
  // Note: Adjusting field names based on common API patterns if they differ from the previous fake API
  if (response.data.accessToken || response.data.token || response.data.access_token) {
    const token = response.data.accessToken || response.data.token || response.data.access_token;
    const refreshToken = response.data.refreshToken || response.data.refresh_token;

    localStorage.setItem("accessToken", token);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  }
  return response.data;
};

/**
 * Fetches the current user's profile information.
 * This call uses the 'api' instance which automatically attaches the Bearer token.
 *
 * @param {string} token - Optional access token to use for this specific request.
 * @returns {Promise<Object>} The user profile data.
 */
export const getProfile = async (token = null) => {
  // If a token is provided manually, we use it. Otherwise, the interceptor handles it.
  const config = token
    ? {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
    : {};

  const response = await api.get("/AdminUser/GetProfile", config);
  return response.data;
};

/**
 * Handles user logout.
 */
export const logoutUser = async () => {
  try {
    await api.post("/AdminUser/Logout");
  } catch (error) {
    console.error("Logout API call failed", error);
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }
};
