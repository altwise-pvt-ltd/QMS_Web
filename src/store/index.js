import { configureStore } from "@reduxjs/toolkit";
import authReducer, { setupAuthPersistence } from "./slices/authSlice";

/**
 * Redux Store Configuration
 * Centralized state management for the QMS application.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  devTools: import.meta.env.MODE !== "production",
});

// Initialize authentication persistence
setupAuthPersistence(store);

export default store;
