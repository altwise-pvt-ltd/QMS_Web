import React, { useState } from "react";
import VendorList from "./VendorList";
import VendorForm from "./VendorForm";
import VendorView from "./VendorView";
import { initialVendors } from "./vendorData";
import "./vendor.css";

const VendorModule = () => {
    const [vendors, setVendors] = useState(initialVendors);
    const [view, setView] = useState("list"); // list, add, edit, view
    const [selectedVendor, setSelectedVendor] = useState(null);

    const handleAddClick = () => {
        setSelectedVendor(null);
        setView("add");
    };

    const handleEditClick = (vendor) => {
        setSelectedVendor(vendor);
        setView("edit");
    };

    const handleViewClick = (vendor) => {
        setSelectedVendor(vendor);
        setView("view");
    };

    const handleSave = (vendorData) => {
        if (selectedVendor) {
            // Update existing
            setVendors(prev => prev.map(v => v.id === selectedVendor.id ? { ...vendorData, id: v.id } : v));
        } else {
            // Add new
            const newVendor = {
                ...vendorData,
                id: vendors.length + 1
            };
            setVendors(prev => [...prev, newVendor]);
        }
        setView("list");
    };

    const handleCancel = () => {
        setView("list");
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {view === "list" && (
                <VendorList
                    vendors={vendors}
                    onAdd={handleAddClick}
                    onEdit={handleEditClick}
                    onView={handleViewClick}
                />
            )}

            {(view === "add" || view === "edit") && (
                <VendorForm
                    vendor={selectedVendor}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    mode={view}
                />
            )}

            {view === "view" && (
                <VendorView
                    vendor={selectedVendor}
                    onCancel={handleCancel}
                />
            )}
        </div>
    );
};

export default VendorModule;
