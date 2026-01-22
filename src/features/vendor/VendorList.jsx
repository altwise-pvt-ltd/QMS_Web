import React from "react";
import { Plus, Eye, Edit2 } from "lucide-react";

const VendorList = ({ vendors, onAdd, onView, onEdit }) => {
    return (
        <div className="vendor-container">
            <div className="vendor-header">
                <h1>Vendor Management</h1>
                <button className="add-btn" onClick={onAdd}>
                    <Plus size={20} />
                    Add Vendor
                </button>
            </div>

            <div className="vendor-table-container">
                <table className="vendor-table">
                    <thead>
                        <tr>
                            <th>Vendor Name</th>
                            <th>Phone Number</th>
                            <th>Item / Category</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vendors.map((vendor) => (
                            <tr key={vendor.id}>
                                <td>
                                    <div className="font-semibold">{vendor.name}</div>
                                    <div className="text-xs text-slate-400">{vendor.email}</div>
                                </td>
                                <td>{vendor.phone}</td>
                                <td>{vendor.category}</td>
                                <td>
                                    {vendor.evaluation ? (
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${vendor.evaluation.status === "Accepted" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                                            }`}>
                                            {vendor.evaluation.status}
                                        </span>
                                    ) : (
                                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                            Pending
                                        </span>
                                    )}
                                </td>
                                <td>
                                    <div className="action-btns">
                                        <button className="view-btn" title="View" onClick={() => onView(vendor)}>
                                            <Eye size={16} />
                                        </button>
                                        <button className="edit-btn" title="Edit" onClick={() => onEdit(vendor)}>
                                            <Edit2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default VendorList;
