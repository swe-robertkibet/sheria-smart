"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Handshake, Bell, FileText } from "lucide-react"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

interface DocumentSelectorProps {
  onBack: () => void
}

export function DocumentSelector({ onBack }: DocumentSelectorProps) {
  // Reset scroll position when component mounts
  useScrollToTop()

  const documentTypes = [
    {
      id: "rental",
      title: "Rental Agreement",
      description: "Tenancy contracts and lease agreements",
      icon: Home,
      color: "bg-[#7C9885]",
    },
    {
      id: "contract",
      title: "Basic Contract",
      description: "Service agreements and sales contracts",
      icon: Handshake,
      color: "bg-[#C99383]",
    },
    {
      id: "notice",
      title: "Legal Notice",
      description: "Demand letters and formal notices",
      icon: Bell,
      color: "bg-[#F7DC6F]",
    },
  ]

  const handleCreateDocument = (documentType: string) => {
    // This would navigate to the document creation form
    console.log(`Creating ${documentType} document`)
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
        <div className="grid md:grid-cols-3 gap-8">
          {documentTypes.map((docType) => (
            <div
              key={docType.id}
              className={`${docType.color} rounded-3xl p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group`}
              onClick={() => handleCreateDocument(docType.id)}
            >
              <div className="space-y-6">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                  <docType.icon className="w-8 h-8 text-white" />
                </div>

                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-white">{docType.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{docType.description}</p>
                </div>

                <Button
                  size="lg"
                  className={`bg-white ${
                    docType.id === "rental"
                      ? "text-[#7C9885]"
                      : docType.id === "contract"
                        ? "text-[#C99383]"
                        : "text-[#B8860B]"
                  } hover:bg-white/90 font-semibold px-6 py-3 rounded-xl transform hover:scale-105 transition-all duration-300`}
                >
                  Create
                </Button>
              </div>
            </div>
          ))}
        </div>

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
