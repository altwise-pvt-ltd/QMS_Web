import api from "./api"; // Import the interceptor instance we just made
import axios from "axios"; // Import raw axios for the initial login only

const API_URL = "https://api.escuelajs.co/api/v1/auth";

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
  const response = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  // Persist tokens for session maintenance
  if (response.data.access_token) {
    localStorage.setItem("accessToken", response.data.access_token);
    localStorage.setItem("refreshToken", response.data.refresh_token);
  }
  return response.data;
};

/**
 * Fetches the current user's profile information.
 * This call uses the 'api' instance which automatically attaches the Bearer token.
 *
 * @returns {Promise<Object>} The user profile data.
 */
export const getProfile = async () => {
  // This uses our 'api' instance, so it auto-attaches tokens via interceptors!
  return api.get(`${API_URL}/profile`);
};
