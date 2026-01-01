import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const [corporateId, setCorporateId] = useState("");
  const [password, setPassword] = useState("");

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
            {/* TOP LEFT – Brand / Logo */}
            <div className="brand-section">
              <h1 className="brand-title">Quality Management System</h1>
              {/* future logo can go here */}
              {/* <img src={logo} alt="Logo" /> */}
            </div>

            {/* BOTTOM LEFT – Title & Subtitle */}
            <div className="text-section">
              <h1 className="login-title">
                Precision in <br />
                <span>diagnostic Care</span>
              </h1>

              <p className="login-subtitle">
                Committed to excellence in diagnostic management and team
                collaboration.
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right">
          <div className="login-form-wrapper">
            <h2>
              <span className="welcome-text">Welcome</span>
            </h2>
            <p>Access your diagnostic portal</p>

            <form className="login-form" onSubmit={handleSubmit}>
              {/* Role Selector */}

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
