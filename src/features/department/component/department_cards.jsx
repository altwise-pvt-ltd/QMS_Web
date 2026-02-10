import {
    Activity,
    Zap,
    Heart,
    Brain,
    Box,
    UserCircle,
    Edit2,
    Trash2
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
const DepartmentCard = ({ dept, isSelected, onSelect, onEdit, onDelete }) => {
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
            {/* Selection indicator moved to top-left */}
            {isSelected && (
                <div className="absolute top-0 left-0 w-10 h-10 bg-indigo-600 text-white flex items-center justify-center rounded-br-2xl shadow-sm animate-in slide-in-from-top-4 slide-in-from-left-4 duration-300 z-10">
                    <Box size={14} />
                </div>
            )}

            {/* Absolute positioned action buttons */}
            <div className="absolute top-4 right-4 flex gap-1 z-20">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(dept);
                    }}
                    className="p-2 bg-white/80 backdrop-blur-sm hover:bg-slate-100 rounded-xl text-slate-400 hover:text-indigo-600 transition-all shadow-sm border border-slate-100"
                    title="Edit Department"
                >
                    <Edit2 size={14} />
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(dept.id, dept.name);
                    }}
                    className="p-2 bg-white/80 backdrop-blur-sm hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-600 transition-all shadow-sm border border-slate-100"
                    title="Delete Department"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            <div className="flex justify-between items-start mb-5">
                <div className={`p-4 rounded-2xl ${colors.bg} ${colors.text} transition-all group-hover:scale-110 shadow-sm ${isSelected ? "scale-110 ring-2 ring-white" : ""}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>

            <div className="flex-1">
                <h4 className={`font-black text-xl mb-1 truncate tracking-tight transition-colors ${isSelected ? "text-indigo-600" : "text-slate-800"}`}>
                    {dept.name}
                </h4>
                <div className="flex items-center gap-2 text-slate-500 mb-6">
                    <UserCircle size={14} className="text-slate-300" />
                    <p className="text-xs font-semibold truncate">Lead: {dept.head || "Not Assigned"}</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className={`${isSelected ? "bg-indigo-50/50" : "bg-slate-50/80"} p-3 rounded-2xl transition-colors`}>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Staff Member Count</p>
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
export const DepartmentCards = ({ departments, selectedId, onSelect, onEdit, onDelete }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in duration-700">
            {departments.map((dept) => (
                <DepartmentCard
                    key={dept.id}
                    dept={dept}
                    isSelected={selectedId === dept.id}
                    onSelect={onSelect}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
};

export default DepartmentCards;
