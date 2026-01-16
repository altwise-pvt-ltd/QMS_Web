import React from "react";
import {
    Activity,
    Zap,
    Heart,
    Brain,
    Box,
    UserCircle
} from "lucide-react";

// Icon mapping based on department icon name
const IconMap = {
    Activity: Activity,
    Zap: Zap,
    Heart: Heart,
    Brain: Brain,
    Box: Box
};

const ColorMap = {
    indigo: {
        bg: "bg-indigo-50",
        text: "text-indigo-600",
        border: "border-indigo-100",
        icon: "bg-indigo-600"
    },
    rose: {
        bg: "bg-rose-50",
        text: "text-rose-600",
        border: "border-rose-100",
        icon: "bg-rose-600"
    },
    emerald: {
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-100",
        icon: "bg-emerald-600"
    },
    amber: {
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-100",
        icon: "bg-amber-600"
    }
};

/**
 * DepartmentCard - A single department selectable card
 */
const DepartmentCard = ({ dept, isSelected, onSelect }) => {
    const Icon = IconMap[dept.icon] || Box;
    const colors = ColorMap[dept.color] || ColorMap.indigo;

    return (
        <div
            onClick={() => onSelect(dept.id)}
            className={`bg-white group rounded-3xl border transition-all p-6 flex flex-col h-full cursor-pointer relative overflow-hidden ${isSelected
                ? "border-indigo-600 ring-2 ring-indigo-600/10 shadow-xl shadow-indigo-100/50 -translate-y-2"
                : "border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1"
                }`}
        >
            {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 bg-indigo-600 text-white flex items-center justify-center rounded-bl-2xl shadow-sm animate-in slide-in-from-top-4 slide-in-from-right-4 duration-300">
                    <Box size={16} />
                </div>
            )}

            <div className="flex justify-between items-start mb-5">
                <div className={`p-4 rounded-2xl ${colors.bg} ${colors.text} transition-all group-hover:scale-110 shadow-sm ${isSelected ? "scale-110 ring-2 ring-white" : ""}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {!isSelected && (
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Code</span>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-tighter border ${colors.border} ${colors.text}`}>
                            {dept.code}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex-1">
                <h4 className={`font-black text-xl mb-1 truncate tracking-tight transition-colors ${isSelected ? "text-indigo-600" : "text-slate-800"}`}>
                    {dept.name}
                </h4>
                <div className="flex items-center gap-2 text-slate-500 mb-6">
                    <UserCircle size={14} className="text-slate-300" />
                    <p className="text-xs font-semibold truncate">Lead: {dept.head || "Not Assigned"}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className={`${isSelected ? "bg-indigo-50/50" : "bg-slate-50/80"} p-3 rounded-2xl transition-colors`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Equipment</p>
                        <p className={`text-lg font-black transition-colors ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>24</p>
                    </div>
                    <div className={`${isSelected ? "bg-indigo-50/50" : "bg-slate-50/80"} p-3 rounded-2xl transition-colors`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Staff</p>
                        <p className={`text-lg font-black transition-colors ${isSelected ? "text-indigo-700" : "text-slate-700"}`}>{dept.employeeCount}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/**
 * DepartmentCards - Grid container for all department cards
 */
export const DepartmentCards = ({ departments, selectedId, onSelect }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {departments.map((dept) => (
                <DepartmentCard
                    key={dept.id}
                    dept={dept}
                    isSelected={selectedId === dept.id}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};

export default DepartmentCards;
