import React, { useState, useEffect, useRef } from "react";
import { Upload, X, CheckCircle, Smartphone, Globe, MapPin, Building2, Briefcase } from "lucide-react";
import { db } from "../../db";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../auth/api";
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
      setLoading(true);
      try {
        // 1. Try to fetch from remote API first
        console.log("Fetching organization info from server...");
        const response = await api.get("/Organization/GetAllOrganization");

        if (response.data && response.data.isSuccess && response.data.value && response.data.value.length > 0) {
          const company = response.data.value[0]; // Take the first one for onboarding
          console.log("Server organization found:", company);

          setFormData({
            name: company.LegalCompanyName || company.legalCompanyName || "",
            industry: company.IndustrySector || company.industrySector || "",
            phone: company.BusinessPhone || company.businessPhone || "",
            websiteUrl: company.CorporateWebsite || company.corporateWebsite || "",
            address: company.RegisteredAddress || company.registeredAddress || "",
          });

          // Sync to local Dexie
          await db.company_info.clear();
          await db.company_info.add({
            organizationId: company.OrganizationId || company.organizationId,
            name: company.LegalCompanyName || company.legalCompanyName,
            industry: company.IndustrySector || company.industrySector,
            phone: company.BusinessPhone || company.businessPhone,
            websiteUrl: company.CorporateWebsite || company.corporateWebsite,
            address: company.RegisteredAddress || company.registeredAddress,
            logo: company.CompanyLogo || company.logoPath,
            createdAt: company.CreatedAt || company.createdAt,
          });

          const logo = company.CompanyLogo || company.logoPath;
          if (logo) {
            setLogoPreview(logo);
          }
        } else {
          // 2. Fallback to local Dexie if server is empty
          console.log("No organization on server, checking local database...");
          const localInfo = await db.company_info.toArray();
          if (localInfo && localInfo.length > 0) {
            const company = localInfo[0];
            setFormData({
              name: company.name || "",
              industry: company.industry || "",
              phone: company.phone || "",
              websiteUrl: company.websiteUrl || "",
              address: company.address || "",
            });
            if (company.logo) setLogoPreview(company.logo);
          }
        }
      } catch (error) {
        console.error("Failed to fetch organization info", error);
        // Fallback to local Dexie on network error
        const localInfo = await db.company_info.toArray();
        if (localInfo && localInfo.length > 0) {
          const company = localInfo[0];
          setFormData({
            name: company.name || "",
            industry: company.industry || "",
            phone: company.phone || "",
            websiteUrl: company.websiteUrl || "",
            address: company.address || "",
          });
          if (company.logo) setLogoPreview(company.logo);
        }
      } finally {
        setLoading(false);
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

  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Text fields (PascalCase)
      formDataToSend.append("LegalCompanyName", formData.name);
      formDataToSend.append("IndustrySector", formData.industry);
      formDataToSend.append("BusinessPhone", formData.phone);
      formDataToSend.append("CorporateWebsite", formData.websiteUrl);
      formDataToSend.append("RegisteredAddress", formData.address);
      formDataToSend.append("CreatedBy", user?.adminUserId || user?.id || 1);

      // Handle Logo - Must be a File object for multipart/form-data
      if (fileInputRef.current?.files[0]) {
        // Use the newly uploaded file
        formDataToSend.append("CompanyLogo", fileInputRef.current.files[0]);
      } else if (logoPreview && logoPreview.startsWith("data:")) {
        // Convert existing base64 preview back to a file
        const res = await fetch(logoPreview);
        const blob = await res.blob();
        const file = new File([blob], "logo.png", { type: blob.type });
        formDataToSend.append("CompanyLogo", file);
      } else {
        // If absolutely no logo, we have to send something or the server fails
        // Providing a tiny transparent 1x1 pixel blob as a fallback if logo is "required"
        const pixel = atob("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=");
        const array = new Uint8Array(pixel.length);
        for (let i = 0; i < pixel.length; i++) array[i] = pixel.charCodeAt(i);
        const blob = new Blob([array], { type: "image/png" });
        formDataToSend.append("CompanyLogo", blob, "logo.png");
      }

      console.log("Submitting Onboarding via FormData (with Logo File)...");

      const response = await api.post("/Organization/CreateOrganization", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.isSuccess) {
        console.log("Organization created successfully on server");

        // 3. Sync with local Dexie database for offline/quick access
        const serverData = response.data.value;
        await db.company_info.clear();
        await db.company_info.add({
          organizationId: serverData.organizationId,
          name: serverData.legalCompanyName,
          industry: serverData.industrySector,
          phone: serverData.businessPhone,
          websiteUrl: serverData.corporateWebsite,
          address: serverData.registeredAddress,
          logo: logoPreview, // Keep local preview
          createdAt: serverData.createdAt,
        });

        navigate("/");
      } else {
        throw new Error(response.data.error || "Failed to create organization");
      }
    } catch (error) {
      console.error("Error saving company info:", error);
      if (error.response) {
        console.error("Server Response Data:", error.response.data);
        console.error("Server Response Status:", error.response.status);
        alert(`Server Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert(error.message || "Failed to save company information. Please try again.");
      }
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
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden-input"
                      accept="image/*"
                      onChange={handleLogoChange}
                    />
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
