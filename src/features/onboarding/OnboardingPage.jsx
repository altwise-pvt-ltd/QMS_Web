import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../db";
import "./onboarding.css";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    websiteUrl: "",
    socialMediaUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await db.company_info.add({
        ...formData,
        createdAt: new Date().toISOString(),
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save company information:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1>Welcome to QMS</h1>
          <p>Let's set up your company profile to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="name">Company Name*</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter company name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address*</label>
            <textarea
              id="address"
              name="address"
              placeholder="Enter company address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="websiteUrl">Website URL</label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                placeholder="https://example.com"
                value={formData.websiteUrl}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="socialMediaUrl">Social Media URL</label>
              <input
                id="socialMediaUrl"
                name="socialMediaUrl"
                type="url"
                placeholder="https://linkedin.com/company/example"
                value={formData.socialMediaUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="onboarding-btn" disabled={loading}>
            {loading ? "Saving..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
