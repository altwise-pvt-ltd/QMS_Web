import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, X, FileText } from "lucide-react";
import { getDocuments } from "../../services/documentService";
import SavedDocumentsTable from "./component/SavedDocumentsTable";

const SavedDocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [apiDocs, setApiDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch documents on mount
  useEffect(() => {
    const fetchApiDocuments = async () => {
      try {
        const docs = await getDocuments();
        setApiDocs(docs);
      } catch (error) {
        console.error("Failed to fetch documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApiDocuments();
  }, []);

  const handleDocumentDeleted = async (deletedId) => {
    try {
      const docs = await getDocuments();
      setApiDocs(docs);
    } catch (error) {
      console.error("Failed to refresh documents after deletion:", error);
    }
  };

  const allDocuments = apiDocs;

  // Extract unique categories and subcategories for filters
  const categories = useMemo(() => {
    const cats = new Set(
      allDocuments.map((doc) => doc.category).filter(Boolean)
    );
    return ["All", ...Array.from(cats).sort()];
  }, [allDocuments]);

  const subCategories = useMemo(() => {
    const filteredDocs =
      selectedCategory === "All"
        ? allDocuments
        : allDocuments.filter((doc) => doc.category === selectedCategory);
    const subCats = new Set(
      filteredDocs.map((doc) => doc.subCategory).filter(Boolean)
    );
    return ["All", ...Array.from(subCats).sort()];
  }, [selectedCategory, allDocuments]);

  // Main filtering logic
  const filteredDocuments = useMemo(() => {
    return allDocuments.filter((doc) => {
      const matchesSearch =
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || doc.category === selectedCategory;
      const matchesSubCategory =
        selectedSubCategory === "All" ||
        doc.subCategory === selectedSubCategory;

      return matchesSearch && matchesCategory && matchesSubCategory;
    });
  }, [searchQuery, selectedCategory, selectedSubCategory, allDocuments]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedSubCategory("All");
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Search and Filter Section */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  <FileText className="text-indigo-600 shrink-0" size={28} />
                  Document Repository
                </h1>
                <p className="text-slate-500 mt-1 font-medium text-sm sm:text-lg">
                  Search and manage all quality system documents
                </p>
              </div>

              {(searchQuery ||
                selectedCategory !== "All" ||
                selectedSubCategory !== "All") && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full transition-colors truncate"
                  >
                    <X size={14} />
                    Clear All Filters
                  </button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Text Search */}
              <div className="relative group col-span-1 sm:col-span-2 lg:col-span-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name, sub-category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all font-medium"
                />
              </div>

              {/* Category Filter */}
              <div className="relative group">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("All");
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all appearance-none font-medium cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.filter(c => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Category Filter */}
              <div className="relative group">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  size={16}
                />
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all appearance-none font-medium cursor-pointer"
                >
                  <option value="All">All Sub-Categories</option>
                  {subCategories.filter(s => s !== "All").map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <SavedDocumentsTable
          documents={filteredDocuments}
          onDocumentDeleted={handleDocumentDeleted}
        />
      </div>
    </div>
  );
};

export default SavedDocumentsPage;
