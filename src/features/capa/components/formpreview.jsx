import React, { useEffect, useState } from "react";
import { Eye, Play, FileText, X } from "lucide-react";
import { db } from "../../../db";

const FormPreview = ({ forms: createdForms = [] }) => {
  const [activeTab, setActiveTab] = useState("created");
  const [selectedItem, setSelectedItem] = useState(null);
  const [modalType, setModalType] = useState("");

  const [appliedForms, setAppliedForms] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setAppliedForms(await db.capa_responses.toArray());
    };
    loadData();
  }, []);

  const handleAction = (item, type) => {
    setSelectedItem(item);
    setModalType(type);
  };

  const closeAction = () => {
    setSelectedItem(null);
    setModalType("");
  };

  const tableData = activeTab === "created" ? createdForms : appliedForms;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="border-b p-4 flex justify-between bg-slate-50/50">
        <h2 className="font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-600" />
          Form Dashboard
        </h2>

        <div className="flex gap-3">
          <button
            onClick={() => setActiveTab("created")}
            className={activeTab === "created" ? "font-semibold" : ""}
          >
            Created Forms
          </button>
          <button
            onClick={() => setActiveTab("applied")}
            className={activeTab === "applied" ? "font-semibold" : ""}
          >
            Applied Forms
          </button>
        </div>
      </div>

      {/* Table */}
      <table className="w-full">
        <thead className="border-b text-xs text-slate-500">
          <tr>
            <th className="px-6 py-3">Form Name</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">
              {activeTab === "created" ? "Created By" : "Filled By"}
            </th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((form) => (
            <tr key={form.id} className="border-b">
              <td className="px-6 py-3 font-medium">{form.title}</td>
              <td className="px-6 py-3 text-sm text-slate-500">
                {form.createdAt || form.filledAt}
              </td>
              <td className="px-6 py-3 text-sm text-slate-600">
                {form.createdBy || form.filledBy || "—"}
              </td>
              <td className="px-6 py-3 text-right">
                <button
                  onClick={() =>
                    handleAction(form, activeTab === "created" ? "use" : "view")
                  }
                  className="text-indigo-600 text-sm"
                >
                  {activeTab === "created" ? "Use Form" : "View"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-96">
            <h3 className="font-semibold mb-3">
              {modalType === "use" ? "Use Form" : "Form Details"}
            </h3>
            <p>{selectedItem.title}</p>
            <button onClick={closeAction} className="mt-4">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormPreview;
