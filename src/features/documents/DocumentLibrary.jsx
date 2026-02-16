import React, { useState, useEffect, useRef } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import {
  Search,
  FolderOpen,
  File,
  ChevronRight,
  ArrowRight,
  Plus,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { LEVEL_CONFIG } from "./data.js";
import documentService from "./services/documentService";
import {
  transformCategory,
  transformSubCategory,
} from "./services/documentTransformer";

const DocumentLibrary = () => {
  const [levels, setLevels] = useState([]);
  const [activeLevelId, setActiveLevelId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingSub, setLoadingSub] = useState(false);

  const navigate = useNavigate();
  // Ref to track the current active level for race condition handling
  const activeLevelRef = useRef(null);

  // Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await documentService.getCategories();
        const transformedLevels = data.map((cat) => {
          let levelNum = cat.documentCategoryLevel;
          if (typeof levelNum === "string") {
            const match = levelNum.match(/\d+/);
            levelNum = match ? parseInt(match[0], 10) : 0;
          }
          return transformCategory(cat, LEVEL_CONFIG[levelNum]);
        });

        // Sort by level number to ensure correct order
        transformedLevels.sort((a, b) => a.level - b.level);

        setLevels(transformedLevels);

        // Set initial active level
        if (transformedLevels.length > 0) {
          const firstLevelId = transformedLevels[0].id;
          setActiveLevelId(firstLevelId);
          activeLevelRef.current = firstLevelId;
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load document categories.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Subcategories when active level changes
  useEffect(() => {
    if (!activeLevelId) return;

    // Update ref immediately
    activeLevelRef.current = activeLevelId;

    const fetchSubItems = async () => {
      // Find current level data
      const currentLevelIndex = levels.findIndex((l) => l.id === activeLevelId);
      if (currentLevelIndex === -1) return;

      // Check if items are already loaded (simple caching check)
      // Note: If you want to force refresh on click, remove this check or add a refresh button
      if (
        levels[currentLevelIndex].items &&
        levels[currentLevelIndex].items.length > 0
      ) {
        return;
      }

      try {
        setLoadingSub(true);
        const subData = await documentService.getSubCategories(activeLevelId);

        // Race condition check: Ensure we are still on the same level
        if (activeLevelRef.current !== activeLevelId) return;

        const transformedItems = subData.map(transformSubCategory);

        setLevels((prevLevels) =>
          prevLevels.map((level) =>
            level.id === activeLevelId
              ? { ...level, items: transformedItems }
              : level,
          ),
        );
      } catch (err) {
        console.error(err);
        // Optional: Set a specific error for the subpanel or just log it
        // We don't want to block the whole UI if just one folder fails
      } finally {
        if (activeLevelRef.current === activeLevelId) {
          setLoadingSub(false);
        }
      }
    };

    fetchSubItems();
  }, [activeLevelId]); // Removed `levels` from dependency to avoid loop, we use functional update

  const activeData = levels.find((l) => l.id === activeLevelId) || {};

  const handleViewClick = (docName) => {
    navigate({
      pathname: "/documents/view",
      search: createSearchParams({
        category: activeData.title,
        subCategory: docName,
      }).toString(),
    });
  };

  const handleAddItem = async () => {
    const name = prompt("Enter Name");
    if (!name) return;

    // Optimistic update or wait for API? Let's wait for API to ensure ID is correct
    try {
      // Assuming 'test' user for now as per request example, or we can look up current user if available
      const payload = {
        documentCategoryId: activeData.id,
        documentSubCategoryName: name,
        createdBy: "test", // TODO: Replace with actual user name from auth store if available
      };

      const newSubCategory = await documentService.createSubCategory(payload);
      const transformedItem = transformSubCategory(newSubCategory);

      setLevels((prevLevels) =>
        prevLevels.map((level) =>
          level.id === activeLevelId
            ? {
                ...level,
                items: [...(level.items || []), transformedItem],
              }
            : level,
        ),
      );
    } catch (err) {
      console.error("Failed to create folder", err);
      alert("Failed to create folder. Please try again.");
    }
  };

  const handleEditItem = async (index, currentName) => {
    const newName = prompt("Edit Name", currentName);
    if (!newName || newName === currentName) return;

    try {
      const itemToEdit = activeData.items[index];

      const payload = {
        documentCategoryId: activeData.id,
        documentSubCategoryId: itemToEdit.id,
        documentSubCategoryName: newName,
        createdBy: "test", // TODO: Replace with actual user
        updatedBy: "test", // TODO: Replace with actual user
      };

      await documentService.updateSubCategory(payload);

      // Update local state to reflect change immediately
      setLevels((prevLevels) =>
        prevLevels.map((level) =>
          level.id === activeLevelId
            ? {
                ...level,
                items: level.items.map((item, idx) =>
                  idx === index ? { ...item, name: newName } : item,
                ),
              }
            : level,
        ),
      );
    } catch (err) {
      console.error("Failed to update folder", err);
      alert("Failed to update folder. Please try again.");
    }
  };

  const handleDeleteItem = async (index, name) => {
    const confirmDelete = window.confirm(
      `⚠️ Delete "${name}"?\n\nThis will permanently delete the entire folder and all its data. This action cannot be undone.`,
    );
    if (!confirmDelete) return;

    try {
      const itemToDelete = activeData.items[index];

      await documentService.deleteSubCategory(itemToDelete.id, activeData.id);

      setLevels((prevLevels) =>
        prevLevels.map((level) =>
          level.id === activeLevelId
            ? {
                ...level,
                items: level.items.filter((_, idx) => idx !== index),
              }
            : level,
        ),
      );
    } catch (err) {
      console.error("Failed to delete folder", err);
      alert("Failed to delete folder. Please try again.");
    }
  };

  const handleUploadClick = (docName = "", sectionName = "") => {
    if (!activeLevelId) return;
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">
            Loading Document Library...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4 text-center max-w-md p-6 bg-white rounded-xl shadow-lg border border-red-100">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            Unable to load library
          </h3>
          <p className="text-slate-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 max-w-6xl mx-auto min-h-screen bg-slate-50/50">
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
            type="button"
            onClick={() => handleUploadClick()}
            className="
    inline-flex items-center gap-2
    px-4 py-2.5
    rounded-lg
    bg-indigo-600 text-gray-600
    text-sm font-semibold
    shadow-sm
    hover:bg-indigo-700
    focus:outline-none
    focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2
    transition-colors duration-200
    active:scale-95
    whitespace-nowrap
  "
          >
            <Plus className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation Sidebar (The Pyramid) - Sticky on Desktop */}
        <div className="lg:w-1/3 lg:sticky lg:top-6 h-fit space-y-3">
          {levels.map((level) => {
            const Icon = level.icon || File; // Fallback icon
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

        {/* Content Area - Scrollable with fixed max height */}
        <div className="lg:w-2/3 bg-gray-50 rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/40 flex flex-col h-[calc(100vh-200px)] lg:h-[calc(100vh-160px)] min-h-125 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-indigo-600" />
              {activeData.title || "Loading..."}
            </h2>
            <p className="text-sm font-medium text-slate-600 mt-1">
              Browse documents in Level {activeData.level}
            </p>
          </div>

          <div className="p-6 bg-white overflow-y-auto custom-scrollbar flex-1">
            {/* Loading State for Subcategories */}
            {loadingSub ? (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                <span className="text-sm">Loading folders...</span>
              </div>
            ) : activeData.items && activeData.items.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {activeData.items.map((doc, idx) => (
                  <DocumentRow
                    key={`${activeLevelId}-${idx}`} // Use combined key to force re-render on level switch if needed
                    index={idx}
                    name={doc.name}
                    side={doc.side}
                    onView={handleViewClick}
                    onUpload={handleUploadClick}
                    onEdit={handleEditItem}
                    onDelete={handleDeleteItem}
                  />
                ))}

                {/* ADD ITEM BUTTON */}
                <button
                  onClick={handleAddItem}
                  className="flex items-center justify-center h-14 border-2 border-dashed border-indigo-400 rounded-xl text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400 transition-all"
                >
                  <span className="text-xl font-bold">ADD FOLDER</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-slate-400">
                <FolderOpen className="w-12 h-12 text-slate-200" />
                <p>No subcategories found.</p>
                <button
                  onClick={handleAddItem}
                  className="mt-2 text-indigo-600 font-medium hover:text-indigo-800"
                >
                  Create First Folder
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const DocumentRow = ({ index, name, onView, onUpload, onEdit, onDelete }) => (
  <div
    onClick={() => onView(name)}
    className="group flex items-center justify-between p-3 rounded-xl border border-slate-200/80 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-all cursor-pointer hover:shadow-sm"
  >
    <div className="flex items-center gap-3">
      <div className="p-2.5 bg-slate-100 text-slate-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-gray-600 transition-all duration-200 shadow-sm group-hover:shadow-indigo-200">
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
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit(index, name);
        }}
        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-100 rounded-md transition-all opacity-0 group-hover:opacity-100"
        title="Edit Name"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(index, name);
        }}
        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-100 rounded-md transition-all opacity-0 group-hover:opacity-100"
        title="Delete Folder"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
      <ArrowRight className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
    </div>
  </div>
);

export default DocumentLibrary;
