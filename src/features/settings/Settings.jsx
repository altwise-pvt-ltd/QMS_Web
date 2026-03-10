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
  ChevronRight,
  Eye,
  Loader2,
  ImageIcon,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../auth/AuthContext";
import { setOrganization } from "../../store/slices/authSlice";
import organizationService from "../onboarding/services/organizationService";

/* ─────────────────────────────────────────────
   Reusable: Floating-label input with icon
   ───────────────────────────────────────────── */
const FloatingField = ({
  name,
  label,
  value,
  onChange,
  icon: Icon,
  type = "text",
  required = false,
  placeholder = "",
  error = "",
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isActive = focused || hasValue;

  return (
    <div className="relative group pt-2">
      {/* Floating label */}
      <label
        htmlFor={name}
        className={`
          absolute left-5 transition-all duration-200 pointer-events-none z-10 font-semibold
          ${
            isActive
              ? "-top-2.5 text-[10px] tracking-wider uppercase px-2 bg-white"
              : "top-4 text-sm"
          }
          ${
            error
              ? "text-red-500"
              : focused
                ? "text-blue-600"
                : "text-slate-400"
          }
        `}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          placeholder={focused ? placeholder : ""}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
          className={`
            w-full rounded-2xl px-5 py-4 pr-12 text-sm font-semibold text-slate-800
            border-2 bg-white transition-all duration-200 outline-none
            placeholder:text-slate-300 placeholder:font-normal
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-200"
            }
          `}
        />
        {Icon && (
          <Icon
            size={16}
            className={`absolute right-5 top-1/2 -translate-y-1/2 transition-colors duration-200
              ${error ? "text-red-400" : focused ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400"}`}
          />
        )}
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 ml-1 text-xs font-medium text-red-500 flex items-center gap-1 animate-in slide-in-from-top-1 duration-200"
          role="alert"
        >
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Reusable: Floating-label textarea with icon
   ───────────────────────────────────────────── */
const FloatingTextarea = ({
  name,
  label,
  value,
  onChange,
  icon: Icon,
  rows = 4,
  required = false,
  placeholder = "",
  error = "",
  disabled = false,
}) => {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  const isActive = focused || hasValue;

  return (
    <div className="relative group pt-2">
      <label
        htmlFor={name}
        className={`
          absolute left-5 transition-all duration-200 pointer-events-none z-10 font-semibold
          ${
            isActive
              ? "-top-2.5 text-[10px] tracking-wider uppercase px-2 bg-white"
              : "top-4 text-sm"
          }
          ${
            error
              ? "text-red-500"
              : focused
                ? "text-blue-600"
                : "text-slate-400"
          }
        `}
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          rows={rows}
          disabled={disabled}
          placeholder={focused ? placeholder : ""}
          aria-required={required}
          aria-invalid={!!error}
          className={`
            w-full rounded-2xl px-5 py-4 pr-12 text-sm font-semibold text-slate-800
            border-2 bg-white transition-all duration-200 outline-none resize-none
            placeholder:text-slate-300 placeholder:font-normal
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              error
                ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                : "border-slate-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-200"
            }
          `}
        />
        {Icon && (
          <Icon
            size={16}
            className={`absolute right-5 top-5 transition-colors duration-200
              ${error ? "text-red-400" : focused ? "text-blue-500" : "text-slate-300 group-hover:text-slate-400"}`}
          />
        )}
      </div>

      {error && (
        <p
          id={`${name}-error`}
          className="mt-1.5 ml-1 text-xs font-medium text-red-500 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
};

/* ─────────────────────────────────────────────
   Section wrapper
   ───────────────────────────────────────────── */
const SectionCard = ({
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
}) => (
  <section
    className={`bg-white rounded-3xl border border-slate-100 shadow-sm
      shadow-slate-100/50 overflow-hidden transition-shadow duration-300
      hover:shadow-md hover:shadow-slate-100/80 ${className}`}
  >
    <div className="px-6 py-5 md:px-8 md:py-6 border-b border-slate-50 flex items-center gap-3">
      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-600 shrink-0">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <h3 className="text-sm font-bold text-slate-800 tracking-wide">
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs text-slate-400 font-medium mt-0.5 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    <div className="p-6 md:p-8">{children}</div>
  </section>
);

/* ─────────────────────────────────────────────
   Toast notification
   ───────────────────────────────────────────── */
const Toast = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    error: "bg-red-50 border-red-200 text-red-700",
  };
  const icons = {
    success: <CheckCircle2 size={18} />,
    error: <AlertCircle size={18} />,
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5
        rounded-2xl border shadow-lg font-semibold text-sm
        animate-in slide-in-from-top-4 fade-in duration-300
        ${styles[type]}
      `}
    >
      {icons[type]}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </div>
  );
};

/* ─────────────────────────────────────────────
   Main Settings Component
   ───────────────────────────────────────────── */
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
    // Clear field error on edit
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
      // Scroll to first error
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

  /* ── Skeleton loader ────────────────────────── */
  if (pageLoading) {
    return (
      <div className="p-4 md:p-8 lg:p-12 w-full max-w-6xl mx-auto space-y-8">
        <div className="h-8 w-64 bg-slate-100 rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-slate-50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          <div className="h-80 bg-slate-50 rounded-3xl animate-pulse" />
          <div className="lg:col-span-2 h-96 bg-slate-50 rounded-3xl animate-pulse" />
  return (
    <div className="p-4 md:p-8 lg:p-12 w-full space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 border-b border-slate-100 pb-10 px-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <ShieldCheck size={20} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600/60">
              System Configuration
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-none">
            Organization{" "}
            <span className="text-indigo-600 italic">Settings</span>
          </h1>
          <p className="text-slate-500 font-medium italic">
            Manage your corporate identity and system-wide compliance defaults.
          </p>
        </div>

        <div className="w-full xl:w-auto">
          <button
            type="submit"
            form="settings-form"
            disabled={loading}
            className={`flex items-center justify-center gap-3 px-10 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95 w-full xl:w-auto ${success
              ? "bg-indigo-500 grey-600 shadow-indigo-500/20"
              : "bg-slate-900 grey-600 hover:bg-black shadow-slate-900/20"
              }`}
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : success ? (
              <CheckCircle2 size={18} />
            ) : (
              <Save size={18} />
            )}
            {loading
              ? uploadProgress > 0
                ? `Uploading... ${uploadProgress}%`
                : "Saving..."
              : success
                ? "Updated Profile"
                : "Update Profile"}
          </button>
        </div>
      </div>
    );
  }

  /* ── Render ─────────────────────────────────── */
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

          {/* Action buttons — desktop */}
          <div className="hidden sm:flex items-center gap-3 shrink-0 flex-wrap justify-end">
            {isDirty && (
              <span className="text-xs text-amber-600 bg-amber-50 px-3 py-1.5 rounded-full font-semibold animate-in fade-in duration-300">
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
                    : "Saving…"}
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

        {/* Upload progress bar (visible during save) */}
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

        {/* ── Main form ──────────────────────── */}
        <form
          id="settings-form"
          ref={formRef}
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start"
        >
          {/* ── Left column: Logo ─────────────── */}
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
                  aspect-square flex flex-col items-center justify-center overflow-hidden cursor-pointer
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
                    className="w-full h-full object-contain p-8"
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
                        PNG, SVG, or WebP — max 2 MB
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
                <div className="flex items-center gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5
                      rounded-xl border border-slate-200 text-xs font-semibold text-slate-600
                      hover:bg-slate-50 transition-colors"
                  >
                    <Pencil size={13} />
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5
                      rounded-xl border border-red-100 text-xs font-semibold text-red-500
                      hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={13} />
                    Remove
                  </button>
                </div>
              )}

              <p className="text-center text-[10px] text-slate-400 font-medium mt-3">
                Recommended: 512×512px, transparent background
              </p>
            </SectionCard>

            {/* Quick info card */}
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

          {/* ── Right column: Fields ──────────── */}
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

              <div className="mt-6">
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

        {/* ── Mobile sticky save button ───────── */}
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
                  : "Saving…"}
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

        {/* Spacer for mobile sticky button */}
        <div className="h-20 sm:hidden" />
      </div>
    </div>
  );
};

export default Settings;
