"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Briefcase, FileText, Home, Loader2, Users, Heart, Lightbulb, Building, Scale, ChevronRight } from "lucide-react"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { DocumentType, DocumentCategory, DocumentTypeInfo, DocumentCategoryInfo } from "@/types/document"

interface DocumentSelectorProps {
  onBack: () => void
  onSelectDocument: (documentType: DocumentType, category: DocumentCategory) => void
  initialCategory?: DocumentCategory | null
}

export function DocumentSelector({ onBack, onSelectDocument, initialCategory }: DocumentSelectorProps) {
  const [categories, setCategories] = useState<DocumentCategoryInfo[]>([])
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | null>(initialCategory || null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reset scroll position when component mounts
  useScrollToTop()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/documents/categories', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch document categories')
      }

      const data = await response.json()
      setCategories(data.categories)
    } catch (err) {
      console.error('Error fetching document categories:', err)
      setError('Failed to load document categories')
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: DocumentCategory) => {
    switch (category) {
      case DocumentCategory.BUSINESS_COMMERCIAL:
        return Briefcase
      case DocumentCategory.EMPLOYMENT_HR:
        return Users
      case DocumentCategory.PROPERTY_REAL_ESTATE:
        return Home
      case DocumentCategory.FAMILY_LAW:
        return Heart
      case DocumentCategory.INTELLECTUAL_PROPERTY:
        return Lightbulb
      case DocumentCategory.CORPORATE_GOVERNANCE:
        return Building
      case DocumentCategory.LITIGATION_DISPUTE:
        return Scale
      case DocumentCategory.REGULATORY_COMPLIANCE:
        return Shield
      default:
        return FileText
    }
  }

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.EMPLOYMENT_CONTRACT:
      case DocumentType.ENHANCED_EMPLOYMENT_CONTRACT:
      case DocumentType.INDEPENDENT_CONTRACTOR_AGREEMENT:
      case DocumentType.NON_COMPETE_AGREEMENT:
        return Briefcase
      case DocumentType.SERVICE_AGREEMENT:
      case DocumentType.SALES_PURCHASE_AGREEMENT:
      case DocumentType.DISTRIBUTION_AGREEMENT:
      case DocumentType.PARTNERSHIP_AGREEMENT:
        return FileText
      case DocumentType.LEASE_AGREEMENT:
      case DocumentType.ENHANCED_LEASE_AGREEMENT:
      case DocumentType.SALE_OF_LAND_AGREEMENT:
      case DocumentType.PROPERTY_MANAGEMENT_AGREEMENT:
        return Home
      default:
        return FileText
    }
  }

  const getDocumentColor = (type: DocumentType) => {
    switch (type) {
      case DocumentType.EMPLOYMENT_CONTRACT:
        return "bg-[#C99383]"
      case DocumentType.SERVICE_AGREEMENT:
        return "bg-[#4A90E2]"
      case DocumentType.LEASE_AGREEMENT:
        return "bg-[#F7DC6F]"
      default:
        return "bg-[#718096]"
    }
  }

  const getTextColor = (type: DocumentType) => {
    switch (type) {
      case DocumentType.EMPLOYMENT_CONTRACT:
        return "text-[#C99383]"
      case DocumentType.SERVICE_AGREEMENT:
        return "text-[#4A90E2]"
      case DocumentType.LEASE_AGREEMENT:
        return "text-[#B8860B]"
      default:
        return "text-[#718096]"
    }
  }

  const handleCreateDocument = (documentType: DocumentType, isActive: boolean) => {
    if (isActive && selectedCategory) {
      onSelectDocument(documentType, selectedCategory)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[#F5F5F5] p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-[#7C9885]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-[#2D3748]">Create Document</h1>
            <p className="text-sm text-[#718096]">Choose the type of document you need</p>
          </div>
        </div>
      </header>

      {/* Document Type Grid */}
      <main className="container mx-auto px-6 py-12 max-w-4xl">
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
          // Show documents in selected category
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <Button 
                variant="ghost" 
                onClick={() => setSelectedCategory(null)}
                className="text-[#7C9885] hover:bg-[#7C9885]/10"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
              <div>
                <h2 className="text-2xl font-bold text-[#2D3748]">
                  {categories.find(cat => cat.id === selectedCategory)?.name}
                </h2>
                <p className="text-[#718096]">
                  {categories.find(cat => cat.id === selectedCategory)?.description}
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories
                .find(cat => cat.id === selectedCategory)
                ?.documents.map((docType) => {
                  const Icon = getDocumentIcon(docType.id)
                  const colorClass = getDocumentColor(docType.id)
                  const textColorClass = getTextColor(docType.id)
                  
                  return (
                    <div
                      key={docType.id}
                      className={`${colorClass} rounded-2xl p-6 text-center cursor-pointer transform hover:-translate-y-1 transition-all duration-300 hover:shadow-xl group relative ${
                        !docType.isActive ? 'opacity-60 cursor-not-allowed' : ''
                      }`}
                      onClick={() => handleCreateDocument(docType.id, docType.isActive)}
                    >
                      {!docType.isActive && (
                        <div className="absolute top-3 right-3 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                          Coming Soon
                        </div>
                      )}
                      
                      <div className="space-y-4">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-lg font-bold text-white">{docType.name}</h3>
                          <p className="text-white/90 text-sm leading-relaxed">{docType.description}</p>
                          <div className="flex justify-center items-center space-x-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              docType.complexity === 'Low' ? 'bg-green-500/20 text-green-200' :
                              docType.complexity === 'Medium' ? 'bg-yellow-500/20 text-yellow-200' :
                              'bg-red-500/20 text-red-200'
                            }`}>
                              {docType.complexity} Complexity
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          disabled={!docType.isActive}
                          className={`bg-white ${textColorClass} hover:bg-white/90 font-semibold px-4 py-2 rounded-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                        >
                          {docType.isActive ? 'Create' : 'Coming Soon'}
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        ) : (
          // Show categories
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-[#2D3748] mb-4">Choose a Document Category</h2>
              <p className="text-[#718096] text-lg">Browse our comprehensive legal document library</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => {
                const Icon = getCategoryIcon(category.id)
                const activeDocuments = category.documents.filter(doc => doc.isActive).length
                const totalDocuments = category.documents.length
                
                return (
                  <div
                    key={category.id}
                    className="bg-white rounded-2xl p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group border border-[#E2E8F0] relative"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-[#7C9885]/10 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-[#7C9885]" />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-[#2D3748]">{category.name}</h3>
                        <p className="text-[#718096] text-sm leading-relaxed">{category.description}</p>
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
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Additional Help */}
        <div className="mt-16 text-center">
          <div className="bg-[#F8FAF9] rounded-2xl p-8 border border-[#E2E8F0]">
            <FileText className="w-12 h-12 text-[#7C9885] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#2D3748] mb-2">Need a different document?</h3>
            <p className="text-[#718096] mb-4">
              Can't find what you're looking for? Ask our AI assistant for help with any legal document.
            </p>
            <Button
              variant="outline"
              onClick={onBack}
              className="border-[#7C9885] text-[#7C9885] hover:bg-[#7C9885] hover:text-white bg-transparent"
            >
              Ask AI Assistant
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
