import React, { useState } from "react";
import { Users, Check, X, ArrowLeft, Save, UserCheck } from "lucide-react";

const AttendanceSelection = ({
  meeting,
  onSave,
  onBack,
  initialAttendance = [],
}) => {
  const invitedAttendees = meeting?.invitedAttendees || [];

  // Initialize attendance state. If we already have saved attendance, use it.
  // Otherwise, default all invited attendees to 'Present'.
  const [attendance, setAttendance] = useState(() => {
    if (initialAttendance && initialAttendance.length > 0) {
      return invitedAttendees.map((invited, index) => {
        const invitedId = invited.id || invited.userId || `id-${index}`;
        const existing = initialAttendance.find(
          (a) => a.userId === invitedId || a.username === invited.username,
        );
        return {
          ...invited,
          id: invitedId,
          status: existing ? existing.status : "Present",
        };
      });
    }
    return invitedAttendees.map((user, index) => ({
      ...user,
      id: user.id || user.userId || `id-${index}`,
      status: "Present",
    }));
  });

  const toggleStatus = (userId) => {
    setAttendance((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
            ...user,
            status: user.status === "Present" ? "Absent" : "Present",
          }
          : user,
      ),
    );
  };

  const handleFinalSave = () => {
    onSave(attendance);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 lg:p-12 font-sans">
      <div className="w-full px-4 md:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-4 group"
            >
              <ArrowLeft
                size={20}
                className="group-hover:-translate-x-1 transition-transform"
              />
              <span className="font-semibold text-sm">Return to Minutes</span>
            </button>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <UserCheck className="text-indigo-600" size={24} />
              </div>
              Attendance Verification
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Verify actual participation for: {meeting?.title}
            </p>
          </div>
          <button
            onClick={handleFinalSave}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-black rounded-xl hover:bg-indigo-700 shadow-lg font-bold transition-all active:scale-95"
          >
            <Save size={20} /> Finalize & Save All
          </button>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-4 text-blue-700">
          <div className="bg-blue-100 p-2 rounded-lg shrink-0">
            <Users size={20} />
          </div>
          <div>
            <p className="font-bold text-sm">Attendance List</p>
            <p className="text-xs mt-1 leading-relaxed">
              Mark who actually attended the meeting. Only invited participants
              are shown here. By default, all invited users are marked as{" "}
              <strong>Present</strong>.
            </p>
          </div>
        </div>

        {/* Attendance List */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Participant
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Department / Role
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-widest text-center">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendance.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {user.username}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-gray-700">
                        {user.department}
                      </span>
                      <span className="text-xs text-gray-400">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`group flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all font-bold text-xs ${user.status === "Present"
                            ? "bg-green-50 border-green-200 text-green-700"
                            : "bg-red-50 border-red-200 text-red-700"
                          }`}
                      >
                        {user.status === "Present" ? (
                          <>
                            <Check size={16} /> Present
                          </>
                        ) : (
                          <>
                            <X size={16} /> Absent
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-12 text-center text-gray-500 italic"
                  >
                    No invited attendees found for this meeting.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Summary Footer */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Total Invited
              </span>
              <span className="text-lg font-bold text-gray-900">
                {attendance.length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Present
              </span>
              <span className="text-lg font-bold text-green-600">
                {attendance.filter((u) => u.status === "Present").length}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Absent
              </span>
              <span className="text-lg font-bold text-red-600">
                {attendance.filter((u) => u.status === "Absent").length}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-gray-400 font-medium italic">
            * Changes are saved only when you click "Finalize & Save All"
          </p>
        </div>
      </div>
    </div>
  );
};

export default AttendanceSelection;
