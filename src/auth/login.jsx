import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, getProfile } from "./authService";
import { useAuth } from "./AuthContext";
import { setCredentials } from "../store/slices/authSlice";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { login } = useAuth();
  const [corporateId, setCorporateId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  /**
   * Handles the login form submission.
   * It performs authentication, fetches the user profile, and updates the global auth state.
   *
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Basic validation: ensure both fields are filled
    if (!corporateId || !password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with credentials and store tokens in LocalStorage (handled inside loginUser)
      console.log(`Attempting login for: ${corporateId}`);
      const loginResponse = await loginUser(corporateId, password);

      // 2. Use the fresh tokens to fetch the detailed user profile
      const profileResponse = await getProfile();

      // 3. Update Redux State
      dispatch(
        setCredentials({
          user: profileResponse.data,
          accessToken: loginResponse.access_token,
          refreshToken: loginResponse.refresh_token,
        }),
      );

      // 4. Update the global AuthContext with the fetched profile data
      // This tells the rest of the app (like Sidbar and ProtectedRoute) that we are logged in.
      login(profileResponse.data);

      // 4. On success, navigate to the main dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Failed", err);
      // Provision for user-friendly error messages
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      // Ensure loading state is reset regardless of outcome
      setLoading(false);
    }
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-left-content">
            <div className="brand-title">Quality Management System</div>
            <div>
              <h1 className="login-title">
                Precision in <span>diagnostic</span> Care
              </h1>
              <p className="login-subtitle">
                Committed to excellence in diagnostic management.
              </p>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-form-wrapper">
            <h2 className="welcome-text">Welcome</h2>
            <p>Access your diagnostic portal</p>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="corporateId">Corporate ID</label>
                <input
                  id="corporateId"
                  type="text"
                  value={corporateId}
                  onChange={(e) => setCorporateId(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                  <a href="/reset-password">Reset Password</a>
                </div>
                <div className="password-input-wrapper">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    disabled={loading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
                {loading ? "Signing in..." : "Sign In to Dashboard"}
              </button>
            </form>

            <p className="support-text">
              Need technical support? <a href="/support">Contact IT Helpdesk</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
