import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Users,
  Save,
  X,
} from "lucide-react";
import { dummyUSerData } from "../../../db/dummyUSerData";

const CreateMeetingPage = ({ onSave, onCancel, initialData = null }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    initialData || {
      title: "",
      date: "",
      time: "",
      location: "",
      agenda: "",
      invitedAttendees: [],
    },
  );

  const [selectedUsers, setSelectedUsers] = useState(
    initialData?.invitedAttendees || [],
  );
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleUserSelection = (user) => {
    setSelectedUsers((prev) => {
      const isSelected = prev.some((u) => u.id === user.id);
      if (isSelected) {
        return prev.filter((u) => u.id !== user.id);
      } else {
        return [...prev, user];
      }
    });
  };

  const removeUser = (userId) => {
    setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const meetingData = {
      ...formData,
      invitedAttendees: selectedUsers,
    };
    onSave(meetingData);
  };

  const filteredUsers = dummyUSerData.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="w-full px-4 md:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {initialData ? "Edit Meeting" : "Create New Meeting"}
              </h1>
              <p className="text-gray-500 mt-1">
                Schedule a Management Review Meeting (ISO 9001:2015 Clause 9.3)
              </p>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Meeting Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Calendar className="text-indigo-600" size={24} />
              Meeting Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
              {/* Meeting Title */}
              <div className="md:col-span-2 xl:col-span-3">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="e.g., Q1 2026 Management Review"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar size={16} className="text-indigo-500" />
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>

              {/* Time */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Clock size={16} className="text-indigo-500" />
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>

              {/* Location */}
              <div className="md:col-span-2 xl:col-span-1">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-indigo-500" />
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleChange("location", e.target.value)}
                  placeholder="e.g., Conference Room A..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-xs"
                />
              </div>

              {/* Agenda */}
              <div className="md:col-span-2 xl:col-span-3">
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-indigo-500" />
                  Agenda *
                </label>
                <textarea
                  required
                  value={formData.agenda}
                  onChange={(e) => handleChange("agenda", e.target.value)}
                  placeholder="Outline the key topics to be discussed..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Attendees Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users className="text-indigo-600" size={24} />
              Invite Attendees
            </h2>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Selected ({selectedUsers.length})
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg border border-indigo-200"
                    >
                      <span className="text-sm font-medium">
                        {user.username}
                      </span>
                      <span className="text-xs text-indigo-500">
                        ({user.department})
                      </span>
                      <button
                        type="button"
                        onClick={() => removeUser(user.id)}
                        className="ml-1 text-indigo-400 hover:text-indigo-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Users */}
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search by name, email, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* User List */}
            <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Select
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.map((user) => {
                    const isSelected = selectedUsers.some(
                      (u) => u.id === user.id,
                    );
                    return (
                      <tr
                        key={user.id}
                        onClick={() => toggleUserSelection(user)}
                        className={`cursor-pointer hover:bg-gray-50 transition-colors ${isSelected ? "bg-indigo-50" : ""
                          }`}
                      >
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => { }}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {user.username}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.role}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {user.department}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-red-200 hover:text-red-600 transition-colors font-medium"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 text-black rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2 shadow-sm"
            >
              <Save size={20} />
              {initialData ? "Update Meeting" : "Create Meeting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingPage;
