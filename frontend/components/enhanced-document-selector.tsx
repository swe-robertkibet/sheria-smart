"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Shield,
  Briefcase,
  FileText,
  Home,
  Loader2,
  Users,
  Heart,
  Lightbulb,
  Building,
  Scale,
  ChevronRight,
  Search,
  Filter,
  Clock,
  Star,
  TrendingUp,
  X,
} from "lucide-react";
import { useScrollToTop, useScrollToTopOnChange } from "@/hooks/use-scroll-to-top";
import { BreadcrumbNavigation, createDocumentBreadcrumbs } from "@/components/breadcrumb-navigation";
import {
  DocumentType,
  DocumentCategory,
  DocumentTypeInfo,
  DocumentCategoryInfo,
} from "@/types/document";

interface EnhancedDocumentSelectorProps {
  onBack: () => void;
  onSelectDocument: (
    documentType: DocumentType,
    category: DocumentCategory
  ) => void;
  onNavigateToChat?: () => void;
  onNavigateToAnalysis?: () => void;
  initialCategory?: DocumentCategory | undefined;
  initialSearchQuery?: string;
}

type ComplexityFilter = "all" | "low" | "medium" | "high";
type SortOption = "alphabetical" | "complexity" | "popular" | "recent";

export function EnhancedDocumentSelector({
  onBack,
  onSelectDocument,
  onNavigateToChat,
  onNavigateToAnalysis,
  initialCategory,
  initialSearchQuery = "",
}: EnhancedDocumentSelectorProps) {
  const [categories, setCategories] = useState<DocumentCategoryInfo[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | undefined>(initialCategory);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [complexityFilter, setComplexityFilter] = useState<ComplexityFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("alphabetical");
  const [showFilters, setShowFilters] = useState(false);

  // Mock popular and recent documents (in real app, fetch from API)
  const [popularDocuments] = useState<DocumentType[]>([
    DocumentType.SERVICE_AGREEMENT,
    DocumentType.ENHANCED_EMPLOYMENT_CONTRACT,
    DocumentType.ENHANCED_LEASE_AGREEMENT,
  ]);

  const [recentDocuments] = useState<DocumentType[]>([
    DocumentType.SALES_PURCHASE_AGREEMENT,
    DocumentType.PARTNERSHIP_AGREEMENT,
  ]);

  // Reset scroll position when component mounts
  useScrollToTop();

  // Reset scroll position when category selection changes
  useScrollToTopOnChange([selectedCategory]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/documents/categories", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch document categories");
      }

      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      console.error("Error fetching document categories:", err);
      setError("Failed to load document categories");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.BUSINESS_COMMERCIAL:
        return Briefcase;
      case DocumentCategory.EMPLOYMENT_HR:
        return Users;
      case DocumentCategory.PROPERTY_REAL_ESTATE:
        return Home;
      case DocumentCategory.FAMILY_LAW:
        return Heart;
      case DocumentCategory.INTELLECTUAL_PROPERTY:
        return Lightbulb;
      case DocumentCategory.CORPORATE_GOVERNANCE:
        return Building;
      case DocumentCategory.LITIGATION_DISPUTE:
        return Scale;
      case DocumentCategory.REGULATORY_COMPLIANCE:
        return Shield;
      default:
        return FileText;
    }
  };

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
      case DocumentType.NON_COMPETE_AGREEMENT:
        return Users;
      case DocumentType.SERVICE_AGREEMENT:
      case DocumentType.SALES_PURCHASE_AGREEMENT:
      case DocumentType.DISTRIBUTION_AGREEMENT:
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return Briefcase;
      case DocumentType.ENHANCED_LEASE_AGREEMENT:
      case DocumentType.SALE_OF_LAND_AGREEMENT:
      case DocumentType.PROPERTY_MANAGEMENT_AGREEMENT:
        return Home;
      default:
        return FileText;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "low":
        return "bg-green-500/10 text-green-700 border-green-200";
      case "medium":
        return "bg-yellow-500/10 text-yellow-700 border-yellow-200";
      case "high":
        return "bg-red-500/10 text-red-700 border-red-200";
      default:
        return "bg-gray-500/10 text-gray-700 border-gray-200";
    }
  };

  const getEstimatedTime = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "low":
        return "5-10 min";
      case "medium":
        return "15-25 min";
      case "high":
        return "30-45 min";
      default:
        return "10-20 min";
    }
  };

  const isDocumentPopular = (docType: DocumentType) => popularDocuments.includes(docType);
  const isDocumentRecent = (docType: DocumentType) => recentDocuments.includes(docType);

  // Filtered and sorted documents
  const filteredAndSortedDocuments = useMemo(() => {
    if (!selectedCategory) return [];

    const categoryData = categories.find((cat) => cat.id === selectedCategory);
    if (!categoryData) return [];

    let filtered = categoryData.documents.filter((doc) => {
      // Search filter
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Complexity filter
      const matchesComplexity = 
        complexityFilter === "all" || 
        doc.complexity.toLowerCase() === complexityFilter;

      return matchesSearch && matchesComplexity;
    });

    // Sort documents
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "alphabetical":
          return a.name.localeCompare(b.name);
        case "complexity":
          const complexityOrder = { low: 1, medium: 2, high: 3 };
          return (complexityOrder[a.complexity.toLowerCase() as keyof typeof complexityOrder] || 2) - 
                 (complexityOrder[b.complexity.toLowerCase() as keyof typeof complexityOrder] || 2);
        case "popular":
          const aPopular = isDocumentPopular(a.id) ? 1 : 0;
          const bPopular = isDocumentPopular(b.id) ? 1 : 0;
          return bPopular - aPopular;
        case "recent":
          const aRecent = isDocumentRecent(a.id) ? 1 : 0;
          const bRecent = isDocumentRecent(b.id) ? 1 : 0;
          return bRecent - aRecent;
        default:
          return 0;
      }
    });
  }, [categories, selectedCategory, searchQuery, complexityFilter, sortBy, popularDocuments, recentDocuments]);

  // Filtered categories for search
  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    
    return categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.documents.some((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [categories, searchQuery]);

  const handleCreateDocument = (documentType: DocumentType, isActive: boolean) => {
    if (isActive && selectedCategory) {
      onSelectDocument(documentType, selectedCategory);
    }
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  const breadcrumbItems = createDocumentBreadcrumbs(
    selectedCategoryData?.name,
    undefined,
    onBack,
    () => setSelectedCategory(undefined),
    undefined
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Breadcrumbs */}
      <header className="bg-white border-b border-[#F5F5F5] sticky top-0 z-50 h-16">
        <div className="container mx-auto max-w-6xl h-full flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-[#7C9885] flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 ml-4 min-w-0">
            <BreadcrumbNavigation items={breadcrumbItems} />
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="bg-[#F8FAF9] rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#718096] w-4 h-4" />
                <Input
                  type="text"
                  placeholder={selectedCategory ? "Search documents..." : "Search categories and documents..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-white border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#718096] hover:text-[#2D3748]"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Filters (only show when viewing documents) */}
            {selectedCategory && (
              <>
                <Select value={complexityFilter} onValueChange={(value: ComplexityFilter) => setComplexityFilter(value)}>
                  <SelectTrigger className="w-full lg:w-48 bg-white">
                    <SelectValue placeholder="Complexity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Complexity</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                  <SelectTrigger className="w-full lg:w-48 bg-white">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="complexity">Complexity</SelectItem>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="recent">Recent</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setComplexityFilter("all");
                    setSortBy("alphabetical");
                  }}
                  className="whitespace-nowrap"
                >
                  Clear Filters
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#7C9885] mx-auto mb-4" />
              <p className="text-[#718096]">Loading document types...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchCategories} variant="outline">
              Try Again
            </Button>
          </div>
        ) : selectedCategory ? (
          /* Document Grid */
          <div className="space-y-6">
            {/* Back to Categories Button */}
            <div className="flex items-center space-x-4 mb-8">
              <Button
                variant="ghost"
                onClick={() => setSelectedCategory(undefined)}
                className="text-[#7C9885] hover:bg-[#7C9885]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
            </div>
            {filteredAndSortedDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-[#718096] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2D3748] mb-2">
                    No documents found
                  </h3>
                  <p className="text-[#718096] mb-4">
                    Try adjusting your search terms or filters
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setComplexityFilter("all");
                    }}
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedDocuments.map((docType) => {
                  const Icon = getDocumentIcon(docType.id);
                  const isPopular = isDocumentPopular(docType.id);
                  const isRecent = isDocumentRecent(docType.id);

                  return (
                    <Card
                      key={docType.id}
                      className={`cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl group relative ${
                        !docType.isActive ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleCreateDocument(docType.id, docType.isActive)}
                    >
                      <CardContent className="p-6">
                        {/* Status badges */}
                        <div className="absolute top-3 right-3 flex gap-1">
                          {!docType.isActive && (
                            <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
                              Coming Soon
                            </Badge>
                          )}
                          {isPopular && docType.isActive && (
                            <Badge variant="secondary" className="bg-[#7C9885] text-white text-xs flex items-center gap-1">
                              <Star className="w-3 h-3" />
                              Popular
                            </Badge>
                          )}
                          {isRecent && docType.isActive && !isPopular && (
                            <Badge variant="secondary" className="bg-blue-500 text-white text-xs flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" />
                              Recent
                            </Badge>
                          )}
                        </div>

                        {/* Icon */}
                        <div className="w-12 h-12 bg-[#7C9885]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-[#7C9885]" />
                        </div>

                        {/* Content */}
                        <div className="text-center space-y-3">
                          <h3 className="text-lg font-bold text-[#2D3748]">
                            {docType.name}
                          </h3>
                          <p className="text-[#718096] text-sm leading-relaxed">
                            {docType.description}
                          </p>

                          {/* Metadata */}
                          <div className="flex justify-center items-center gap-3 text-xs">
                            <Badge 
                              variant="outline" 
                              className={getComplexityColor(docType.complexity)}
                            >
                              {docType.complexity}
                            </Badge>
                            <div className="flex items-center text-[#718096]">
                              <Clock className="w-3 h-3 mr-1" />
                              {getEstimatedTime(docType.complexity)}
                            </div>
                          </div>

                          {/* Action button */}
                          <Button
                            size="sm"
                            disabled={!docType.isActive}
                            className="bg-[#7C9885] hover:bg-[#7C9885]/90 text-white font-semibold px-6 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                          >
                            {docType.isActive ? "Create Document" : "Coming Soon"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          /* Categories Grid */
          <div className="space-y-8">

            {filteredCategories.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-[#718096] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2D3748] mb-2">
                    No categories found
                  </h3>
                  <p className="text-[#718096] mb-4">
                    Try searching with different terms
                  </p>
                  <Button variant="outline" onClick={() => setSearchQuery("")}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredCategories.map((category) => {
                  const Icon = getCategoryIcon(category.id);
                  const activeDocuments = category.documents.filter((doc) => doc.isActive).length;
                  const totalDocuments = category.documents.length;

                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-8 text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 bg-[#7C9885]/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-8 h-8 text-[#7C9885]" />
                        </div>

                        {/* Content */}
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold text-[#2D3748]">
                              {category.name}
                            </h3>
                            <p className="text-[#718096] text-sm leading-relaxed">
                              {category.description}
                            </p>
                            <div className="flex justify-center items-center space-x-4 text-sm">
                              <span className="text-[#7C9885] font-medium">
                                {activeDocuments} Active
                              </span>
                              <span className="text-[#718096]">
                                {totalDocuments} Total
                              </span>
                            </div>
                          </div>

                          <Button
                            size="lg"
                            className="bg-[#7C9885] hover:bg-[#7C9885]/90 text-white font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300 w-full"
                          >
                            Browse Documents
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}