import React from "react";
import { Plus, Trash2, AlertCircle, CheckCircle } from "lucide-react";

const SkillsMatrix = ({ skills, handleDynamicChange, addRow, removeRow }) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700 border-l-4 border-purple-500 pl-3">
          3. Skills & Competency Matrix
        </h2>
        <button
          type="button"
          onClick={() =>
            addRow("skills", {
              name: "",
              requiredLevel: "3",
              actualLevel: "1",
              gap: true,
            })
          }
          className="text-sm bg-purple-600 text-black px-4 py-2 rounded-lg hover:bg-purple-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 font-medium shadow-sm"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Skill Name
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Req. Level (1-5)
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Actual Level
              </th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {skills.map((skill, index) => (
              <tr key={skill.id}>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    placeholder="e.g. Java Spring Boot"
                    value={skill.name}
                    onChange={(e) =>
                      handleDynamicChange(
                        index,
                        "name",
                        e.target.value,
                        "skills"
                      )
                    }
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500 sm:text-sm border p-1"
                  />
                </td>
                <td className="px-3 py-2 w-24">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skill.requiredLevel}
                    onChange={(e) =>
                      handleDynamicChange(
                        index,
                        "requiredLevel",
                        e.target.value,
                        "skills"
                      )
                    }
                    className="w-full border-gray-300 rounded-md border p-1"
                  />
                </td>
                <td className="px-3 py-2 w-24">
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={skill.actualLevel}
                    onChange={(e) =>
                      handleDynamicChange(
                        index,
                        "actualLevel",
                        e.target.value,
                        "skills"
                      )
                    }
                    className="w-full border-gray-300 rounded-md border p-1"
                  />
                </td>
                <td className="px-3 py-2">
                  {skill.gap ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                      <AlertCircle size={12} /> Gap
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
                      <CheckCircle size={12} /> Competent
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    onClick={() => removeRow(index, "skills")}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-colors"
                    title="Remove skill"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default SkillsMatrix;
