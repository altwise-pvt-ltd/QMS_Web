import api from "./api";
import axios from "axios";

const API_URL = "/api";

/**
 * Handles user login by sending credentials to the API.
 * 
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<Object>} The API response data containing tokens.
 */
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/AdminUser/Login`, {
    email,
    password,
  });
  return response.data;
};

/**
 * Fetches the current user's profile information.
 * 
 * @param {string} token - Optional access token to use for this specific request.
 * @returns {Promise<Object>} The user profile data.
 */
export const getProfile = async (token = null) => {
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
    // Silently fail logout API call
  }
};

/**
 * Handles password update for the current admin user.
 */
export const changePassword = async (oldPassword, newPassword) => {
  const response = await api.post("/AdminUser/ChangePassword", {
    oldPassword,
    newPassword,
  });
  return response.data;
};

/**
 * Handles password update for a staff member.
 */
export const changeStaffPassword = async (staffId, oldPassword, newPassword, confirmPassword) => {
  const response = await api.post(`/Staff/ChangePassword/${staffId}`, {
    oldPassword,
    newPassword,
    confirmPassword,
  });
  return response.data;
};





