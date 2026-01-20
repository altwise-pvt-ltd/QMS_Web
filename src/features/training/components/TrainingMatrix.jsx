import React, { useState, useEffect } from "react";
import { CheckCircle2, Circle, AlertCircle, Users, Layout } from "lucide-react";
import { db } from "../../../db";

const TrainingMatrix = () => {
  const [staff, setStaff] = useState([]);
  const [modules, setModules] = useState([]);
  const [matrixData, setMatrixData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMatrixData = async () => {
      try {
        setLoading(true);
        const staffData = await db.staff.toArray();
        const eventTypes = await db.compliance_event_types.toArray();
        const trainingType = eventTypes.find((t) => t.name === "Training");

        if (!trainingType) {
          setStaff(staffData);
          setLoading(false);
          return;
        }

        const trainingEvents = await db.compliance_events
          .where("eventTypeId")
          .equals(trainingType.id)
          .toArray();

        // Get unique training titles as "Modules"
        const uniqueTitles = [...new Set(trainingEvents.map((e) => e.title))];
        const moduleList = uniqueTitles.map((title, idx) => ({
          id: `mod-${idx}`,
          name: title,
        }));
        setModules(moduleList);

        const attendance = await db.training_attendance.toArray();
        const today = new Date().toISOString().split("T")[0];

        const calculatedMatrix = {};
        staffData.forEach((person) => {
          calculatedMatrix[person.id] = {};

          uniqueTitles.forEach((title) => {
            // Find the most relevant record for this person and module
            const records = attendance.filter((a) => {
              const event = trainingEvents.find((e) => e.id === a.eventId);
              return a.staffId === person.id && event && event.title === title;
            });

            if (records.length > 0) {
              // Sort by date to get the latest/most relevant
              const latestRecord = records.sort((a, b) => {
                const eA = trainingEvents.find((e) => e.id === a.eventId);
                const eB = trainingEvents.find((e) => e.id === b.eventId);
                return new Date(eB.dueDate) - new Date(eA.dueDate);
              })[0];

              const relatedEvent = trainingEvents.find(
                (e) => e.id === latestRecord.eventId,
              );

              if (latestRecord.status === "completed") {
                calculatedMatrix[person.id][title] = "completed";
              } else if (relatedEvent.dueDate < today) {
                calculatedMatrix[person.id][title] = "overdue";
              } else {
                calculatedMatrix[person.id][title] = latestRecord.status; // pending or in-progress
              }
            } else {
              calculatedMatrix[person.id][title] = "not-required";
            }
          });
        });

        setStaff(staffData);
        setMatrixData(calculatedMatrix);
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
      case "overdue":
        return <AlertCircle className="text-rose-500" size={18} />;
      case "not-required":
        return <div className="w-4 h-0.5 bg-slate-200"></div>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full bg-linear-to-br from-white to-slate-50/30">
      {/* Matrix Header */}
      <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Layout size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">
              Competency Matrix
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Live Staff Qualification Tracking
            </p>
          </div>
        </div>

        <div className="hidden xl:flex gap-6 text-[10px] font-black uppercase tracking-widest text-slate-500 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={14} />
            <span>Qualified</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="text-blue-500 fill-blue-500" size={8} />
            <span>In Training</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-amber-500" size={14} />
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle className="text-rose-500" size={14} />
            <span>Overdue</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto flex-1 custom-scrollbar">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="w-72 px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 sticky left-0 bg-slate-50 z-20">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  Staff Member
                </div>
              </th>
              {modules.map((mod) => (
                <th
                  key={mod.id}
                  className="w-24 px-4 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-slate-100 text-center"
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="[writing-mode:vertical-rl] rotate-180 inline-block py-2 whitespace-nowrap min-h-[120px]">
                      {mod.name}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td
                  colSpan={modules.length + 1}
                  className="p-10 text-center text-slate-400 font-bold"
                >
                  Analyzing personnel directory...
                </td>
              </tr>
            ) : staff.length === 0 ? (
              <tr>
                <td
                  colSpan={modules.length + 1}
                  className="p-10 text-center text-slate-400 font-bold"
                >
                  No active staff found in directory
                </td>
              </tr>
            ) : (
              staff.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-8 py-5 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-50 z-10 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.05)]">
                    <p className="font-bold text-slate-800 text-nowrap">
                      {person.name}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                      {person.role}
                    </p>
                  </td>
                  {modules.map((mod) => (
                    <td
                      key={mod.id}
                      className="px-4 py-5 text-center border-r border-slate-50/50 last:border-r-0"
                    >
                      <div className="flex justify-center items-center h-full">
                        {getStatusIcon(matrixData[person.id]?.[mod.name])}
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
