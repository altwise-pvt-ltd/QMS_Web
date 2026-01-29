# Backend Authentication Specification - QMS Project

## 1. Overview
This document specifies the authentication requirements for the Quality Management System (QMS) backend. The system uses JSON Web Tokens (JWT) for secure, stateless authentication.

## 2. Authentication Flow
1. **Login**: User provides `corporateId` and `password`.
2. **Token Issuance**: Backend validates credentials and returns an `accessToken` (short-lived) and a `refreshToken` (long-lived).
3. **Authorized Requests**: Frontend includes the `accessToken` in the `Authorization: Bearer <token>` header for all protected API calls.
4. **Token Refresh**: When the `accessToken` expires (401 Unauthorized), the frontend calls the refresh endpoint with the `refreshToken` to obtain a new set of tokens.
5. **Onboarding Check**: The frontend checks for company information after login. The backend should ensure that user profiles include necessary flags or that the frontend can determine if onboarding is complete.

## 3. API Endpoints

### 3.1 Login
*   **Endpoint**: `POST /auth/login`
*   **Request Body**:
    ```json
    {
      "corporateId": "USER123",
      "password": "your_password"
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "access_token": "eyJhbGci...",
      "refresh_token": "eyJhbGci..."
    }
    ```
*   **Error Response (401 Unauthorized)**: Invalid credentials.

### 3.2 Refresh Token
*   **Endpoint**: `POST /auth/refresh-token`
*   **Request Body**:
    ```json
    {
      "refreshToken": "eyJhbGci..."
    }
    ```
*   **Success Response (200 OK)**:
    ```json
    {
      "access_token": "eyJhbGci...",
      "refresh_token": "eyJhbGci..."
    }
    ```

### 3.3 Get Profile (Current User)
*   **Endpoint**: `GET /auth/profile`
*   **Headers**: `Authorization: Bearer <accessToken>`
*   **Success Response (200 OK)**:
    ```json
    {
      "id": 1,
      "corporateId": "USER123",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "role": "admin",
      "avatar": "https://example.com/avatar.jpg"
    }
    ```

### 3.4 Logout (Recommended)
*   **Endpoint**: `POST /auth/logout`
*   **Description**: Invalidate the current session and blacklist the refresh token.

<!-- ### 3.5 Password Reset (Future)
*   **Endpoint**: `POST /auth/forgot-password`
*   **Endpoint**: `POST /auth/reset-password`
*   **Note**: Placeholder links already exist in the frontend. -->

## 4. Security Requirements
*   **Encryption**: All authentication traffic must be served over HTTPS.
*   **Password Storage**: Passwords must be hashed using a strong algorithm like **BCrypt** or **Argon2** before storage.
*   **Token Expiry**:
    *   `accessToken`: 15 minutes to 1 hour.
    *   `refreshToken`: 7 to 30 days.
*   **CORS**: Ensure the frontend domain is whitelisted.

## 5. User Roles
The system expects at least the following roles:
*   `admin`: Full access to the system and organization setup.
*   `manager`: Access to reports and management review meetings.
*   `staff`: Standard access for data entry and daily tasks.

## 6. Frontend Integration Notes
*   The frontend uses **Redux Toolkit** (`src/store`) for centralized authentication state management.
*   **Axios** interceptors (`src/auth/api.js`) are synced with the Redux store to handle token attachment and automatic refreshes.
*   Tokens are persisted in `localStorage` (`accessToken`, `refreshToken`) and synchronized with the Redux state on application load.
*   The system includes an `AuthContext` bridge for backward compatibility with existing `useAuth()` hooks.
