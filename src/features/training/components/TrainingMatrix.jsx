import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { db } from "../../../db";

const TrainingMatrix = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  const modules = [
    { id: "mod1", name: "Safety Protocol" },
    { id: "mod2", name: "QMS awareness" },
    { id: "mod3", name: "Instrument OP" },
    { id: "mod4", name: "Blood Collection" },
  ];

  // Mock competency data for now, but linked to real staff IDs
  const [matrixData, setMatrixData] = useState({});

  useEffect(() => {
    const loadMatrixData = async () => {
      try {
        setLoading(true);
        const staffData = await db.staff.toArray();
        setStaff(staffData);

        // Generate some realistic mock data based on staff status
        const mockMatrix = {};
        staffData.forEach((person) => {
          mockMatrix[person.id] = {
            mod1: person.status === "Competent" ? "completed" : "completed",
            mod2: person.status === "Competent" ? "completed" : "in-progress",
            mod3:
              person.dept === "Quality" || person.dept === "Engineering"
                ? "completed"
                : "not-required",
            mod4: person.dept === "Quality" ? "completed" : "pending",
          };
        });
        setMatrixData(mockMatrix);
      } catch (error) {
        console.error("Error loading matrix data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMatrixData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "in-progress":
        return <Circle className="text-blue-500 fill-blue-500" size={12} />;
      case "pending":
        return <AlertCircle className="text-amber-500" size={18} />;
      case "not-required":
        return <div className="w-4 h-0.5 bg-slate-200"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-8 border-b border-slate-50 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Competency Matrix
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Live data from Personnel directory
          </p>
        </div>
        <div className="hidden sm:flex gap-4 text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="text-emerald-500" size={14} /> Done
          </div>
          <div className="flex items-center gap-1.5">
            <AlertCircle className="text-amber-500" size={14} /> Req
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 sticky left-0 bg-slate-50 z-10">
                Staff Member
              </th>
              {modules.map((mod) => (
                <th
                  key={mod.id}
                  className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center"
                >
                  <span className="[writing-mode:vertical-rl] rotate-180 inline-block py-2">
                    {mod.name}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td
                  colSpan={modules.length + 1}
                  className="p-10 text-center text-slate-400"
                >
                  Loading directory...
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td
                  colSpan={modules.length + 1}
                  className="p-10 text-center text-slate-400"
                >
                  No staff found
                </td>
              </tr>
            ) : (
              staff.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-8 py-4 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-50 z-10">
                    <p className="font-bold text-slate-800 text-nowrap">
                      {person.name}
                    </p>
                    <p className="text-xs text-slate-500">{person.role}</p>
                  </td>
                  {modules.map((mod) => (
                    <td key={mod.id} className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center h-full">
                        {getStatusIcon(matrixData[person.id]?.[mod.id])}
                      </div>
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrainingMatrix;
