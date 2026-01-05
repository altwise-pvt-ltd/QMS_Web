import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <--- 1. Import Hook
import {
  Search,
  FolderOpen,
  File,
  ChevronRight,
  ArrowRight,
  Plus,
} from "lucide-react";
import { DOC_LEVELS } from "./data.js";
import { createSearchParams } from "react-router-dom";

/* 
    TODO: add a Working Search bar and Leagal Documentation Upload and preview 
      as per the iso Standard
  */

const DocumentLibrary = () => {
  const [activeLevelId, setActiveLevelId] = useState("level-1");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate(); // <--- 3. Initialize Hook

  const activeData = DOC_LEVELS.find((l) => l.id === activeLevelId);

  // Helper to handle navigation for viewing
  const handleViewClick = (docName) => {
    navigate({
      pathname: "/documents/view",
      search: createSearchParams({
        category: activeData.title,
        subCategory: docName,
      }).toString(),
    });
  };

  // Helper to handle navigation with params for upload
  const handleUploadClick = (docName = "", sectionName = "") => {
    navigate({
      pathname: "/documents/upload",
      search: createSearchParams({
        level: activeLevelId,
        category: activeData.title,
        ...(docName && { subCategory: docName }),
        ...(sectionName && { section: sectionName }),
      }).toString(),
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen bg-slate-50/50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Document Library
          </h1>
          <p className="text-slate-600">ISO 15189 Documentation Pyramid</p>
        </div>

        {/* Action Area: Search + Upload */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm shadow-sm transition-all"
            />
          </div>

          <button
            onClick={() => handleUploadClick()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600  text-sm font-semibold rounded-lg border-2 border-indigo-700 hover:bg-indigo-700 hover:border-indigo-800 hover:shadow-lg hover:shadow-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 active:scale-95 shadow-md whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar (The Pyramid) */}
        <div className="lg:w-1/3 space-y-3">
          {DOC_LEVELS.map((level) => {
            const Icon = level.icon;
            const isActive = activeLevelId === level.id;
            return (
              <button
                key={level.id}
                onClick={() => setActiveLevelId(level.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group ${
                  isActive
                    ? "bg-indigo-50/40 border-indigo-600 shadow-md ring-1 ring-indigo-600/20"
                    : "bg-white border-slate-200 hover:border-indigo-400 hover:bg-slate-50/80 hover:shadow-sm"
                }`}
              >
                <div className={`p-3 rounded-lg shadow-sm ${level.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isActive ? "text-indigo-700/70" : "text-slate-500"
                    }`}
                  >
                    Level {level.level}
                  </span>
                  <h3
                    className={`font-semibold ${
                      isActive ? "text-indigo-800" : "text-slate-800"
                    }`}
                  >
                    {level.title}
                  </h3>
                  <p
                    className={`text-xs mt-1 ${
                      isActive ? "text-indigo-700/70" : "text-slate-500"
                    }`}
                  >
                    {level.description}
                  </p>
                </div>
                <ChevronRight
                  className={`w-5 h-5 transition-transform ${
                    isActive
                      ? "text-indigo-600 rotate-90 lg:rotate-0"
                      : "text-slate-400 group-hover:text-indigo-400"
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="lg:w-2/3 bg-gray-50 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col h-fit overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-indigo-600" />
              {activeData.title}
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Browse documents in Level {activeData.level}
            </p>
          </div>

          <div className="p-6 bg-white">
            {activeData.items && (
              <div className="grid grid-cols-1 gap-3">
                {activeData.items.map((doc, idx) => (
                  <DocumentRow
                    key={idx}
                    name={doc.name || doc}
                    onView={handleViewClick}
                    onUpload={handleUploadClick}
                  />
                ))}
              </div>
            )}
            {activeData.sections && (
              <div className="space-y-8">
                {activeData.sections.map((section, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-400 ring-4 ring-indigo-50"></span>
                      {section.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {section.items.map((docName, dIdx) => (
                        <DocumentRow
                          key={dIdx}
                          name={docName}
                          onView={handleViewClick}
                          onUpload={(name) =>
                            handleUploadClick(name, section.title)
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentRow = ({ name, onView, onUpload }) => (
  <div
    onClick={() => onView(name)}
    className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer hover:shadow-sm"
  >
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200 shadow-sm group-hover:shadow-indigo-200">
        <File className="w-4 h-4" />
      </div>
      <div>
        <span className="block text-sm font-semibold text-slate-700 group-hover:text-indigo-800">
          {name}
        </span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-indigo-400">
          Canonical View
        </span>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onUpload(name);
        }}
        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-100 rounded-md transition-all opacity-0 group-hover:opacity-100"
        title="Upload New Version"
      >
        <Plus className="w-4 h-4" />
      </button>
      <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

export default DocumentLibrary;
