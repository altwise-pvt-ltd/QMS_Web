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
  const [email, setEmail] = useState("");
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
    if (!email || !password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate with credentials and store tokens in LocalStorage (handled inside loginUser)
      console.log(`Attempting login for: ${email}`);
      const loginResponse = await loginUser(email, password);

      // Extract tokens from response
      const token = loginResponse.accessToken || loginResponse.token || loginResponse.access_token;
      const refreshToken = loginResponse.refreshToken || loginResponse.refresh_token;

      if (!token) {
        throw new Error("No access token received");
      }

      // 2. IMPORTANT: Fetch the detailed user profile using the token we just received
      // We pass the token explicitly to avoid any race conditions with Redux/localStorage
      const profileData = await getProfile(token);

      // 3. Update Redux State with both user profile and tokens
      dispatch(
        setCredentials({
          user: profileData,
          accessToken: token,
          refreshToken: refreshToken,
        }),
      );

      // 4. Update the global AuthContext with the fetched profile data
      login(profileData);

      // 5. On success, navigate to the main dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error("Login Failed", err);
      // Provision for user-friendly error messages
      if (err.response && err.response.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again later.");
      }
    } finally {
      // Ensure loading state is reset regardless of outcome
      setLoading(false);
    }
  };
  return (
    <main className="login-page">
      <div className="login-container">
        {/* Branding Section */}
        <section className="login-left">
          <div className="login-left-content">
            <div className="brand-title">Quality Management System</div>
            <div className="login-title-wrapper">
              <h1 className="login-title">
                Precision in <span>diagnostic</span> Care
              </h1>
            </div>
            <div className="login-key-points">
              <div className="key-point-item">
                <span className="key-point-icon"></span>
                <span className="key-point-text">Accuracy in every step</span>
              </div>
              <div className="key-point-item">
                <span className="key-point-icon"></span>
                <span className="key-point-text">Compliance in every action</span>
              </div>
              <div className="key-point-item">
                <span className="key-point-icon"></span>
                <span className="key-point-text">Confidence in every outcome</span>
              </div>
            </div>
          </div>
        </section>

        {/* Login Form Section */}
        <section className="login-right">
          <div className="login-form-wrapper">
            <h2 className="welcome-text">Welcome</h2>
            <p className="welcome-subtext">Access your diagnostic portal</p>

            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  autoComplete="username"
                  placeholder="name@example.com"
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

              <button
                type="submit"
                className="login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  "Sign In to Dashboard"
                )}
              </button>
            </form>

            <p className="support-text">
              Need technical support? <a href="/support">Contact IT Helpdesk</a>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;
