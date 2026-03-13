import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser, getProfile } from "./authService";
import { useAuth } from "./AuthContext";
import { setCredentials } from "../store/slices/authSlice";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      // 1. Authenticate and unwrap
      const loginResponse = await loginUser(email, password);
      const loginData = loginResponse?.isSuccess
        ? loginResponse.value
        : loginResponse;

      const token =
        loginData.accessToken || loginData.token || loginData.access_token;
      const refreshToken = loginData.refreshToken || loginData.refresh_token;

      if (!token) {
        throw new Error("No access token received");
      }

      // Ensure tokens are saved to localStorage early so the api interceptor can attach them
      // to requests like fetching the organizations
      localStorage.setItem("accessToken", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }

      // 2. IMPORTANT: Fetch the detailed user profile using the token we just received
      // We pass the token explicitly to avoid any race conditions with Redux/localStorage
      const profileData = await getProfile(token);

      // 3. IMPORTANT: Fetch and match the organization details
      const orgData = await fetchAndMatchOrg(profileData);

      // 4. Update Redux State with tokens, profile, and organization
      dispatch(
        setCredentials({
          user: profileData,
          organization: orgData, // Already normalized by fetchAndMatchOrg
          accessToken: token,
          refreshToken,
        }),
      );

      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error("Login Failed:", err);
      if (err.response?.status === 401) {
        setError("Invalid credentials. Please check your email and password.");
      } else {
        setError(
          err.response?.data?.message ||
          "Login failed. Please try again later.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
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
                <span className="key-point-text">
                  Compliance in every action
                </span>
              </div>
              <div className="key-point-item">
                <span className="key-point-icon"></span>
                <span className="key-point-text">
                  Confidence in every outcome
                </span>
              </div>
            </div>
          </div>
        </section>

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
                <div className="input-with-icon">
                  <Mail className="input-field-icon" size={20} />
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
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                  <a href="/reset-password">Reset Password</a>
                </div>
                <div className="password-input-wrapper">
                  <Lock className="input-field-icon" size={20} />
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
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-btn" disabled={loading}>
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
