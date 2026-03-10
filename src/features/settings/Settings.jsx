import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Upload,
  X,
  Smartphone,
  Globe,
  MapPin,
  Building2,
  Briefcase,
  Camera,
  Save,
  Trash2,
  Link as LinkIcon,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Info,
  Loader2,
  ImageIcon,
  Pencil,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../auth/AuthContext";
import { setOrganization } from "../../store/slices/authSlice";
import organizationService from "../onboarding/services/organizationService";

// Components
import FloatingField from "./components/FloatingField";
import FloatingTextarea from "./components/FloatingTextarea";
import SectionCard from "./components/SectionCard";
import Toast from "./components/Toast";
import SettingsSkeleton from "./components/SettingsSkeleton";

/* ═══════════════════════════════════════════════
   Main Settings Component
   ═══════════════════════════════════════════════ */
const Settings = () => {
  const dispatch = useDispatch();
  const { user, organization } = useAuth();
  const fileInputRef = useRef(null);
  const formRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [errors, setErrors] = useState({});
  const [dragActive, setDragActive] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    phone: "",
    websiteUrl: "",
    address: "",
    organizationId: null,
  });

  /* ── Initial data load ──────────────────────── */
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || "",
        industry: organization.industry || "",
        phone: organization.phone || "",
        websiteUrl: organization.websiteUrl || "",
        address: organization.address || "",
        organizationId: organization.organizationId || null,
      });
      if (organization.logo) setLogoPreview(organization.logo);
      setPageLoading(false);
    } else {
      const fetchCompanyInfo = async () => {
        try {
          const data = await organizationService.getAllOrganizations();

          if (data?.isSuccess && data?.value?.length > 0) {
            const currentUserId = user?.adminUserId || user?.id || 1;
            const company = data.value.find(
              (org) => (org.CreatedBy || org.createdBy) == currentUserId,
            );

            if (company) {
              const logo =
                company.companyLogoPath ||
                company.CompanyLogo ||
                company.logoPath;

              const orgData = {
                organizationId:
                  company.organizationId || company.OrganizationId || null,
                name:
                  company.legalCompanyName || company.LegalCompanyName || "",
                industry:
                  company.industrySector || company.IndustrySector || "",
                phone: company.businessPhone || company.BusinessPhone || "",
                websiteUrl:
                  company.corporateWebsite || company.CorporateWebsite || "",
                address:
                  company.registeredAddress || company.RegisteredAddress || "",
                logo,
              };

              setFormData(orgData);
              dispatch(setOrganization(orgData));
              if (logo) setLogoPreview(logo);
            }
          }
        } catch (err) {
          console.error("Failed to fetch organization info:", err);
          setToast({
            type: "error",
            message: "Could not load organization data.",
          });
        } finally {
          setPageLoading(false);
        }
      };

      fetchCompanyInfo();
    }
  }, [user, organization, dispatch]);

  /* ── Unsaved-changes guard ──────────────────── */
  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  /* ── Field change handler ───────────────────── */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsDirty(true);
    setErrors((prev) => {
      if (prev[name]) {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      }
      return prev;
    });
  }, []);

  /* ── Client-side validation ─────────────────── */
  const validate = useCallback(() => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Company name is required.";
    if (!formData.industry.trim())
      errs.industry = "Industry sector is required.";
    if (!formData.phone.trim()) {
      errs.phone = "Business phone is required.";
    } else if (!/^[+\d\s()-]{7,20}$/.test(formData.phone.trim())) {
      errs.phone = "Enter a valid phone number.";
    }
    if (
      formData.websiteUrl &&
      !/^https?:\/\/.+/.test(formData.websiteUrl.trim())
    ) {
      errs.websiteUrl = "URL must start with http:// or https://";
    }
    if (!formData.address.trim())
      errs.address = "Registered address is required.";
    return errs;
  }, [formData]);

  /* ── Logo handling ──────────────────────────── */
  const processLogoFile = useCallback((file) => {
    if (!file) return;
    const allowed = ["image/png", "image/jpeg", "image/svg+xml", "image/webp"];
    if (!allowed.includes(file.type)) {
      setToast({
        type: "error",
        message: "Please upload a PNG, JPG, SVG, or WebP image.",
      });
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setToast({ type: "error", message: "Logo file must be under 2 MB." });
      return;
    }
    setLogoFile(file);
    setIsDirty(true);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  }, []);

  const handleLogoChange = (e) => processLogoFile(e.target.files[0]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files?.[0]) processLogoFile(e.dataTransfer.files[0]);
    },
    [processLogoFile],
  );

  const removeLogo = useCallback(() => {
    setLogoPreview(null);
    setLogoFile(null);
    setIsDirty(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  /* ── Form submit ────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorField = Object.keys(validationErrors)[0];
      document.getElementById(firstErrorField)?.focus();
      return;
    }

    setLoading(true);
    setErrors({});
    setUploadProgress(0);

    try {
      const fields = {
        legalCompanyName: formData.name,
        industrySector: formData.industry,
        businessPhone: formData.phone,
        corporateWebsite: formData.websiteUrl,
        registeredAddress: formData.address,
        Status: "Active",
        companyLogoPath: organization?.logo || "",
      };

      const targetId = formData.organizationId || 1;
      const data = await organizationService.updateOrganization(
        targetId,
        fields,
        logoFile,
        (progress) => setUploadProgress(progress),
      );

      if (data.isSuccess) {
        setToast({
          type: "success",
          message: "Organization settings saved successfully.",
        });
        setIsDirty(false);
        setLogoFile(null);

        const serverData = data.value;
        const orgData = {
          organizationId:
            serverData.organizationId || serverData.OrganizationId || targetId,
          name: serverData.legalCompanyName || serverData.LegalCompanyName,
          industry: serverData.industrySector || serverData.IndustrySector,
          phone: serverData.businessPhone || serverData.BusinessPhone,
          websiteUrl:
            serverData.corporateWebsite || serverData.CorporateWebsite,
          address: serverData.registeredAddress || serverData.RegisteredAddress,
          status: serverData.status || "Active",
          logo: serverData.companyLogoPath || logoPreview,
        };
        dispatch(setOrganization(orgData));
      } else {
        setToast({
          type: "error",
          message: "Server returned an error. Please try again.",
        });
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      setToast({
        type: "error",
        message: "Failed to update settings. Please try again.",
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  /* ── Skeleton while loading ─────────────────── */
  if (pageLoading) {
    return <SettingsSkeleton />;
  }

  /* ── Main render ────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      <div className="p-4 md:p-8 lg:p-10 xl:p-12 w-full max-w-7xl mx-auto space-y-8">
        {/* ── Page header ─────────────────────── */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 flex-wrap">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl text-blue-600">
                <ShieldCheck size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-600/70">
                System Configuration
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Organization Settings
            </h1>
            <p className="text-slate-400 text-sm font-medium max-w-lg">
              Manage your corporate identity, contact details, and compliance
              defaults.
            </p>
          </div>

          {/* Save button — desktop */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 flex-wrap justify-end">
            {isDirty && (
              <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-semibold">
                Unsaved changes
              </span>
            )}
            <button
              type="submit"
              form="settings-form"
              disabled={loading || !isDirty}
              className={`
                inline-flex items-center gap-2.5 px-7 py-3 rounded-2xl
                text-xs font-bold uppercase tracking-wider
                transition-all duration-200 shadow-lg active:scale-[0.97]
                disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
                ${
                  loading
                    ? "bg-slate-800 text-white"
                    : "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-xl shadow-slate-900/25"
                }
              `}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {uploadProgress > 0
                    ? `Uploading ${uploadProgress}%`
                    : "Saving\u2026"}
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </header>

        {/* Upload progress bar */}
        {loading && uploadProgress > 0 && (
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${uploadProgress}%` }}
              role="progressbar"
              aria-valuenow={uploadProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        )}

        {/* ── Form ───────────────────────────── */}
        <form
          id="settings-form"
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >
          {/* ── Left: Logo upload ─────────────── */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <SectionCard
              icon={Camera}
              title="Visual Identity"
              subtitle="Company logo & branding"
            >
              {/* Drop zone */}
              <div
                className={`
                  relative rounded-2xl border-2 border-dashed transition-all duration-300
                  w-full h-48 sm:h-56 flex flex-col items-center justify-center overflow-hidden cursor-pointer
                  ${
                    dragActive
                      ? "border-blue-400 bg-blue-50/60 scale-[1.01]"
                      : logoPreview
                        ? "border-transparent bg-slate-50"
                        : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload company logo"
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
              >
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company logo preview"
                    className="w-full h-full object-contain p-6"
                  />
                ) : (
                  <div className="text-center space-y-3 p-6">
                    <div
                      className={`
                        p-4 rounded-2xl inline-flex transition-colors duration-200
                        ${dragActive ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-400"}
                      `}
                    >
                      <ImageIcon size={28} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-500">
                        Drop logo here or click to browse
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        PNG, JPG, SVG, or WebP &mdash; max 2 MB
                      </p>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  className="hidden"
                  accept="image/png,image/jpeg,image/svg+xml,image/webp"
                  onChange={handleLogoChange}
                  ref={fileInputRef}
                  aria-hidden="true"
                  tabIndex={-1}
                />
              </div>

              {/* Logo actions */}
              {logoPreview && (
                <div className="flex flex-wrap items-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 min-w-30 inline-flex items-center justify-center gap-2 px-4 py-2.5
                      rounded-xl border border-slate-200 text-xs font-semibold text-slate-600
                      hover:bg-slate-50 transition-colors"
                  >
                    <Pencil size={13} />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="flex-1 min-w-30 inline-flex items-center justify-center gap-2 px-4 py-2.5
                      rounded-xl border border-red-100 text-xs font-semibold text-red-500
                      hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              )}

              <p className="text-center text-[10px] text-slate-400 font-medium mt-3">
                Recommended: 512&times;512px, transparent background
              </p>
            </SectionCard>

            {/* Tip card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100/50">
              <div className="flex items-start gap-3">
                <Info size={16} className="text-blue-500 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-700 space-y-1">
                  <p className="font-bold">Tip</p>
                  <p className="text-blue-600/80 leading-relaxed">
                    These details appear on compliance documents, invoices, and
                    reports generated by the platform.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Form fields ────────────── */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Registration Details */}
            <SectionCard
              icon={Building2}
              title="Registration Details"
              subtitle="Legal entity information"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FloatingField
                  name="name"
                  label="Legal Company Name"
                  value={formData.name}
                  onChange={handleChange}
                  icon={Building2}
                  required
                  placeholder="Acme Corporation Ltd."
                  error={errors.name}
                  disabled={loading}
                />
                <FloatingField
                  name="industry"
                  label="Industry Sector"
                  value={formData.industry}
                  onChange={handleChange}
                  icon={Briefcase}
                  required
                  placeholder="e.g. Financial Technology"
                  error={errors.industry}
                  disabled={loading}
                />
              </div>
            </SectionCard>

            {/* Contact Information */}
            <SectionCard
              icon={Globe}
              title="Contact Information"
              subtitle="How partners and regulators reach you"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <FloatingField
                  name="phone"
                  label="Business Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  icon={Smartphone}
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  error={errors.phone}
                  disabled={loading}
                />
                <FloatingField
                  name="websiteUrl"
                  label="Corporate Website"
                  value={formData.websiteUrl}
                  onChange={handleChange}
                  icon={LinkIcon}
                  type="url"
                  placeholder="https://example.com"
                  error={errors.websiteUrl}
                  disabled={loading}
                />
              </div>

              <div className="mt-8">
                <FloatingTextarea
                  name="address"
                  label="Registered Address"
                  value={formData.address}
                  onChange={handleChange}
                  icon={MapPin}
                  rows={3}
                  required
                  placeholder="123 Business Ave, Suite 100, New York, NY 10001"
                  error={errors.address}
                  disabled={loading}
                />
              </div>
            </SectionCard>
          </div>
        </form>

        {/* ── Mobile sticky save ──────────────── */}
        <div className="sm:hidden fixed bottom-0 inset-x-0 p-4 bg-white/90 backdrop-blur-lg border-t border-slate-100 z-40">
          <button
            type="submit"
            form="settings-form"
            disabled={loading || !isDirty}
            className={`
              w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl
              text-xs font-bold uppercase tracking-wider
              transition-all duration-200 shadow-lg
              disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none
              ${
                loading
                  ? "bg-slate-800 text-white"
                  : "bg-slate-900 text-white active:scale-[0.97]"
              }
            `}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {uploadProgress > 0
                  ? `Uploading ${uploadProgress}%`
                  : "Saving\u2026"}
              </>
            ) : (
              <>
                <Save size={16} />
                Save Changes
                {isDirty && (
                  <span className="ml-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                )}
              </>
            )}
          </button>
        </div>

        {/* Bottom spacer for mobile sticky bar */}
        <div className="h-20 sm:hidden" aria-hidden="true" />
      </div>
    </div>
  );
};

export default Settings;
