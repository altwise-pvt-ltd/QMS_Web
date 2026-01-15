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
    <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-linear-to-r from-indigo-600 to-indigo-700 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{meeting?.title}</h2>
            <p className="text-indigo-100 text-sm mt-1">
              Meeting Details & Export
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loadingData ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : showPdfPreview ? (
            <div className="h-[600px] border border-gray-300 rounded-lg overflow-hidden">
              <PDFViewer width="100%" height="100%" showToolbar={true}>
                {renderPdfPreview(meeting, actionItems, minutes)}
              </PDFViewer>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Meeting Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h3 className="font-bold text-gray-900 mb-3">
                  Meeting Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{meeting?.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{meeting?.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-gray-500" />
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">
                      {meeting?.location || "Not specified"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-bold ${
                        meeting?.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : meeting?.status === "In Progress"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {meeting?.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Attendees */}
              {meeting?.invitedAttendees &&
                meeting.invitedAttendees.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Users size={18} className="text-indigo-600" />
                      Attendees ({meeting.invitedAttendees.length})
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {meeting.invitedAttendees.map((attendee, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                          <span className="font-medium">
                            {attendee.username}
                          </span>
                          <span className="text-gray-500">
                            ({attendee.role})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Action Items */}
              {actionItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Action Items ({actionItems.length})
                  </h3>
                  <div className="space-y-2">
                    {actionItems.slice(0, 5).map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded border border-gray-200"
                      >
                        <p className="font-medium text-sm">{item.task}</p>
                        {item.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.dueDate && (
                          <p className="text-xs text-gray-500 mt-1">
                            Due: {item.dueDate}
                          </p>
                        )}
                      </div>
                    ))}
                    {actionItems.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{actionItems.length - 5} more action items
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Minutes Summary */}
              {minutes?.agendaItems && minutes.agendaItems.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-bold text-gray-900 mb-3">
                    Agenda Items ({minutes.agendaItems.length})
                  </h3>
                  <div className="space-y-2">
                    {minutes.agendaItems.slice(0, 3).map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded border border-gray-200"
                      >
                        <p className="font-medium text-sm">
                          {item.input || item.topic}
                        </p>
                        {(item.activity || item.discussion) && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.activity || item.discussion}
                          </p>
                        )}
                      </div>
                    ))}
                    {minutes.agendaItems.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{minutes.agendaItems.length - 3} more agenda items
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer - PDF Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
            <p className="text-sm text-gray-600">
              Export meeting documentation as PDF
            </p>
            <div className="flex gap-2 flex-wrap justify-center">
              <button
                onClick={() => {
                  onClose();
                  // Trigger PDF view in parent
                  window.dispatchEvent(
                    new CustomEvent("viewMrmPdf", { detail: meeting })
                  );
                }}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-gray-600 rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium disabled:opacity-50 text-sm"
              >
                <FileText size={16} />
                View PDF Full Page
              </button>

              <button
                onClick={handlePreview}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors shadow-sm font-medium disabled:opacity-50 text-sm"
              >
                <Eye size={16} />
                {showPdfPreview ? "Hide Preview" : "Preview PDF"}
              </button>

              <button
                onClick={handleGenerateMRMPdf}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-gray-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium disabled:opacity-50 text-sm"
              >
                <Download size={16} />
                MRM PDF
              </button>

              <button
                onClick={handleGenerateMinutesPdf}
                disabled={loading || loadingData}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-gray-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm font-medium disabled:opacity-50 text-sm"
              >
                <FileText size={16} />
                Minutes PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingViewModal;
