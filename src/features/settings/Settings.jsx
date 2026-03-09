import React, { useState, useEffect, useRef } from "react";
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
} from "lucide-react";
import { useDispatch } from "react-redux";
import { useAuth } from "../../auth/AuthContext";
import { setOrganization } from "../../store/slices/authSlice";
import organizationService from "../onboarding/services/organizationService";
import ImageWithFallback from "../../components/ui/ImageWithFallback";

const Settings = () => {
  const dispatch = useDispatch();
  const { user, organization } = useAuth();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    phone: "",
    websiteUrl: "",
    address: "",
    organizationId: null,
  });

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
    } else {
      const fetchCompanyInfo = async () => {
        setLoading(true);
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
        } finally {
          setLoading(false);
        }
      };

      fetchCompanyInfo();
    }
  }, [user, organization, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError(null);
    setUploadProgress(0);

    try {
      const fields = {
        legalCompanyName: formData.name,
        industrySector: formData.industry,
        businessPhone: formData.phone,
        corporateWebsite: formData.websiteUrl,
        registeredAddress: formData.address,
        Status: "Active",
        companyLogoPath: organization?.logo || "", // Default to existing logo URL
      };

      const targetId = formData.organizationId || 1;
      const data = await organizationService.updateOrganization(
        targetId,
        fields,
        logoFile,
        (progress) => setUploadProgress(progress),
      );

      if (data.isSuccess) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);

        // Update Redux state
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
      }
    } catch (err) {
      console.error("Error updating settings:", err);
      setError("Failed to update settings. Please try again.");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

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

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl flex items-center justify-between">
          <span className="font-bold text-sm">{error}</span>
          <button onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      <form
        id="settings-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
      >
        {/* Left Column: Branding */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <Camera size={20} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                Visual Identity
              </h3>
            </div>

            <div className="relative group">
              <div className="aspect-square w-full bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center overflow-hidden group-hover:border-indigo-300 transition-all">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Company Logo"
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="p-4 bg-white rounded-2xl shadow-sm inline-block text-slate-300">
                      <Upload size={32} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                      Upload Logo
                    </p>
                  </div>
                )}
                <label className="absolute inset-0 cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleLogoChange}
                    ref={fileInputRef}
                  />
                </label>
              </div>

              {logoPreview && (
                <button
                  type="button"
                  onClick={() => setLogoPreview(null)}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-rose-500 shadow-md hover:bg-rose-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <p className="text-[10px] text-slate-400 font-medium italic leading-relaxed text-center">
              Recommended: 512x512px SVG or transparent PNG.
              <br />
              Max size: 2MB.
            </p>
          </div>
        </div>

        {/* Right Column: Information */}
        <div className="lg:col-span-8 space-y-8">
          {/* General Information */}
          <div className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
              <Building2 size={20} className="text-indigo-600" />
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">
                Registration Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Legal Company Name
                </label>
                <div className="relative group">
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    placeholder="Enter full legal name"
                    required
                  />
                  <Building2
                    size={16}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Industry Sector
                </label>
                <div className="relative group">
                  <input
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    placeholder="e.g. Technology"
                    required
                  />
                  <Briefcase
                    size={16}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Business Phone
                </label>
                <div className="relative group">
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                  <Smartphone
                    size={16}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Corporate Website
                </label>
                <div className="relative group">
                  <input
                    name="websiteUrl"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                    placeholder="https://example.com"
                  />
                  <LinkIcon
                    size={16}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Registered Address
                </label>
                <div className="relative group">
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-6 py-6 font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none"
                    placeholder="Street, City, State, Country"
                    required
                  />
                  <MapPin
                    size={18}
                    className="absolute right-6 top-8 text-slate-300 group-focus-within:text-indigo-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
