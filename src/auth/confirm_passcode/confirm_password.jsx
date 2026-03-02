import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../authService";
import "../login.css";
import passwordImg from "../../assets/password1.jpg";


const ConfirmPassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await changePassword(oldPassword, newPassword);
            setSuccess(true);

            // Redirect after a short delay
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err) {
            console.error("Password update failed", err);
            setError(err.response?.data?.message || "Failed to update password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">
            <div className="login-container">
                {/* Branding Section */}
                <section
                    className="login-left"
                    style={{ backgroundImage: `url(${passwordImg})` }}
                >

                </section>

                {/* Form Section */}
                <section className="login-right">
                    <div className="login-form-wrapper">
                        <h2 className="welcome-text">Update Password</h2>
                        <p className="welcome-subtext">Set a new secure password for your portal</p>

                        {error && (
                            <div className="error-message" role="alert">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="success-message" role="alert">
                                Password updated successfully! Redirecting to login...
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="login-form">
                            <div className="form-group">
                                <label htmlFor="oldPassword">Old Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="oldPassword"
                                        type={showOldPassword ? "text" : "password"}
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                        disabled={loading || success}
                                        required
                                        placeholder="Enter current password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowOldPassword(!showOldPassword)}
                                        tabIndex="-1"
                                    >
                                        {showOldPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        disabled={loading || success}
                                        required
                                        placeholder="Enter new password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        tabIndex="-1"
                                    >
                                        {showNewPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <div className="password-input-wrapper">
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        disabled={loading || success}
                                        required
                                        placeholder="Confirm new password"
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        tabIndex="-1"
                                    >
                                        {showConfirmPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="login-btn"
                                disabled={loading || success}
                            >
                                {loading ? (
                                    <>
                                        <div className="spinner"></div>
                                        <span>Updating...</span>
                                    </>
                                ) : (
                                    "Update Password"
                                )}
                            </button>
                        </form>

                        <p className="support-text">
                            Back to <a href="/login">Login</a>
                        </p>
                    </div>
                </section>
            </div>
        </main>
    );
};

export default ConfirmPassword;
