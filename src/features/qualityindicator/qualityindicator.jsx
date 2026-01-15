import React, { useState } from "react";
import {
    Activity,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Plus,
    ChevronRight,
    FileSpreadsheet,
    Filter,
    Search,
    ExternalLink
} from "lucide-react";
import { QUALITY_INDICATORS, CATEGORIES } from "./qi_data";
import QalityIndicatorForm from "./qalityindicatorform";

const QualityIndicator = () => {
    const [view, setView] = useState("dashboard"); // "dashboard" or "form"
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [indicators, setIndicators] = useState(QUALITY_INDICATORS);

    const filteredIndicators = indicators.filter(indicator => {
        const matchesSearch = indicator.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "All" || indicator.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const StatsCard = ({ title, value, color, icon: Icon }) => (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full opacity-5 group-hover:scale-110 transition-transform ${color}`}></div>
            <div className="flex justify-between items-start relative z-10">
                <div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${color.replace('bg-', 'bg-').replace('text-', 'text-')} bg-opacity-10`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>
            </div>
        </div>
    );

    const IndicatorCard = ({ indicator }) => (
        <div className="bg-white group rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all p-5 flex flex-col justify-between h-full hover:-translate-y-1">
            <div>
                <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${indicator.category === 'Pre-Analytical' ? 'bg-amber-50 text-amber-600' :
                            indicator.category === 'Analytical' ? 'bg-indigo-50 text-indigo-600' :
                                'bg-emerald-50 text-emerald-600'
                        }`}>
                        {indicator.category}
                    </span>
                    {indicator.hasCapa && (
                        <div className="flex items-center gap-1 group/capa relative cursor-help">
                            <AlertCircle size={16} className="text-rose-500" />
                            <span className="text-[10px] font-medium text-rose-500">CAPA Filed</span>
                            <div className="absolute bottom-full right-0 mb-2 invisible group-hover/capa:visible bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-xl z-20">
                                Linked to {indicator.capaId}
                            </div>
                        </div>
                    )}
                </div>
                <h4 className="text-slate-800 font-bold text-lg mb-2 group-hover:text-indigo-600 transition-colors leading-tight">
                    {indicator.name}
                </h4>
            </div>

            <div className="mt-6">
                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-slate-400 text-[10px] font-medium uppercase tracking-widest mb-1">Incident Count</p>
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-black text-slate-800 tracking-tighter">{indicator.count}</span>
                            <TrendingUp size={16} className={indicator.count > 10 ? "text-rose-500" : "text-emerald-500"} />
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>
        </div>
    );

    const totalIncidents = indicators.reduce((acc, curr) => acc + curr.count, 0);
    const capaPending = indicators.filter(i => i.hasCapa).length;
    const criticalIndicators = indicators.filter(i => i.count > 20).length;

    if (view === "form") {
        return <QalityIndicatorForm onBack={() => setView("dashboard")} />;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Activity className="text-indigo-600" />
                        Quality Indicators
                    </h1>
                    <p className="text-slate-500 mt-1 font-medium">Monitoring and analyzing laboratory performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setView("form")}
                        className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 border border-slate-100 rounded-2xl font-bold hover:shadow-md transition-all active:scale-95"
                    >
                        <FileSpreadsheet size={20} className="text-emerald-500" />
                        Monthly Report Form
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Total Incidents (Jan)"
                    value={totalIncidents}
                    color="bg-indigo-500"
                    icon={TrendingUp}
                />
                <StatsCard
                    title="CAPA Investigations"
                    value={capaPending}
                    color="bg-rose-500"
                    icon={AlertCircle}
                />
                <StatsCard
                    title="Critical Benchmarks"
                    value={criticalIndicators}
                    color="bg-emerald-500"
                    icon={CheckCircle2}
                />
            </div>

            {/* Controls & Grid */}
            <div className="bg-slate-50 min-h-screen">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div className="flex items-center bg-white p-1 rounded-2xl shadow-sm border border-slate-100 w-full md:w-auto">
                        <button
                            onClick={() => setSelectedCategory("All")}
                            className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === "All" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:text-slate-800"}`}
                        >
                            All
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "text-slate-500 hover:text-slate-800"}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                        <input
                            type="text"
                            placeholder="Search indicators..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-hidden transition-all text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {/* Add New Card */}
                    <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 group hover:border-indigo-300 transition-all flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-white min-h-[220px]">
                        <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all mb-4">
                            <Plus size={28} />
                        </div>
                        <p className="text-slate-500 font-bold group-hover:text-indigo-600 transition-colors">Add New Indicator</p>
                        <p className="text-slate-400 text-xs mt-1">Define new quality benchmark</p>
                    </div>

                    {filteredIndicators.map(indicator => (
                        <IndicatorCard key={indicator.id} indicator={indicator} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QualityIndicator;
