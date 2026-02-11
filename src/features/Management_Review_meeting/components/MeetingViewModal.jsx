import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Eye,
  FileText,
  Calendar,
  MapPin,
  Users,
} from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import {
  generateMRMPdf,
  generateMinutesPdf,
  renderPdfPreview,
} from "../utils/pdfUtils.jsx";

const MeetingViewModal = ({
  meeting,
  isOpen,
  onClose,
  getActionItems,
  getMinutes,
  onViewPdf,
}) => {
  const [actionItems, setActionItems] = useState([]);
  const [minutes, setMinutes] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  useEffect(() => {
    if (isOpen && meeting) {
      loadMeetingData();
    }
  }, [isOpen, meeting]);

  const loadMeetingData = async () => {
    setLoadingData(true);
    try {
      const [actions, mins] = await Promise.all([
        getActionItems(meeting.id),
        getMinutes(meeting.id),
      ]);
      setActionItems(actions || []);
      setMinutes(mins);
    } catch (error) {
      console.error("Error loading meeting data:", error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleGenerateMRMPdf = async () => {
    setLoading(true);
    const success = await generateMRMPdf(meeting, actionItems, minutes);
    setLoading(false);
    if (success) {
      alert("MRM PDF downloaded successfully!");
    } else {
      alert("Error generating PDF");
    }
  };

  const handleGenerateMinutesPdf = async () => {
    setLoading(true);
    const success = await generateMinutesPdf(meeting, actionItems, minutes);
    setLoading(false);
    if (success) {
      alert("Minutes PDF downloaded successfully!");
    } else {
      alert("Error generating PDF");
    }
  };

  const handlePreview = () => {
    setShowPdfPreview(!showPdfPreview);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 lg:p-12">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-700 to-indigo-800 px-6 py-5 lg:px-8 lg:py-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
              {meeting?.title}
            </h2>
            <div className="flex items-center gap-4 text-indigo-100/80 text-sm mt-1.5">
              <span className="bg-white/10 px-2 py-0.5 rounded font-semibold border border-white/10 uppercase tracking-widest text-[10px]">
                Review Document
              </span>
              <span>•</span>
              <p>
                Reference:{" "}
                {meeting?.id?.toString().slice(-6).toUpperCase() || "NEW"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-600 hover:bg-white/10 p-2.5 rounded-xl transition-all active:scale-95"
          >
            <X size={28} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-slate-50/30">
          {loadingData ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-indigo-600 border-t-transparent shadow-md"></div>
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                Loading meeting records...
              </p>
            </div>
          ) : showPdfPreview ? (
            <div className="h-[600px] lg:h-[700px] border border-gray-200 rounded-2xl overflow-hidden shadow-inner bg-gray-200/50">
              <PDFViewer width="100%" height="100%" showToolbar={true}>
                {renderPdfPreview(meeting, actionItems, minutes)}
              </PDFViewer>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              {/* Left Column: Core Info & Attendees */}
              <div className="space-y-8">
                {/* Meeting Info */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                    <Calendar size={20} className="text-indigo-600" />
                    Meeting Information
                  </h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Date
                      </span>
                      <p className="font-semibold text-gray-800 text-base">
                        {meeting?.date}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Time
                      </span>
                      <p className="font-semibold text-gray-800 text-base">
                        {meeting?.time}
                      </p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Location / Venue
                      </span>
                      <p className="font-semibold text-gray-800 text-base flex items-center gap-2">
                        <MapPin size={16} className="text-gray-400" />
                        {meeting?.location || "Not specified"}
                      </p>
                    </div>
                    <div className="space-y-1 col-span-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        Status Indicator
                      </span>
                      <div className="pt-1">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${
                            meeting?.status === "Completed"
                              ? "bg-green-50 text-green-700 border-green-100"
                              : meeting?.status === "In Progress"
                                ? "bg-blue-50 text-blue-700 border-blue-100"
                                : "bg-gray-50 text-gray-700 border-gray-100"
                          }`}
                        >
                          {meeting?.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendees */}
                {(() => {
                  const rawAttendees =
                    meeting?.invitedAttendees || meeting?.invites || [];
                  const attendeesList = Array.isArray(rawAttendees)
                    ? rawAttendees.map((att) =>
                        typeof att === "string"
                          ? { username: att, role: "Attendee" }
                          : {
                              username: att.username || att.name || "Unknown",
                              role: att.role || att.department || "Attendee",
                            },
                      )
                    : typeof (rawAttendees || meeting?.attendees) === "string"
                      ? (rawAttendees || meeting?.attendees)
                          .split(",")
                          .map((s) => ({
                            username: s.trim(),
                            role: "Attendee",
                          }))
                          .filter((a) => a.username)
                      : [];

                  if (attendeesList.length === 0) return null;

                  return (
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                        <Users size={20} className="text-indigo-600" />
                        Meeting Attendees ({attendeesList.length})
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {attendeesList.map((attendee, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {attendee.username?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-800 text-sm truncate">
                                {attendee.username}
                              </p>
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter truncate">
                                {attendee.role}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Right Column: Decisions & Action Items */}
              <div className="space-y-8">
                {/* Action Items */}
                {actionItems.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-5 flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2">
                        <FileText size={20} className="text-indigo-600" />
                        Key Action Items
                      </span>
                      <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-bold">
                        {actionItems.length} Total
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {actionItems.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-indigo-200 transition-colors"
                        >
                          <p className="font-bold text-gray-800 text-sm">
                            {item.task}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                          {item.dueDate && (
                            <div className="flex items-center gap-1.5 mt-2.5">
                              <Calendar size={12} className="text-indigo-400" />
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">
                                Due: {item.dueDate}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      {actionItems.length > 5 && (
                        <div className="text-center pt-2">
                          <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">
                            + View {actionItems.length - 5} More Actions
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Minutes Summary */}
                {minutes?.agendaItems && minutes.agendaItems.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-5 flex items-center justify-between text-lg">
                      <span className="flex items-center gap-2">
                        <FileText size={20} className="text-indigo-600" />
                        Minutes of Discussion
                      </span>
                      <span className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md font-bold">
                        {minutes.agendaItems.length} Topics
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {minutes.agendaItems.slice(0, 5).map((item, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-slate-200 transition-colors"
                        >
                          <p className="font-bold text-gray-800 text-sm">
                            {item.input || item.topic}
                          </p>
                          {(item.activity || item.discussion) && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                              {item.activity || item.discussion}
                            </p>
                          )}
                        </div>
                      ))}
                      {minutes.agendaItems.length > 5 && (
                        <div className="text-center pt-2">
                          <button className="text-xs font-bold text-slate-600 hover:text-indigo-600 uppercase tracking-widest">
                            + View {minutes.agendaItems.length - 5} More Topics
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer - PDF Actions */}
        <div className="bg-gray-50 px-8 py-6 border-t border-gray-200 shrink-0">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div className="space-y-1">
              <p className="text-base font-bold text-gray-800">
                Documentation Portal
              </p>
              <p className="text-sm text-gray-500">
                Authorized export for ISO compliance audit trails
              </p>
            </div>
            <div className="flex gap-3 flex-wrap justify-center">
              <button
                onClick={() => {
                  onClose();
                  // Trigger PDF view in parent
                  window.dispatchEvent(
                    new CustomEvent("viewMrmPdf", { detail: meeting }),
                  );
                }}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold disabled:opacity-50 text-sm active:scale-95"
              >
                <Eye size={18} />
                Full Page View
              </button>

              <button
                onClick={handlePreview}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-sm font-bold disabled:opacity-50 text-sm active:scale-95"
              >
                <FileText size={18} />
                {showPdfPreview ? "Hide Preview" : "Interactive Preview"}
              </button>

              <div className="h-10 w-px bg-gray-300 mx-1 hidden lg:block"></div>

              <button
                onClick={handleGenerateMRMPdf}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-black rounded-xl hover:bg-indigo-700 transition-all shadow-md font-bold disabled:opacity-50 text-sm active:scale-95"
              >
                <Download size={18} />
                Download Review (PDF)
              </button>

              <button
                onClick={handleGenerateMinutesPdf}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-6 py-2.5 bg-slate-800 text-black rounded-xl hover:bg-slate-900 transition-all shadow-md font-bold disabled:opacity-50 text-sm active:scale-95"
              >
                <FileText size={18} />
                Download Minutes (PDF)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingViewModal;
