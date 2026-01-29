import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

/**
 * Redux Store Configuration
 * Centralized state management for the QMS application.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
