import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../assets/logo.png";

const Login = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("Admin");
  const [corporateId, setCorporateId] = useState("");
  const [password, setPassword] = useState("");
  const [displayedRole, setDisplayedRole] = useState("Admin");
  const [isTyping, setIsTyping] = useState(false);

  // Typing and Erasing effect
  useEffect(() => {
    let isMounted = true;
    setIsTyping(true);

    const animateText = async () => {
      // Erase current text
      if (displayedRole !== "" && displayedRole !== role) {
        for (let i = displayedRole.length; i >= 0; i--) {
          if (!isMounted) return;
          await new Promise((resolve) => setTimeout(resolve, 50));
          setDisplayedRole(displayedRole.slice(0, i));
        }
      }

      // Type new text
      for (let i = 0; i <= role.length; i++) {
        if (!isMounted) return;
        await new Promise((resolve) => setTimeout(resolve, 100));
        setDisplayedRole(role.slice(0, i));
      }

      if (isMounted) {
        setIsTyping(false);
      }
    };

    animateText();

    return () => {
      isMounted = false;
    };
  }, [role]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ basic validation
    if (!corporateId || !password) {
      alert("Please fill all required fields");
      return;
    }

    // 🔐 later: API login + role based redirect
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Section */}
        <div className="login-left">
          <div className="login-left-content">
            <img src={logo} alt="Alpine Labs Logo" className="login-logo" />

            <h1 className="login-title">
              Precision in <br />
              <span>diagnostic Care</span>
            </h1>

            <p className="login-subtitle">
              Committed to excellence in diagnostic management and team
              collaboration.
            </p>

            <div className="live-diagnostics">
              <div className="live-header">
                <span className="pulse-dot" />
                <span>Live Diagnostics</span>
              </div>
              <div className="live-bars">
                <div />
                <div />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <h2>
              <span className="welcome-text">Welcome </span>
              <span className="role-text">
                {displayedRole}
                {isTyping && <span className="typing-cursor">|</span>}
              </span>
            </h2>
            <p>Access your diagnostic portal</p>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Role Selector */}
              <div className="role-selector">
                {["Admin", "Department", "Staff"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`role-btn ${role === r ? "active" : ""}`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label htmlFor="corporateId">Corporate ID</label>
                <input
                  id="corporateId"
                  placeholder="Enter your ID"
                  value={corporateId}
                  onChange={(e) => setCorporateId(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div className="password-header">
                  <label htmlFor="password">Password</label>
                  <a href="#">Reset Password</a>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Sign In to Dashboard
              </button>
            </form>

            <p className="support-text">
              Need technical support? <a href="#">Contact IT Helpdesk</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

/* changes added for the login page as required By Rudra */
