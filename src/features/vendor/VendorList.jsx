import React from "react";
import { Plus, Eye, Edit2, Trash2 } from "lucide-react";

const VendorList = ({
  vendors,
  onAdd,
  onView,
  onEdit,
  onDelete,
  loading,
  filterType,
  onFilterChange,
}) => {
  const SkeletonRow = () => (
    <tr className="animate-pulse">
      <td className="p-4">
        <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      </td>
      <td className="p-4">
        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
      </td>
      <td className="p-4">
        <div className="h-6 bg-slate-200 rounded-full w-20"></div>
      </td>
      <td className="p-4">
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-slate-100 rounded"></div>
          <div className="h-8 w-8 bg-slate-100 rounded"></div>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Vendor Directory
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage and monitor vendor performance assessments
          </p>
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-gray-600 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
          onClick={onAdd}
        >
          <Plus size={20} />
          Register New Vendor
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 mb-6 bg-slate-100/50 p-1.5 rounded-2xl w-fit border border-slate-200/50 shadow-inner">
        {["All", "Approved", "New"].map((type) => (
          <button
            key={type}
            onClick={() => onFilterChange(type)}
            className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${
              filterType === type
                ? "bg-white text-indigo-600 shadow-md ring-1 ring-slate-200"
                : "text-slate-400 hover:text-slate-600 hover:bg-white/50"
            }`}
          >
            {type} Vendors
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  Vendor Identity
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  Contact Details
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  Category
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                  Evaluation Status
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : vendors.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-40">
                      <div className="bg-slate-100 p-4 rounded-full">
                        <Eye size={40} className="text-slate-400" />
                      </div>
                      <p className="font-bold text-slate-900">
                        No vendors found
                      </p>
                      <p className="text-sm">
                        Start by adding your first vendor partner
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="hover:bg-slate-50/50 transition-colors group"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {vendor.name}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">
                        {vendor.id}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-slate-700">
                        {vendor.phone}
                      </div>
                      <div className="text-xs text-slate-400">
                        {vendor.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-md">
                        {vendor.category}
                      </span>
                    </td>
                    <td className="p-4">
                      {vendor.evaluation ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                              vendor.evaluation.status === "Accepted"
                                ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200"
                                : "bg-rose-100 text-rose-700 ring-1 ring-rose-200"
                            }`}
                          >
                            {vendor.evaluation.status}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            {vendor.evaluation.totalScore}/250
                          </span>
                        </div>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          className="p-2  hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100 transition-all font-bold"
                          title="View Profile"
                          onClick={() => onView(vendor)}
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          className="p-2 hover:bg-white hover:shadow-md rounded-lg text-slate-400 hover:text-indigo-600 border border-transparent hover:border-slate-100 transition-all font-bold"
                          title="Edit Assessment"
                          onClick={() => onEdit(vendor)}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          className="p-2 hover:bg-rose-50 hover:shadow-md rounded-lg text-slate-400 hover:text-rose-600 border border-transparent hover:border-rose-100 transition-all font-bold"
                          title="Delete Vendor"
                          onClick={() => onDelete(vendor.id)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorList;
