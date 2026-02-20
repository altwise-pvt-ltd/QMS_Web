/**
 * Centralized Error Handling Utility
 */

export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

export const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const message = error.response.data?.message || error.response.statusText;
    const statusCode = error.response.status;
    
    console.error(`API Error [${statusCode}]: ${message}`, error.response.data);
    
    // Global notification/toast logic could go here
    return new AppError(message, statusCode);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("Network Error: No response received from server");
    return new AppError("Network connection failed. Please check your internet.", 503);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Application Error:", error.message);
    return new AppError(error.message, 500);
  }
};

export default { AppError, handleError };
