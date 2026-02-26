import React, { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, Save, AlertCircle } from "lucide-react";
import { evaluationCriteria, scores } from "./utils/constants";
import { vendorValidation } from "./utils/vendorValidation";

const VendorForm = ({ vendor, onSave, onCancel, mode, loading }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    category: "",
    contactPerson: "",
    type: "New",
    assessmentDate: "",
    evaluation: null,
  });

  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    if (vendor) setFormData(vendor);
  }, [vendor]);

  const validateAndSave = () => {
    const { isValid, errors: validationErrors } =
      vendorValidation.validate(formData);
    if (!isValid) {
      setErrors(validationErrors);
      setActiveTab("details"); // Switch to details tab where most inputs are
      return;
    }
    setErrors({});
    onSave(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleScoreChange = (criterionId, score) => {
    const newEvaluation = formData.evaluation ? { ...formData.evaluation } : {};
    newEvaluation[criterionId] = score;

    let total = evaluationCriteria.reduce(
      (sum, c) => sum + (newEvaluation[c.id] || 0),
      0,
    );

    newEvaluation.totalScore = total;
    newEvaluation.status = total >= 100 ? "Accepted" : "Rejected";

    setFormData((prev) => ({ ...prev, evaluation: newEvaluation }));
  };

  const isAccepted = formData.evaluation?.status === "Accepted";

  return (
    <div className="p-4 md:p-8 lg:p-12 w-full bg-slate-50 min-h-screen">
      {/* Sleek Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <button
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-sm mb-2 transition-all"
          >
            <ArrowLeft size={16} /> Back to List
          </button>
          <h1 className="text-2xl font-bold text-slate-900">
            {mode === "edit" ? "Vendor Evaluation" : "New Vendor"}
          </h1>
        </div>
        <button
          onClick={validateAndSave}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-gray-600 px-6 py-2.5 rounded-lg flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
        >
          <Save size={18} /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-8 border-b mb-6">
        {["details", "evaluation"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-medium capitalize transition-colors relative ${activeTab === tab ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"}`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 animate-in slide-in-from-left duration-300"></div>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {activeTab === "details" ? (
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in fade-in duration-300">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Vendor Name
              </label>
              <input
                className={`w-full border rounded-lg py-2.5 px-4 focus:ring-2 transition-all outline-none bg-slate-50/50 hover:bg-white ${errors.name ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Global Supplies Inc."
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-tight">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Assessment Date
              </label>
              <input
                type="date"
                className="w-full border-slate-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 hover:bg-white"
                name="assessmentDate"
                value={formData.assessmentDate || ""}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Phone Number
              </label>
              <input
                className={`w-full border rounded-lg py-2.5 px-4 focus:ring-2 transition-all outline-none bg-slate-50/50 hover:bg-white ${errors.phone ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
              {errors.phone && (
                <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-tight">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Email Address
              </label>
              <input
                type="email"
                className={`w-full border rounded-lg py-2.5 px-4 focus:ring-2 transition-all outline-none bg-slate-50/50 hover:bg-white ${errors.email ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="contact@vendor.com"
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-tight">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Item / Category Dealt
              </label>
              <input
                className={`w-full border rounded-lg py-2.5 px-4 focus:ring-2 transition-all outline-none bg-slate-50/50 hover:bg-white ${errors.category ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g. Reagents, Equipment"
              />
              {errors.category && (
                <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-tight">
                  {errors.category}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Contact Person Name
              </label>
              <input
                className="w-full border-slate-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 hover:bg-white"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Vendor Type
              </label>
              <select
                className="w-full border-slate-200 rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none bg-slate-50/50 hover:bg-white appearance-none cursor-pointer"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="New">New Vendor</option>
                <option value="Existing">Existing Vendor</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1 h-3 bg-indigo-500 rounded-full"></span>
                Full Address
              </label>
              <textarea
                className={`w-full border rounded-lg py-2.5 px-4 focus:ring-2 transition-all outline-none bg-slate-50/50 hover:bg-white ${errors.address ? "border-rose-400 focus:ring-rose-500/20 focus:border-rose-500" : "border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500"}`}
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter full business address"
              ></textarea>
              {errors.address && (
                <p className="text-[10px] font-bold text-rose-500 mt-1 uppercase tracking-tight">
                  {errors.address}
                </p>
              )}
            </div>

            <div className="md:col-span-2 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveTab("evaluation")}
                className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all"
              >
                Continue to Evaluation{" "}
                <ArrowLeft size={18} className="rotate-180" />
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 animate-in fade-in duration-300">
            {/* Evaluation Score Summary */}
            <div
              className={`mb-8 p-6 rounded-2xl flex items-center justify-between shadow-sm border ${isAccepted ? "bg-emerald-50/50 border-emerald-100" : "bg-slate-50 border-slate-200"}`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${isAccepted ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-200 text-slate-500"}`}
                >
                  {isAccepted ? (
                    <CheckCircle size={32} />
                  ) : (
                    <AlertCircle size={32} />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                    Evaluation Status
                  </p>
                  <span
                    className={`text-2xl font-black ${isAccepted ? "text-emerald-700" : "text-slate-700"}`}
                  >
                    {formData.evaluation?.status || "PENDING"}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Total Cumulative Score
                </p>
                <p className="text-4xl font-black text-indigo-600 flex items-baseline justify-end gap-1">
                  {formData.evaluation?.totalScore || 0}
                  <span className="text-slate-300 text-lg font-normal">
                    /250
                  </span>
                </p>
                <div className="w-32 h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden ml-auto">
                  <div
                    className={`h-full transition-all duration-500 ${isAccepted ? "bg-emerald-500" : "bg-indigo-500"}`}
                    style={{
                      width: `${((formData.evaluation?.totalScore || 0) / 250) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Criteria List */}
            <div className="space-y-10">
              {evaluationCriteria.map((criterion) => (
                <div key={criterion.id} className="group relative">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                    <div className="max-w-md">
                      <h4 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                        {criterion.label}
                      </h4>
                      <p className="text-xs text-slate-400 leading-relaxed mt-1">
                        {criterion.subHeadings.join(" • ")}
                      </p>
                    </div>
                    <div className="flex bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50 shadow-inner">
                      {scores.map((score) => (
                        <button
                          key={score}
                          type="button"
                          onClick={() => handleScoreChange(criterion.id, score)}
                          className={`px-5 py-2 rounded-lg text-sm font-black transition-all ${formData.evaluation?.[criterion.id] === score ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200" : "text-slate-400 hover:text-slate-600 hover:bg-white/50"}`}
                        >
                          {score}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="h-px bg-linear-to-r from-slate-100 to-transparent"></div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorForm;
