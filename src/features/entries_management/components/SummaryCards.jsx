import React from "react";
import { Icons, Icon, CYCLE_COLOR, CYCLE_LABEL } from "./Common";

export function SummaryCards({ entries, activeFilter, onFilter }) {
    const counts = {
        all: entries.length,
        daily: entries.filter((e) => e.recordingCycle === "daily").length,
        weekly: entries.filter((e) => e.recordingCycle === "weekly").length,
        monthly: entries.filter((e) => e.recordingCycle === "monthly").length,
    };

    const cards = [
        {
            key: "all",
            label: "Total Entries",
            sub: "Monitored",
            count: counts.all,
            icon: Icons.layers,
            trend: `+${entries.length}`,
            color: "#6366F1", // Indigo
            accent: "bg-indigo-500",
            bg: "bg-indigo-50",
            text: "text-indigo-600",
        },
        {
            key: "daily",
            label: "Daily Cycle",
            sub: "Regular monitoring",
            count: counts.daily,
            icon: Icons.clock,
            trend: counts.daily > 0 ? `+${counts.daily}` : "--",
            color: "#F43F5E", // Rose/Red
            accent: "bg-rose-500",
            bg: "bg-rose-50",
            text: "text-rose-600",
        },
        {
            key: "weekly",
            label: "Weekly Cycle",
            sub: "Periodic checks",
            count: counts.weekly,
            icon: Icons.cal,
            trend: counts.weekly > 0 ? `+${counts.weekly}` : "--",
            color: "#F59E0B", // Amber/Yellow
            accent: "bg-amber-500",
            bg: "bg-amber-50",
            text: "text-amber-600",
        },
        {
            key: "monthly",
            label: "Monthly Cycle",
            sub: "Long-term tracking",
            count: counts.monthly,
            icon: Icons.entry,
            trend: counts.monthly > 0 ? `+${counts.monthly}` : "--",
            color: "#10B981", // Emerald/Green
            accent: "bg-emerald-500",
            bg: "bg-emerald-50",
            text: "text-emerald-600",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => {
                const active = activeFilter === card.key;
                const share = counts.all > 0 ? Math.round((card.count / counts.all) * 100) : 0;

                return (
                    <button
                        key={card.key}
                        onClick={() => onFilter(card.key)}
                        className={`relative rounded-xl overflow-hidden text-left transition-all active:scale-95 border border-slate-200 bg-white ${active ? "ring-2 ring-offset-2 ring-slate-900 shadow-lg" : "shadow-sm hover:shadow-md"
                            }`}
                    >
                        {/* Top Accent Bar */}
                        <div className={`h-1 w-full ${card.accent}`} />

                        <div className="p-4">
                            {/* Header: Icon & Trend */}
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${card.bg}`}>
                                    <Icon d={card.icon} size={16} color={card.color} />
                                </div>
                                <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-100 ${card.bg} ${card.text}`}>
                                    {card.trend}
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="mb-4">
                                <h3 className={`text-3xl font-black leading-none tracking-tight ${active ? "text-slate-900" : card.text}`}>
                                    {card.count}
                                </h3>
                                <p className="text-xs font-bold text-slate-700 mt-1.5 uppercase tracking-wider">
                                    {card.label}
                                </p>
                                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                                    {card.sub}
                                </p>
                            </div>

                            {/* Footer Section */}
                            {card.key === "all" ? (
                                <div className="flex gap-1.5 flex-wrap">
                                    <div className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[10px] font-semibold rounded-full border border-rose-100">
                                        {counts.daily} Daily
                                    </div>
                                    <div className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-semibold rounded-full border border-amber-100">
                                        {counts.weekly} Weekly
                                    </div>
                                    <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-semibold rounded-full border border-emerald-100">
                                        {counts.monthly} Monthly
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-slate-400 font-medium">Share of total</span>
                                        <span className={`text-[10px] font-bold ${card.text}`}>{share}%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-700 ${card.accent}`}
                                            style={{ width: `${share}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
