import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../db";
import { uploadFile } from "../../services/documentService";
import { ImageIcon, X, Upload } from "lucide-react";
import "./onboarding.css";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    phone: "",
    address: "",
    websiteUrl: "",
    scope: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("Logo file is too large. Please select a file smaller than 2MB.");
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let logoUrl = "";
      if (logoFile) {
        setIsUploadingLogo(true);
        const uploadResult = await uploadFile(logoFile);
        logoUrl = uploadResult.fileUrl;
        setIsUploadingLogo(false);
      }

      await db.company_info.add({
        ...formData,
        logo: logoUrl,
        createdAt: new Date().toISOString(),
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to save company information:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setIsUploadingLogo(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <div className="onboarding-header">
          <h1>Organization Setup</h1>
          <p>Provide your company details to align with ISO standards.</p>
        </div>

        <form onSubmit={handleSubmit} className="onboarding-form">
          {/* Logo Upload Section (Optional) */}
          <div className="form-group logo-upload-group">
            <label>Company Logo (Optional)</label>
            <div className="logo-upload-container">
              {logoPreview ? (
                <div className="logo-preview-wrapper animate-in fade-in zoom-in duration-300">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="logo-preview"
                  />
                  <button
                    type="button"
                    className="remove-logo-btn"
                    onClick={removeLogo}
                    aria-label="Remove logo"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="logo-placeholder">
                  <input
                    type="file"
                    className="hidden-input"
                    accept="image/*"
                    onChange={handleLogoChange}
                  />
                  <div className="logo-placeholder-content">
                    <div className="icon-circle">
                      <Upload className="placeholder-icon" />
                    </div>
                    <span>Upload Logo</span>
                    <p>SVG, PNG, JPG (max. 2MB)</p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Company Name*</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Acme Diagnostics"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="industry">Industry / Sector*</label>
              <input
                id="industry"
                name="industry"
                type="text"
                placeholder="e.g. Healthcare, Laboratory"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone Number*</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 234 567 890"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
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
          </div>

          <div className="form-group">
            <label htmlFor="address">Registered Address*</label>
            <textarea
              id="address"
              name="address"
              placeholder="Full official address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="scope">Scope of Registration / Services*</label>
            <textarea
              id="scope"
              name="scope"
              placeholder="Describe the scope of your QMS (e.g., Provision of diagnostic laboratory services)"
              value={formData.scope}
              onChange={handleChange}
              required
            />
          </div> */}

          <button type="submit" className="onboarding-btn" disabled={loading}>
            {loading ? "Finalizing Setup..." : "Complete ISO Setup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
