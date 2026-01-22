import React, { useState, useEffect } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { evaluationCriteria, scores } from "./vendorData";

const VendorForm = ({ vendor, onSave, onCancel, mode }) => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
        address: "",
        category: "",
        contactPerson: "",
        type: "New",
        evaluation: null
    });

    useEffect(() => {
        if (vendor) {
            setFormData(vendor);
        }
    }, [vendor]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleScoreChange = (criterionId, score) => {
        const newEvaluation = formData.evaluation ? { ...formData.evaluation } : {};
        newEvaluation[criterionId] = score;

        // Recalculate total
        let total = 0;
        evaluationCriteria.forEach(criteria => {
            total += newEvaluation[criteria.id] || 0;
        });

        newEvaluation.totalScore = total;
        newEvaluation.status = total >= 100 ? "Accepted" : "Rejected";

        setFormData(prev => ({ ...prev, evaluation: newEvaluation }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="vendor-container">
            <div className="vendor-header">
                <button className="view-btn flex items-center gap-2" onClick={onCancel}>
                    <ArrowLeft size={18} /> Back
                </button>
                <h1>{mode === "edit" ? "Edit Vendor & Evaluation" : "Add New Vendor"}</h1>
                <button className="add-btn" onClick={handleSubmit}>
                    <Save size={18} /> Save Vendor
                </button>
            </div>

            <div className="vendor-form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Vendor Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} required placeholder="Enter vendor name" />
                        </div>
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} required placeholder="Enter phone number" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input name="email" type="email" value={formData.email} onChange={handleChange} required placeholder="Enter email" />
                        </div>
                        <div className="form-group">
                            <label>Item / Category Dealt</label>
                            <input name="category" value={formData.category} onChange={handleChange} required placeholder="e.g. Reagents, Equipment" />
                        </div>
                        <div className="form-group">
                            <label>Contact Person Name</label>
                            <input name="contactPerson" value={formData.contactPerson} onChange={handleChange} required placeholder="Enter contact name" />
                        </div>
                        <div className="form-group">
                            <label>Vendor Type</label>
                            <select name="type" value={formData.type} onChange={handleChange}>
                                <option value="New">New Vendor</option>
                                <option value="Existing">Existing Vendor</option>
                            </select>
                        </div>
                        <div className="form-group full-width">
                            <label>Address</label>
                            <textarea name="address" value={formData.address} onChange={handleChange} rows="2" placeholder="Enter full address"></textarea>
                        </div>
                    </div>

                    {mode === "edit" && (
                        <div className="evaluation-section">
                            <h3>Vendor Evaluation / Certification</h3>
                            <div className="vendor-table-container">
                                <table className="eval-table">
                                    <thead>
                                        <tr>
                                            <th>Criteria of Evaluation</th>
                                            <th>Scoring (10 - 50)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {evaluationCriteria.map((criterion) => (
                                            <tr key={criterion.id}>
                                                <td>
                                                    <div className="font-bold">{criterion.label}</div>
                                                    {criterion.subHeadings.length > 0 && (
                                                        <div className="text-xs text-slate-500 mt-1">
                                                            {criterion.subHeadings.join(" / ")}
                                                        </div>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="score-options">
                                                        {scores.map(score => (
                                                            <label key={score} className="score-option">
                                                                <input
                                                                    type="radio"
                                                                    name={criterion.id}
                                                                    value={score}
                                                                    checked={formData.evaluation?.[criterion.id] === score}
                                                                    onChange={() => handleScoreChange(criterion.id, score)}
                                                                />
                                                                <span>{score}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {formData.evaluation && (
                                <div className="calculation-results">
                                    <div className="result-item">
                                        <span className="result-label">Total Score</span>
                                        <span className="result-value">{formData.evaluation.totalScore}</span>
                                    </div>
                                    <div className="result-item text-right">
                                        <span className="result-label">Acceptance Status</span>
                                        <span className={`result-value ${formData.evaluation.status === "Accepted" ? "status-accepted" : "status-rejected"}`}>
                                            {formData.evaluation.status}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};

export default VendorForm;
