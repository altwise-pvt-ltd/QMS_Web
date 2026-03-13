import React from "react";
import { Plus, Trash2, AlertCircle, CheckCircle2, Award } from "lucide-react";

const SkillsMatrix = ({ skills, handleDynamicChange, addRow, removeRow }) => {
  return (
    <section className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-purple-600 rounded-full" />
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              2. Skills & Competency Matrix
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5 ml-0.5">Performance Benchmarking</p>
          </div>
        </div>
        
        <button
          type="button"
          onClick={() =>
            addRow("skills", {
              staffSkillsAndCompetencyMatrixId: 0,
              skillName: "",
              requestLevel: "3",
              actualLevel: "1",
              gap: true,
            })
          }
          className="group flex items-center gap-2 px-5 py-2.5 bg-purple-50 text-purple-700 rounded-xl font-bold text-sm hover:bg-purple-600 hover:text-white transition-all duration-300 shadow-sm border border-purple-100 hover:shadow-indigo-100"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-transform" />
          Add New Skill
        </button>
      </div>

      <div className="overflow-x-auto -mx-2 px-2 pb-4">
        <table className="min-w-full border-separate border-spacing-y-3">
          <thead>
            <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              <th className="px-4 py-2 text-left">Competency / Skill Description</th>
              <th className="px-4 py-2 text-center w-32">Req. Level</th>
              <th className="px-4 py-2 text-center w-32">Current Level</th>
              <th className="px-4 py-2 text-center w-32">Status</th>
              <th className="px-4 py-2 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {skills.map((skill, index) => (
              <tr
                key={skill.staffSkillsAndCompetencyMatrixId || skill.id || index}
                className="group/row"
              >
                <td className="px-4 py-1">
                  <div className="relative">
                    <Award className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-300 group-hover/row:text-purple-500 transition-colors" size={16} />
                    <input
                      type="text"
                      placeholder="e.g. Laboratory Sample Analysis"
                      value={skill.skillName || ""}
                      onChange={(e) =>
                        handleDynamicChange(index, "skillName", e.target.value, "skills")
                      }
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-50 transition-all outline-hidden"
                    />
                  </div>
                </td>
                
                <td className="px-4 py-1 text-center">
                  <div className="flex justify-center">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={skill.requestLevel || ""}
                      onChange={(e) =>
                        handleDynamicChange(index, "requestLevel", e.target.value, "skills")
                      }
                      className="w-16 px-2 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-center text-sm font-black text-slate-800 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-50 transition-all outline-hidden appearance-none"
                    />
                  </div>
                </td>

                <td className="px-4 py-1 text-center">
                  <div className="flex justify-center">
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={skill.actualLevel || ""}
                      onChange={(e) =>
                        handleDynamicChange(index, "actualLevel", e.target.value, "skills")
                      }
                      className={`w-16 px-2 py-3 bg-slate-50 border rounded-2xl text-center text-sm font-black transition-all outline-hidden ${
                        skill.gap 
                        ? "border-amber-200 text-amber-700 bg-amber-50/50" 
                        : "border-slate-100 text-slate-800 focus:border-purple-600"
                      }`}
                    />
                  </div>
                </td>

                <td className="px-4 py-1 text-center">
                  <div className="flex justify-center">
                    {skill.gap ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 animate-pulse-slow">
                        <AlertCircle size={14} /> Gap
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <CheckCircle2 size={14} /> OK
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-1 text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(index, "skills")}
                    className="p-2.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all opacity-0 group-hover/row:opacity-100"
                    title="Remove skill"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {skills.length === 0 && (
        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl">
          <Award className="text-slate-200 mb-3" size={48} />
          <p className="text-slate-400 font-bold">No skills added yet</p>
          <button 
             type="button"
             onClick={() => addRow("skills", { skillName: "", requestLevel: "3", actualLevel: "1", gap: true })}
             className="mt-2 text-indigo-600 font-bold text-sm hover:underline"
          >
            Click to add first skill
          </button>
        </div>
      )}
    </section>
  );
};

export default SkillsMatrix;
