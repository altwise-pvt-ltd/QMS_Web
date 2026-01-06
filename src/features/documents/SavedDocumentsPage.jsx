import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { MockData } from "../../data/jsonData/MOCK_DATA";
import SavedDocumentsTable from "./component/SavedDocumentsTable";
import { getDocuments } from "../../services/documentService";

const mockDocs = MockData;

const SavedDocumentsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [dexieDocs, setDexieDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch documents from Dexie on mount
  useEffect(() => {
    const fetchDexieDocuments = async () => {
      try {
        const docs = await getDocuments();
        setDexieDocs(docs);
      } catch (error) {
        console.error("Failed to fetch Dexie documents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDexieDocuments();
  }, []);

  // Handle document deletion - refresh Dexie documents
  const handleDocumentDeleted = async (deletedId) => {
    try {
      const docs = await getDocuments();
      setDexieDocs(docs);
    } catch (error) {
      console.error("Failed to refresh documents after deletion:", error);
    }
  };

  // Combine mock data and Dexie data
  const allDocuments = useMemo(() => {
    return [...mockDocs, ...dexieDocs];
  }, [dexieDocs]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Document Repository
                </h1>
                <p className="text-sm text-slate-500 mt-1">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Text Search */}
              <div className="relative group">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search by name, sub-category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Category Filter */}
              <div className="relative group">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubCategory("All"); // Reset subcategory when category changes
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                >
                  <option disabled>Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-Category Filter */}
              <div className="relative group">
                <Filter
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none"
                >
                  <option disabled>Sub-Category</option>
                  {subCategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub === "All" ? "All Sub-Categories" : sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <SavedDocumentsTable
          documents={filteredDocuments}
          onDocumentDeleted={handleDocumentDeleted}
        />
      </div>
    </div>
  );
};

export default SavedDocumentsPage;
