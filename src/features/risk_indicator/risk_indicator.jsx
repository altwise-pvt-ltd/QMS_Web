import React, { useState } from "react";
import {
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Plus,
    ChevronRight,
    FileSpreadsheet,
    Search,
    ShieldAlert,
} from "lucide-react";
import RiskIndicatorForm from "./risk_indicator_form";
import { db } from "../../db";
import { useEffect } from "react";
import riService from "./services/riService";

const RiskIndicator = () => {
    const [view, setView] = useState("dashboard"); // "dashboard" or "form"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [indicators, setIndicators] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingIndicator, setEditingIndicator] = useState(null);

    const [isAddingCategory, setIsAddingCategory] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");

    useEffect(() => {
        const init = async () => {
            const currentCategories = await loadCategories();
            await loadIndicators(currentCategories);
        };
        init();
    }, []);

    const loadCategories = async () => {
        try {
            // 🚀 Fetch from Backend API
            const apiData = await riService.getAllCategories();
            console.log("Risk categories from API received:", apiData);

            if (apiData && Array.isArray(apiData) && apiData.length > 0) {
                // Map API data to our structure safely
                const formattedCategories = apiData.map((cat, index) => {
                    let itemName = "Unknown Category";

                    if (typeof cat === 'string') {
                        itemName = cat;
                    } else if (cat && typeof cat === 'object') {
                        // Priority to riskCategoryName as indicated by error logs
                        itemName = cat.riskCategoryName || cat.categoryName || cat.name || "Unknown";

                        // ABSOLUTE PROTECTION: ensure we never pass an object to React children
                        if (typeof itemName !== 'string') {
                            itemName = String(itemName || "Unknown");
                        }
                    }

                    return {
                        id: cat.riskIndicatorCategoryId || cat.id || `api-${index}`,
                        name: itemName
                    };
                });

                console.log("Formatted Categories for state:", formattedCategories);
                setCategories(formattedCategories);

                // Sync to local DB safely
                try {
                    // Use a transaction for atomic operation
                    await db.transaction('rw', db.risk_categories, async () => {
                        await db.risk_categories.clear();
                        await db.risk_categories.bulkPut(formattedCategories);
                    });
                    console.log("Local DB synced with API categories");
                } catch (dbErr) {
                    console.error("Failed to sync categories to local DB:", dbErr);
                }
                return formattedCategories;
            } else {
                // Fallback to local DB or defaults if API is empty
                return await syncFromLocalDB();
            }
        } catch (error) {
            console.error("Error loading categories from API:", error);
            return await syncFromLocalDB();
        }
    };

    const syncFromLocalDB = async () => {
        let localData = await db.risk_categories.toArray();

        // Final sanity check on local data to prevent crashes if bad data exists
        const safeData = localData.map(cat => ({
            ...cat,
            name: typeof cat.name === 'string' ? cat.name : "Recovered Category"
        }));

        setCategories(safeData);
        return safeData;
    };

    const handleAddCategory = async () => {
        const trimmedName = newCategoryName.trim();
        if (!trimmedName) return;

        // Prevent duplicates in current state
        if (categories.some(cat => cat.name.toLowerCase() === trimmedName.toLowerCase())) {
            alert("This category already exists.");
            return;
        }

        try {
            // 🚀 Call Backend API with exact requested structure
            const apiResponse = await riService.createCategory({
                riskIndicatorCategoryId: 0,
                riskCategoryName: trimmedName,
                riCategory: "string"
            });

            console.log("Create category API response:", apiResponse);

            // Add to local state and DB
            const newCat = {
                id: apiResponse?.riskIndicatorCategoryId || apiResponse?.id || Date.now(),
                name: trimmedName
            };

            await db.risk_categories.add(newCat);
            setCategories([...categories, newCat]);
            setNewCategoryName("");
            setIsAddingCategory(false);
        } catch (error) {
            console.error("Error adding category via API:", error);
            // Still add locally if API fails (optional, depending on requirements)
            alert("Failed to create category on server. Please try again.");
        }
    };

    const loadIndicators = async (currentCategories = categories) => {
        try {
            setLoading(true);
            // 🚀 Fetch from Backend API
            const apiData = await riService.getAllRiskIndicators();
            console.log("Risk indicators from API:", apiData);

            if (apiData && Array.isArray(apiData) && apiData.length > 0) {
                const formattedIndicators = apiData.map(ri => {
                    // Find category name by ID
                    const catId = ri.riskIndicatorCategoryId?.toString();
                    const cat = currentCategories.find(c => c.id?.toString() === catId);

                    return {
                        id: ri.riskIndicatorId || `api-ri-${Math.random()}`,
                        riskIndicatorId: ri.riskIndicatorId,
                        name: ri.riskName || "Untitled Risk",
                        category: cat ? cat.name : (ri.riskCategoryName || "General"),
                        count: 0, // 👈 Fix: API doesn't provide current count, defaulting to 0
                        hasCapa: ri.status === "true" || ri.status === true,
                        incidents: [],
                        threshold: ri.thresholdCount || 0,
                        severity: ri.severity || 1,
                    };
                });
                setIndicators(formattedIndicators);

                // Sync to local DB
                await db.risk_indicators.clear();
                await db.risk_indicators.bulkAdd(formattedIndicators);
            } else {
                // Fallback to local DB
                const localData = await db.risk_indicators.toArray();
                setIndicators(localData);
            }
        } catch (error) {
            console.error("Error loading indicators from API:", error);
            const localData = await db.risk_indicators.toArray();
            setIndicators(localData);
        } finally {
            setLoading(false);
        }
    };

    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newThreshold, setNewThreshold] = useState("");
    const [newSeverity, setNewSeverity] = useState("1");

    useEffect(() => {
        if (editingIndicator) {
            setNewName(editingIndicator.name);
            setNewCategory(editingIndicator.category);
            setNewThreshold(editingIndicator.threshold?.toString() || "");
            setNewSeverity(editingIndicator.severity?.toString() || "1");
        } else {
            setNewName("");
            setNewCategory("");
            setNewThreshold("");
            setNewSeverity("1");
        }
    }, [editingIndicator]);

    const handleSaveIndicator = async () => {
        if (!newName || !newCategory) return;

        try {
            if (editingIndicator) {
                // Find category object for update
                const categoryObj = categories.find(c => c.name === newCategory);

                const apiId = editingIndicator.riskIndicatorId || (typeof editingIndicator.id === 'number' ? editingIndicator.id : 0);

                // 🚀 Update with API using the specific Update endpoint
                const updateData = {
                    riskIndicatorId: apiId,
                    riskIndicatorCategoryId: categoryObj?.id?.toString() || "1",
                    riskName: newName,
                    thresholdCount: parseInt(newThreshold) || 0,
                    severity: parseInt(newSeverity) || 0,
                    status: editingIndicator.hasCapa ? "true" : "false"
                };

                await riService.updateRiskIndicator(apiId, updateData);

                // Update existing
                const updatedIndicator = {
                    ...editingIndicator,
                    name: newName,
                    category: newCategory,
                    threshold: parseFloat(newThreshold) || 0,
                    severity: parseInt(newSeverity) || 1,
                };
                await db.risk_indicators.put(updatedIndicator);
                setIndicators(indicators.map(i => i.id === editingIndicator.id ? updatedIndicator : i));
            } else {
                // Find the category object to get its numeric ID
                const categoryObj = categories.find(c => c.name === newCategory);

                // 🚀 Add new with exact requested structure
                const indicatorData = {
                    riskIndicatorId: 0,
                    riskIndicatorCategoryId: categoryObj?.id?.toString() || "1",
                    riskName: newName,
                    thresholdCount: parseInt(newThreshold) || 0,
                    severity: parseInt(newSeverity) || 0,
                    status: "false"
                };

                // 🚀 Call Backend API
                const apiResponse = await riService.createRiskIndicator(indicatorData);
                console.log("Create risk indicator API response:", apiResponse);

                const newIndicator = {
                    id: apiResponse?.riskIndicatorId || apiResponse?.id || `risk-new-${Date.now()}`,
                    name: newName,
                    category: newCategory,
                    count: 0,
                    hasCapa: false,
                    incidents: [],
                    threshold: parseFloat(newThreshold) || 0,
                    severity: parseInt(newSeverity) || 1,
                };
                await db.risk_indicators.add(newIndicator);
                setIndicators([newIndicator, ...indicators]);
            }
            setIsModalOpen(false);
            setEditingIndicator(null);
            // Explicitly clear form fields
            setNewName("");
            setNewCategory("");
            setNewThreshold("");
            setNewSeverity("1");
        } catch (error) {
            console.error("Error saving indicator:", error);
            alert("Failed to save indicator on server.");
        }
    };

    const filteredIndicators = indicators.filter((indicator) => {
        const matchesSearch = indicator.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            selectedCategory === "All" || indicator.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const StatsCard = ({ title, value, color, icon: Icon }) => {
        const getColorClasses = (baseColor) => {
            const colorMap = {
                "bg-indigo-500": {
                    bg: "bg-indigo-50",
                    text: "text-indigo-600",
                    border: "border-indigo-100",
                    hover: "hover:border-indigo-200",
                },
                "bg-rose-500": {
                    bg: "bg-rose-50",
                    text: "text-rose-600",
                    border: "border-rose-100",
                    hover: "hover:border-rose-200",
                },
                "bg-emerald-500": {
                    bg: "bg-emerald-50",
                    text: "text-emerald-600",
                    border: "border-emerald-100",
                    hover: "hover:border-emerald-200",
                },
            };
            return colorMap[baseColor] || colorMap["bg-indigo-500"];
        };

        const colors = getColorClasses(color);

        return (
            <div className={`bg-white p-6 rounded-xl border-2 ${colors.border} ${colors.hover} transition-all group`}>
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${colors.bg}`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2.5} />
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        {title}
                    </p>
                    <h3 className="text-4xl font-bold text-slate-900 tracking-tight">
                        {value}
                    </h3>
                </div>
            </div>
        );
    };

    const IndicatorCard = ({ indicator }) => {
        const isOverThreshold =
            indicator.threshold && indicator.count > indicator.threshold;

        const getSeverityStyles = (severity) => {
            const s = parseInt(severity);
            if (s >= 5) return "bg-rose-500 text-gray-600 shadow-rose-100";
            if (s >= 4) return "bg-orange-500 text-gray-600 shadow-orange-100";
            if (s >= 3) return "bg-amber-500 text-black shadow-amber-100";
            if (s >= 2) return "bg-blue-500 text-gray-600 shadow-blue-100";
            return "bg-emerald-500 text-gray-600 shadow-emerald-100";
        };

        return (
            <div
                onClick={() => {
                    setEditingIndicator(indicator);
                    setIsModalOpen(true);
                }}
                className={`bg-white group rounded-2xl border-2 transition-all p-5 flex flex-col justify-between h-full hover:-translate-y-1 shadow-sm hover:shadow-xl cursor-pointer ${isOverThreshold ? "border-rose-200" : "border-slate-100"
                    }`}
            >
                <div>
                    <div className="flex justify-between items-start mb-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-50 text-slate-600 border border-slate-100`}>
                            {indicator.category}
                        </span>
                        <div className="flex items-center gap-2">
                            {indicator.severity && (
                                <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black shadow-sm ${getSeverityStyles(indicator.severity)}`}>
                                    LVL {indicator.severity}
                                </span>
                            )}
                            {indicator.hasCapa && (
                                <div className="flex items-center gap-1 relative cursor-help">
                                    <AlertCircle size={16} className="text-rose-500" />
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="text-slate-800 font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                        {indicator.name}
                    </h3>
                    <div className="flex gap-4 items-center mt-2">
                        {indicator.threshold !== undefined && indicator.threshold > 0 && (
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Threshold</p>
                                <p className="text-xs font-black text-slate-700">{indicator.threshold}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest mb-1">Risk Count</p>
                        <div className="flex items-center gap-2">
                            <span className={`text-3xl font-black tracking-tighter ${isOverThreshold ? "text-rose-600" : "text-slate-800"}`}>
                                {indicator.count}
                            </span>
                            {isOverThreshold ? (
                                <AlertCircle size={18} className="text-rose-500 animate-pulse" />
                            ) : (
                                <TrendingUp size={16} className={indicator.count > 10 ? "text-rose-500" : "text-emerald-500"} />
                            )}
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-gray-600 transition-all shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        );
    };

    const totalRisks = indicators.reduce((acc, curr) => acc + curr.count, 0);
    const capaPending = indicators.filter((i) => i.hasCapa).length;
    const criticalRisks = indicators.filter((i) => i.severity >= 4).length;

    if (view === "form") {
        return (
            <RiskIndicatorForm
                indicators={indicators}
                categories={categories}
                onBack={() => setView("dashboard")}
            />
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 w-full space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <ShieldAlert className="text-indigo-600" size={32} />
                        Risk Indicators
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Identifying and monitoring potential risks in laboratory operations</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setView("form")}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:shadow-md transition-all active:scale-95 shadow-sm"
                    >
                        <FileSpreadsheet size={20} className="text-emerald-500" />
                        Monthly Risk Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Risk Incidents"
                    value={totalRisks}
                    color="bg-indigo-500"
                    icon={TrendingUp}
                />
                <StatsCard
                    title="CAPA Linked"
                    value={capaPending}
                    color="bg-rose-500"
                    icon={AlertCircle}
                />
                <StatsCard
                    title="High Severity Risks"
                    value={criticalRisks}
                    color="bg-emerald-500"
                    icon={ShieldAlert}
                />
            </div>

            {/* Controls & Grid */}
            <div className="bg-slate-50 min-h-screen">
                <div className="flex flex-col xl:flex-row justify-between items-start mb-8 gap-6">
                    <div className="flex flex-wrap items-center bg-white p-1.5 rounded-2xl shadow-sm border border-slate-200 gap-1 w-full xl:w-auto">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === "All" ? "bg-indigo-600 text-gray-600 shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.name)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${selectedCategory === cat.name ? "bg-indigo-600 text-gray-600 shadow-md shadow-indigo-100" : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 w-full xl:w-96">
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                            <input
                                type="text"
                                placeholder="Search risk factors..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-xs font-medium"
                            />
                        </div>

                        <div className="w-full">
                            {isAddingCategory ? (
                                <div className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                                    <input
                                        type="text"
                                        placeholder="Enter category name..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="flex-1 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                    />
                                    <button
                                        onClick={handleAddCategory}
                                        className="px-4 py-2 bg-indigo-600 text-gray-600 text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-sm"
                                    >
                                        Add
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAddingCategory(false);
                                            setNewCategoryName("");
                                        }}
                                        className="px-4 py-2 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all border border-slate-200"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsAddingCategory(true)}
                                    className="w-full py-2.5 bg-white text-slate-500 text-xs font-bold rounded-xl border border-dashed border-slate-300 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <Plus size={14} className="group-hover:rotate-90 transition-transform duration-300" />
                                    Add New Category
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Add New Card */}
                    <div
                        onClick={() => {
                            setEditingIndicator(null);
                            setIsModalOpen(true);
                        }}
                        className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 group hover:border-indigo-400 transition-all flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-white min-h-[220px]"
                    >
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all mb-4">
                            <Plus size={28} />
                        </div>
                        <p className="text-slate-500 font-bold group-hover:text-indigo-600 transition-colors">Add Risk Indicator</p>
                        <p className="text-slate-400 text-xs mt-1">Define new potential risk</p>
                    </div>

                    {filteredIndicators.map((indicator) => (
                        <IndicatorCard key={indicator.id} indicator={indicator} />
                    ))}
                </div>
            </div>

            {/* Add New Indicator Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300 overflow-y-auto max-h-[90vh]">
                        <div className="p-10">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-800 mb-2 italic">
                                        {editingIndicator ? "Update Risk Metric" : "Configure Risk Metric"}
                                    </h2>
                                    <p className="text-slate-500 text-sm font-medium">Establish risk categories and potential impact levels</p>
                                </div>
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <ShieldAlert size={24} />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                                        Select Risk Category
                                    </label>
                                    <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setNewCategory(cat.name)}
                                                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${newCategory === cat.name
                                                    ? "border-indigo-600 bg-indigo-50/50 text-indigo-700"
                                                    : "border-slate-100 hover:border-slate-200 text-slate-600"
                                                    }`}
                                            >
                                                <span className="font-bold text-xs">{cat.name}</span>
                                                {newCategory === cat.name && <CheckCircle2 size={18} />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                                        Risk Name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Data leakage via email"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                                            Threshold Count
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="e.g. 5"
                                            value={newThreshold}
                                            onChange={(e) => setNewThreshold(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">
                                            Severity (1-5)
                                        </label>
                                        <select
                                            value={newSeverity}
                                            onChange={(e) => setNewSeverity(e.target.value)}
                                            className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-indigo-600 focus:bg-white transition-all outline-none font-bold text-slate-800 appearance-none cursor-pointer"
                                        >
                                            <option value="1">1 (Low)</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5 (Critical)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingIndicator(null);
                                    }}
                                    className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveIndicator}
                                    disabled={!newName || !newCategory}
                                    className="flex-1 py-4 bg-indigo-600 text-gray-600 font-black rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:hover:translate-y-0"
                                >
                                    {editingIndicator ? "Update Risk Metric" : "Define Risk Metric"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style
                dangerouslySetInnerHTML={{
                    __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
                }}
            />
        </div>
    );
};

export default RiskIndicator;

