import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Shield,
  Save,
  Search,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { PERMISSION_DATA } from "./permision_data";

/**
 * PermissionManagement Component
 * Provides a clean, accordion-style interface for managing user access rights.
 * 
 * Logic:
 * - Module toggle ON/OFF toggles all sub-features.
 * - Any sub-feature toggle ON auto-enables the parent module.
 */
const PermissionsPage = ({ staff = null, standalone = true }) => {
  // Initialize state with dynamic JSON data
  const [permissions, setPermissions] = useState(PERMISSION_DATA.permissions);
  const [expandedModules, setExpandedModules] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: string }

  // Toggle module expansion state
  const toggleAccordion = (moduleKey, isEnabled) => {
    if (!isEnabled) return; // Prevent opening if toggle is off
    setExpandedModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  /**
   * Handle Module Level Toggle
   * Toggling a module updates all its children features.
   */
  const handleModuleToggle = (moduleKey, isEnabled) => {
    setPermissions((prev) =>
      prev.map((module) => {
        if (module.key === moduleKey) {
          return {
            ...module,
            enabled: isEnabled,
            features: module.features.map((feature) => ({
              ...feature,
              enabled: isEnabled,
            })),
          };
        }
        return module;
      })
    );

    // Auto-open if enabled, auto-close if disabled
    setExpandedModules((prev) => ({
      ...prev,
      [moduleKey]: isEnabled,
    }));
  };

  /**
   * Handle Feature Level Toggle
   * Toggling a feature affects the parent module state.
   */
  const handleFeatureToggle = (moduleKey, featureKey, isEnabled) => {
    setPermissions((prev) =>
      prev.map((module) => {
        if (module.key === moduleKey) {
          const updatedFeatures = module.features.map((feature) =>
            feature.key === featureKey ? { ...feature, enabled: isEnabled } : feature
          );

          // If any feature is ON, the parent module MUST be enabled
          const shouldModuleBeEnabled = isEnabled || updatedFeatures.some((f) => f.enabled);

          return {
            ...module,
            enabled: shouldModuleBeEnabled,
            features: updatedFeatures,
          };
        }
        return module;
      })
    );
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Saving Permissions:", permissions);
      setIsSaving(false);
      setStatus({ type: "success", message: "Permissions updated successfully!" });
      setTimeout(() => setStatus(null), 3000);
    }, 1000);
  };

  // Filter modules based on search
  const filteredPermissions = permissions.filter((module) =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.features.some(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className={`font-sans ${standalone ? 'min-h-screen bg-slate-50 p-6' : 'p-2'}`}>
      <div className={`space-y-6 ${standalone ? 'max-w-4xl mx-auto' : ''}`}>

        {/* Header Section - Only show if standalone */}
        {standalone && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Shield className="text-indigo-600" size={28} />
                Access Control & Permissions
              </h1>
              <p className="text-slate-500 mt-1">Configure module-level access and granular feature rights.</p>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search modules..."
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-full md:w-64 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Search for embedded mode */}
        {!standalone && (
          <div className="relative max-w-sm mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search permissions..."
              className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/10 w-full transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Status Notification */}
        {status && (
          <div className={`p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
            }`}>
            {status.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="text-sm font-medium">{status.message}</span>
          </div>
        )}

        {/* Modules List */}
        <div className="space-y-3">
          {filteredPermissions.map((module) => (
            <div
              key={module.key}
              className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${expandedModules[module.key] ? 'border-indigo-200 shadow-lg shadow-indigo-100/50' : 'border-slate-200 shadow-sm hover:border-slate-300'
                }`}
            >
              {/* Module Header */}
              <div className="p-4 flex items-center justify-between gap-4 select-none">
                <div
                  className={`flex items-center gap-3 flex-1 ${module.enabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                  onClick={() => toggleAccordion(module.key, module.enabled)}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${module.enabled ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                    {expandedModules[module.key] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{module.name}</h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {module.features.length} sub-features available
                    </p>
                  </div>
                </div>

                {/* Module Toggle */}
                <div className="flex items-center gap-3 pr-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${module.enabled ? 'text-indigo-600' : 'text-slate-400'}`}>
                    {module.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={module.enabled}
                      onChange={(e) => handleModuleToggle(module.key, e.target.checked)}
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {/* Collapsible Features Content */}
              {expandedModules[module.key] && (
                <div className="bg-slate-50/50 px-4 pb-4 border-t border-slate-100 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {module.features.map((feature) => (
                      <div
                        key={feature.key}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all ${feature.enabled
                          ? 'bg-white border-indigo-100 shadow-sm'
                          : 'bg-slate-50 border-slate-200 opacity-70'
                          }`}
                      >
                        <span className={`text-sm font-medium ${feature.enabled ? 'text-slate-700' : 'text-slate-500'}`}>
                          {feature.name}
                        </span>

                        <label className="relative inline-flex items-center cursor-pointer scale-90">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={feature.enabled}
                            onChange={(e) => handleFeatureToggle(module.key, feature.key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {filteredPermissions.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-slate-400 italic">No modules matching your search term.</p>
            </div>
          )}
        </div>

        {/* Save Bar */}
        <div className={`bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-2xl flex items-center justify-between gap-4 ${standalone ? 'sticky bottom-6' : 'mt-8'}`}>
          <p className="text-xs text-slate-500 hidden sm:block">
            All changes are stored locally until you click save.
            <span className="block font-medium text-slate-700">Audit logs will reflect these updates.</span>
          </p>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-black rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-200"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <Save size={18} />
            )}
            {isSaving ? 'Processing...' : 'Save Permissions'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default PermissionsPage;
