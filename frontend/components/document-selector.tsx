"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Briefcase, FileText, Home, Loader2 } from "lucide-react"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { DocumentType, DocumentTypeInfo } from "@/types/document"

interface DocumentSelectorProps {
  onBack: () => void
  onSelectDocument: (documentType: DocumentType) => void
}

export function DocumentSelector({ onBack, onSelectDocument }: DocumentSelectorProps) {
  const [documentTypes, setDocumentTypes] = useState<DocumentTypeInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Reset scroll position when component mounts
  useScrollToTop()

  useEffect(() => {
    fetchDocumentTypes()
  }, [])

  const fetchDocumentTypes = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:5000/api/documents/types', {
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to fetch document types')
      }

      const data = await response.json()
      setDocumentTypes(data.documentTypes)
    } catch (err) {
      console.error('Error fetching document types:', err)
      setError('Failed to load document types')
    } finally {
      setLoading(false)
    }
  }

  const getDocumentIcon = (type: DocumentType) => {
    switch (type) {
      case DocumentType.NDA:
        return Shield
      case DocumentType.EMPLOYMENT_CONTRACT:
        return Briefcase
      case DocumentType.SERVICE_AGREEMENT:
        return FileText
      case DocumentType.LEASE_AGREEMENT:
        return Home
      default:
        return FileText
    }
  }

  const getDocumentColor = (type: DocumentType) => {
    switch (type) {
      case DocumentType.NDA:
        return "bg-[#7C9885]"
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
      case DocumentType.NDA:
        return "text-[#7C9885]"
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
    if (isActive) {
      onSelectDocument(documentType)
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
            <Button onClick={fetchDocumentTypes} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {documentTypes.map((docType) => {
                const Icon = getDocumentIcon(docType.id)
                const colorClass = getDocumentColor(docType.id)
                const textColorClass = getTextColor(docType.id)
                
                return (
                  <div
                    key={docType.id}
                    className={`${colorClass} rounded-3xl p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group relative ${
                      !docType.isActive ? 'opacity-60 cursor-not-allowed' : ''
                    }`}
                    onClick={() => handleCreateDocument(docType.id, docType.isActive)}
                  >
                    {!docType.isActive && (
                      <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                        Coming Soon
                      </div>
                    )}
                    
                    <div className="space-y-6">
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-8 h-8 text-white" />
                      </div>

                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-white">{docType.name}</h3>
                        <p className="text-white/90 text-sm leading-relaxed">{docType.description}</p>
                      </div>

                      <Button
                        size="lg"
                        disabled={!docType.isActive}
                        className={`bg-white ${textColorClass} hover:bg-white/90 font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                      >
                        {docType.isActive ? 'Create' : 'Coming Soon'}
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
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
