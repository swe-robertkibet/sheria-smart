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

  // Filtered documents (search only)
  const filteredDocuments = useMemo(() => {
    if (!selectedCategory) return [];

    const categoryData = categories.find((cat) => cat.id === selectedCategory);
    if (!categoryData) return [];

    // Only apply search filter - simple alphabetical sort
    return categoryData.documents
      .filter((doc) => {
        // Search filter only
        return doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
               doc.description.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .sort((a, b) => a.name.localeCompare(b.name)); // Simple alphabetical sort
  }, [categories, selectedCategory, searchQuery]);

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

  const handleBackClick = () => {
    if (selectedCategory) {
      // If in a category, go back to categories list
      setSelectedCategory(undefined);
    } else {
      // If in categories list, go back to dashboard
      onBack();
    }
  };

  const selectedCategoryData = categories.find((cat) => cat.id === selectedCategory);

  const breadcrumbItems = createDocumentBreadcrumbs(
    selectedCategoryData?.name,
    undefined,
    onBack,
    () => setSelectedCategory(undefined),
    () => setSelectedCategory(undefined)
  );

  return (
    <div className="min-h-screen bg-[#FEFCF3]">
      {/* Header with Breadcrumbs */}
      <header className="bg-[#FEFCF3] border-b border-[#F5F5F5] sticky top-0 z-50 h-16">
        <div className="container mx-auto max-w-6xl h-full flex items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackClick}
            className="text-[#7C9885] flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 ml-4 min-w-0">
            <BreadcrumbNavigation items={breadcrumbItems} />
          </div>
        </div>
      </header>

      {/* Search */}
      <div className="container mx-auto px-6 py-6 max-w-6xl">
        <div className="bg-[#FEFCF3] rounded-2xl p-6 mb-8">
          <div className="relative max-w-md mx-auto">
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
            {filteredDocuments.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Search className="w-12 h-12 text-[#718096] mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-[#2D3748] mb-2">
                    No documents found
                  </h3>
                  <p className="text-[#718096] mb-4">
                    Try adjusting your search terms
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((docType, index) => {
                  const Icon = getDocumentIcon(docType.id);
                  const isPopular = isDocumentPopular(docType.id);
                  const isRecent = isDocumentRecent(docType.id);

                  // Cycle through gradient colors (same as categories)
                  const gradients = [
                    { bg: 'linear-gradient(135deg, #7C9885 0%, #5D7A6B 100%)', shadow: '0 8px 24px #7C988533', text: 'white', iconBg: 'rgba(255, 255, 255, 0.2)' },
                    { bg: 'linear-gradient(135deg, #C99383 0%, #B8826F 100%)', shadow: '0 8px 24px #C9938333', text: 'white', iconBg: 'rgba(255, 255, 255, 0.2)' },
                    { bg: 'linear-gradient(135deg, #F7DC6F 0%, #F4D03F 100%)', shadow: '0 8px 24px #F7DC6F33', text: '#2D3748', iconBg: 'rgba(45, 55, 72, 0.1)' }
                  ];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <Card
                      key={docType.id}
                      className={`cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group relative border-0 ${
                        !docType.isActive ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                      style={{
                        background: gradient.bg,
                        boxShadow: gradient.shadow
                      }}
                      onClick={() => handleCreateDocument(docType.id, docType.isActive)}
                    >
                      <CardContent className="p-6 h-80 flex flex-col justify-between" style={{ color: gradient.text }}>
                        {/* Status badges */}
                        <div className="absolute top-3 right-3 flex gap-1">
                          {!docType.isActive && (
                            <Badge variant="secondary" className="bg-yellow-500 text-white text-xs">
                              Coming Soon
                            </Badge>
                          )}
                          {isPopular && docType.isActive && (
                            <Badge 
                              variant="secondary" 
                              className="text-white text-xs flex items-center gap-1"
                              style={{ backgroundColor: gradient.text === 'white' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(45, 55, 72, 0.2)' }}
                            >
                              <Star className="w-3 h-3" />
                              Popular
                            </Badge>
                          )}
                        </div>

                        {/* Content */}
                        <div className="text-center flex flex-col items-center">
                          {/* Icon */}
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: gradient.iconBg }}
                          >
                            <Icon className="w-6 h-6" style={{ color: gradient.text }} />
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-lg font-bold" style={{ color: gradient.text }}>
                              {docType.name}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: gradient.text === 'white' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(45, 55, 72, 0.8)' }}>
                              {docType.description}
                            </p>

                            {/* Metadata */}
                            <div className="flex justify-center items-center gap-3 text-xs">
                              <Badge 
                                variant="outline" 
                                className="border-0"
                                style={{ 
                                  backgroundColor: gradient.text === 'white' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(45, 55, 72, 0.2)',
                                  color: gradient.text
                                }}
                              >
                                {docType.complexity}
                              </Badge>
                              <div className="flex items-center" style={{ color: gradient.text === 'white' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(45, 55, 72, 0.7)' }}>
                                <Clock className="w-3 h-3 mr-1" />
                                {getEstimatedTime(docType.complexity)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action button */}
                        <Button
                          size="sm"
                          disabled={!docType.isActive}
                          className="font-semibold px-6 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-0"
                          style={{
                            backgroundColor: gradient.text === 'white' ? 'white' : '#2D3748',
                            color: gradient.text === 'white' ? (gradient.bg.includes('#7C9885') ? '#7C9885' : gradient.bg.includes('#C99383') ? '#C99383' : '#F7DC6F') : 'white'
                          }}
                        >
                          {docType.isActive ? "Create Document" : "Coming Soon"}
                        </Button>
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
                {filteredCategories.map((category, index) => {
                  const Icon = getCategoryIcon(category.id);
                  const activeDocuments = category.documents.filter((doc) => doc.isActive).length;
                  const totalDocuments = category.documents.length;

                  // Cycle through gradient colors
                  const gradients = [
                    { bg: 'linear-gradient(135deg, #7C9885 0%, #5D7A6B 100%)', shadow: '0 8px 24px #7C988533', text: 'white', iconBg: 'rgba(255, 255, 255, 0.2)' },
                    { bg: 'linear-gradient(135deg, #C99383 0%, #B8826F 100%)', shadow: '0 8px 24px #C9938333', text: 'white', iconBg: 'rgba(255, 255, 255, 0.2)' },
                    { bg: 'linear-gradient(135deg, #F7DC6F 0%, #F4D03F 100%)', shadow: '0 8px 24px #F7DC6F33', text: '#2D3748', iconBg: 'rgba(45, 55, 72, 0.1)' }
                  ];
                  const gradient = gradients[index % gradients.length];

                  return (
                    <Card
                      key={category.id}
                      className="cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group border-0"
                      style={{
                        background: gradient.bg,
                        boxShadow: gradient.shadow
                      }}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <CardContent className="p-8 text-center h-80 flex flex-col justify-between" style={{ color: gradient.text }}>
                        {/* Content */}
                        <div className="flex flex-col items-center">
                          {/* Icon */}
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300"
                            style={{ backgroundColor: gradient.iconBg }}
                          >
                            <Icon className="w-8 h-8" style={{ color: gradient.text }} />
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-xl font-bold" style={{ color: gradient.text }}>
                              {category.name}
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: gradient.text === 'white' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(45, 55, 72, 0.8)' }}>
                              {category.description}
                            </p>
                            <div className="flex justify-center items-center space-x-4 text-sm">
                              <span className="font-medium" style={{ color: gradient.text }}>
                                {activeDocuments} Active
                              </span>
                              <span style={{ color: gradient.text === 'white' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(45, 55, 72, 0.7)' }}>
                                {totalDocuments} Total
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Button */}
                        <Button
                          size="lg"
                          className="font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300 w-full border-0"
                          style={{
                            backgroundColor: gradient.text === 'white' ? 'white' : '#2D3748',
                            color: gradient.text === 'white' ? gradient.bg.includes('#7C9885') ? '#7C9885' : gradient.bg.includes('#C99383') ? '#C99383' : '#F7DC6F' : 'white'
                          }}
                        >
                          Browse Documents
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
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