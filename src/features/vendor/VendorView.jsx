import React from "react";
import { ArrowLeft, Printer } from "lucide-react";

const VendorView = ({ vendor, onCancel }) => {
    if (!vendor) return null;

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="vendor-container">
            <div className="vendor-header no-print">
                <button className="view-btn flex items-center gap-2" onClick={onCancel}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h1>Vendor details</h1>
                <button className="add-btn" onClick={handlePrint}>
                    <Printer size={18} /> Print Document
                </button>
            </div>

            <div className="document-preview">
                <div className="doc-header">
                    <h2>Vendor Assessment Record</h2>
                    <div className="text-sm text-slate-500 mt-2">Quality Management System</div>
                </div>

                <div className="doc-body">
                    <div className="doc-grid">
                        <div className="doc-item">
                            <b>Vendor Name</b>
                            <div>{vendor.name}</div>
                        </div>
                        <div className="doc-item">
                            <b>Contact Person</b>
                            <div>{vendor.contactPerson}</div>
                        </div>
                        <div className="doc-item">
                            <b>Phone Number</b>
                            <div>{vendor.phone}</div>
                        </div>
                        <div className="doc-item">
                            <b>Email ID</b>
                            <div>{vendor.email}</div>
                        </div>
                        <div className="doc-item">
                            <b>Category / Item</b>
                            <div>{vendor.category}</div>
                        </div>
                        <div className="doc-item">
                            <b>Vendor Type</b>
                            <div>{vendor.type} Vendor</div>
                        </div>
                    </div>

                    <div className="doc-item">
                        <b>Address</b>
                        <div>{vendor.address}</div>
                    </div>

                    {vendor.evaluation && (
                        <>
                            <table className="doc-table">
                                <thead>
                                    <tr>
                                        <th>Evaluation Criteria</th>
                                        <th>Score Obtained</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Quality (Items, Reagents, Controls, Validation)</td>
                                        <td>{vendor.evaluation.quality || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Delivery (On-time, Cold Chain, Compliance)</td>
                                        <td>{vendor.evaluation.delivery || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Price (Level, History)</td>
                                        <td>{vendor.evaluation.price || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Equipment (Closed System)</td>
                                        <td>{vendor.evaluation.equipment || 0}</td>
                                    </tr>
                                    <tr>
                                        <td>Service Support</td>
                                        <td>{vendor.evaluation.service || 0}</td>
                                    </tr>
                                    <tr style={{ background: "#f8fafc", fontWeight: "bold" }}>
                                        <td>TOTAL SCORE</td>
                                        <td>{vendor.evaluation.totalScore}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="mt-8 p-4 border-2 rounded-lg flex justify-between items-center"
                                style={{ borderColor: vendor.evaluation.status === "Accepted" ? "#059669" : "#dc2626" }}>
                                <div>
                                    <div className="text-xs uppercase font-bold text-slate-400">Final Assessment</div>
                                    <div className={`text-2xl font-bold ${vendor.evaluation.status === "Accepted" ? "text-emerald-600" : "text-rose-600"}`}>
                                        VENDOR {vendor.evaluation.status.toUpperCase()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-slate-500">Benchmark: 100 Points</div>
                                    <div className="text-sm font-semibold">Compliance Status: {vendor.evaluation.status === "Accepted" ? "Verified" : "Failed"}</div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="doc-footer">
                        <div className="signature-area">
                            <div className="signature-line">Evaluated By</div>
                            <div className="text-xs text-center text-slate-400 mt-1">Quality Manager</div>
                        </div>
                        <div className="signature-area">
                            <div className="signature-line">Approved By</div>
                            <div className="text-xs text-center text-slate-400 mt-1">Director / Lab Head</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorView;
