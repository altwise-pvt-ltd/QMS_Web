import React, { useState, useEffect } from "react";
import { Upload, X, CheckCircle, Smartphone, Globe, MapPin, Building2, Briefcase } from "lucide-react";
import { db } from "../../db";
import { useNavigate } from "react-router-dom";
import "./onboarding.css";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    phone: "",
    websiteUrl: "",
    address: "",
  });

  useEffect(() => {
    const fetchCompanyInfo = async () => {
      try {
        const info = await db.company_info.toArray();
        if (info && info.length > 0) {
          const company = info[0];
          setFormData({
            name: company.name || "",
            industry: company.industry || "",
            phone: company.phone || "",
            websiteUrl: company.websiteUrl || "",
            address: company.address || "",
          });
          if (company.logo) {
            setLogoPreview(company.logo);
          }
        }
      } catch (error) {
        console.error("Failed to fetch company info", error);
      }
    };
    fetchCompanyInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Clear existing info to ensure only one record
      await db.company_info.clear();
      
      await db.company_info.add({
        ...formData,
        logo: logoPreview,
        createdAt: new Date().toISOString(),
      });

      console.log("Company info saved successfully");
      // Navigate to dashboard or home after successful onboarding
      navigate("/"); 
    } catch (error) {
      console.error("Error saving company info:", error);
      alert("Failed to save company information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <header className="onboarding-header">
          <div className="header-content">
            <h1>Organization Profile</h1>
            <p>Configure your corporate identity to meet ISO compliance standards.</p>
          </div>
          <button type="submit" form="onboarding-form" className="onboarding-btn primary" disabled={loading}>
            {loading ? "Processing..." : "Save & Continue"}
          </button>
        </header>

        <form id="onboarding-form" onSubmit={handleSubmit} className="onboarding-form">
          
          {/* Section 1: Brand Identity */}
          <section className="form-section">
            <div className="section-info">
              <h3>Brand Identity</h3>
              <p>This logo will appear on all generated ISO documentation and reports.</p>
            </div>
            <div className="section-fields">
              <div className="logo-horizontal-upload">
                {logoPreview ? (
                  <div className="logo-preview-wrapper">
                    <img src={logoPreview} alt="Preview" className="logo-preview" />
                    <button type="button" className="remove-logo-btn" onClick={removeLogo}><X size={14} /></button>
                  </div>
                ) : (
                  <label className="logo-dropzone">
                    <input type="file" className="hidden-input" accept="image/*" onChange={handleLogoChange} />
                    <Upload size={20} />
                    <div>
                      <span className="upload-link">Click to upload</span> or drag and drop
                      <p className="upload-hint">PNG, JPG or SVG (max. 2MB)</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </section>

          <hr className="section-divider" />

          {/* Section 2: General Information */}
          <section className="form-section">
            <div className="section-info">
              <h3>General Information</h3>
              <p>Official registration details for your organization.</p>
            </div>
            <div className="section-fields">
              <div className="field-grid">
                <div className="form-group">
                  <label htmlFor="name">Legal Company Name</label>
                  <div className="input-wrapper">
                    <Building2 size={16} className="field-icon" />
                    <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required placeholder="Acme Corp" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="industry">Industry Sector</label>
                  <div className="input-wrapper">
                    <Briefcase size={16} className="field-icon" />
                    <input id="industry" name="industry" type="text" value={formData.industry} onChange={handleChange} required placeholder="Manufacturing" />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Business Phone</label>
                  <div className="input-wrapper">
                    <Smartphone size={16} className="field-icon" />
                    <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="websiteUrl">Corporate Website</label>
                  <div className="input-wrapper">
                    <Globe size={16} className="field-icon" />
                    <input id="websiteUrl" name="websiteUrl" type="url" value={formData.websiteUrl} onChange={handleChange} placeholder="https://" />
                  </div>
                </div>
                <div className="form-group full-width">
                  <label htmlFor="address">Registered Address</label>
                  <div className="input-wrapper textarea-wrapper">
                    <MapPin size={16} className="field-icon" />
                    <textarea id="address" name="address" rows="3" value={formData.address} onChange={handleChange} required />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};
export default OnboardingPage;
