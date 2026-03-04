import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  X,
  Smartphone,
  Globe,
  MapPin,
  Building2,
  Briefcase,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { setOrganization } from "../../store/slices/authSlice";
import organizationService from "./services/organizationService";
import "./onboarding.css";
import ImageWithFallback from "../../components/ui/ImageWithFallback";

const OnboardingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, organization } = useAuth();

  useEffect(() => {
    // If organization is already set, we don't need onboarding
    if (organization) {
      navigate("/dashboard", { replace: true });
    }
  }, [organization, navigate]);

  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [logoPreview, setLogoPreview] = useState(null); // base64 for display only
  const [logoFile, setLogoFile] = useState(null); // actual File object for upload
  const [error, setError] = useState(null);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    phone: "",
    websiteUrl: "",
    address: "",
  });

  // ── Load existing org on mount ──────────────────────────────────────────────
  useEffect(() => {
    const fetchCompanyInfo = async () => {
      setLoading(true);
      try {
        const orgResponse = await organizationService.getAllOrganizations();
        let company = null;

        if (Array.isArray(orgResponse)) {
          const targetId = user?.organizationId;
          company = orgResponse.find(
            (org) => (org.organizationId || org.OrganizationId) == targetId,
          );
        } else if (orgResponse?.isSuccess && orgResponse?.value?.length > 0) {
          const targetId = user?.organizationId;
          company = orgResponse.value.find(
            (org) => (org.organizationId || org.OrganizationId) == targetId,
          );
        }

        // Fallback to searching by createdBy if organizationId isn't found
        if (
          !company &&
          (Array.isArray(orgResponse) || orgResponse?.isSuccess)
        ) {
          const dataList = Array.isArray(orgResponse)
            ? orgResponse
            : orgResponse.value;
          const currentUserId = user?.adminUserId || user?.id || 1;
          company = dataList.find(
            (org) => (org.createdBy || org.CreatedBy) == currentUserId,
          );
        }

        if (company) {
          setFormData({
            name: company.legalCompanyName || "",
            industry: company.industrySector || "",
            phone: company.businessPhone || "",
            websiteUrl: company.corporateWebsite || "",
            address: company.registeredAddress || "",
          });

          // logoPath is the correct field — backend returns this
          const logo = company.logoPath || company.companyLogoPath || null;
          if (logo) setLogoPreview(logo);
        }
      } catch (err) {
        console.error("Failed to fetch organization info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyInfo();
  }, [user, dispatch]);

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError("File size exceeds 2MB. Please choose a smaller image.");
      return;
    }

    // Store the actual File object — needed for Worker upload
    setLogoFile(file);

    // Generate preview for display only
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setLogoFile(null);
    // Reset the file input so the same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const fields = {
        legalCompanyName: formData.name,
        industrySector: formData.industry,
        businessPhone: formData.phone,
        corporateWebsite: formData.websiteUrl,
        registeredAddress: formData.address,
      };

      /**
       * organizationService.createOrganization handles the two-step flow:
       *   Step 1 — if logoFile provided: upload to R2 via Worker → get fileUrl
       *   Step 2 — POST JSON to backend with companyLogoPath = fileUrl
       *
       * logoFile can be null — companyLogoPath will be "" if no logo provided
       */
      const data = await organizationService.createOrganization(
        fields,
        logoFile, // File object or null
        (progress) => {
          setUploadProgress(progress);
        },
      );

      if (data?.isSuccess) {
        const serverData = data.value;

        dispatch(
          setOrganization({
            organizationId: serverData?.organizationId,
            name: serverData?.legalCompanyName,
            industry: serverData?.industrySector,
            phone: serverData?.businessPhone,
            websiteUrl: serverData?.corporateWebsite,
            address: serverData?.registeredAddress,
            logo: serverData?.companyLogoPath || logoPreview,
            createdAt: serverData?.createdAt,
          }),
        );

        navigate("/");
      } else {
        throw new Error(data?.error || "Failed to create organization");
      }
    } catch (err) {
      console.error("Error saving company info:", err);
      setError(
        err.message || "Failed to save company information. Please try again.",
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="onboarding-page">
      <div className="onboarding-container">
        <header className="onboarding-header">
          <div className="header-content">
            <h1>Organization Profile</h1>
            <p>
              Configure your corporate identity to meet ISO compliance
              standards.
            </p>
          </div>
          <button
            type="submit"
            form="onboarding-form"
            className="onboarding-btn primary"
            disabled={loading}
          >
            {loading
              ? uploadProgress > 0
                ? `Uploading logo... ${uploadProgress}%`
                : "Processing..."
              : "Save & Continue"}
          </button>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button type="button" onClick={() => setError(null)}>
              ✕
            </button>
          </div>
        )}

        <form
          id="onboarding-form"
          onSubmit={handleSubmit}
          className="onboarding-form"
        >
          {/* Section 1: Brand Identity */}
          <section className="form-section">
            <div className="section-info">
              <h3>Brand Identity</h3>
              <p>
                This logo will appear on all generated ISO documentation and
                reports.
              </p>
            </div>
            <div className="section-fields">
              <div className="logo-horizontal-upload">
                {logoPreview ? (
                  <div className="logo-preview-wrapper">
                    <ImageWithFallback
                      src={logoPreview}
                      alt="Company Logo Preview"
                      className="logo-preview"
                    />
                    <button
                      type="button"
                      className="remove-logo-btn"
                      onClick={removeLogo}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="logo-dropzone">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden-input"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={handleLogoChange}
                    />
                    <Upload size={20} />
                    <div>
                      <span className="upload-link">Click to upload</span> or
                      drag and drop
                      <p className="upload-hint">PNG, JPG or WebP (max. 2MB)</p>
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
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="industry">Industry Sector</label>
                  <div className="input-wrapper">
                    <Briefcase size={16} className="field-icon" />
                    <input
                      id="industry"
                      name="industry"
                      type="text"
                      value={formData.industry}
                      onChange={handleChange}
                      required
                      placeholder="Manufacturing"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Business Phone</label>
                  <div className="input-wrapper">
                    <Smartphone size={16} className="field-icon" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="websiteUrl">Corporate Website</label>
                  <div className="input-wrapper">
                    <Globe size={16} className="field-icon" />
                    <input
                      id="websiteUrl"
                      name="websiteUrl"
                      type="url"
                      value={formData.websiteUrl}
                      onChange={handleChange}
                      placeholder="https://"
                    />
                  </div>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">Registered Address</label>
                  <div className="input-wrapper textarea-wrapper">
                    <MapPin size={16} className="field-icon" />
                    <textarea
                      id="address"
                      name="address"
                      rows="3"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
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
