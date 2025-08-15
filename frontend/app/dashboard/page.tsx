"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { MessageCircle, FileText, Scale, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { StructuredChatInterface } from "@/components/structured-chat-interface"
import { EnhancedDocumentSelector } from "@/components/enhanced-document-selector"
import { GenericDocumentForm } from "@/components/generic-document-form"
import { EnhancedHeader } from "@/components/enhanced-header"
import { ChatSidebar, ChatSidebarRef } from "@/components/chat-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { AuthLoading } from "@/components/auth-loading"
import { AuthError } from "@/components/auth-error"
import { DocumentType } from "@/types/document"

type ViewType = "dashboard" | "chat" | "structured-chat" | "documents" | "document-form";

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const router = useRouter()
  const { user, logout, isLoading, isAuthenticated, authError, isValidatingToken, loadingContext, clearAuthError } = useAuth()
  
  // Refs for sidebar components
  const quickChatSidebarRef = useRef<ChatSidebarRef>(null)
  const structuredChatSidebarRef = useRef<ChatSidebarRef>(null)

  // Reset scroll position when switching between dashboard views
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView])


  const handleRetryAuth = () => {
    clearAuthError()
    // Trigger token validation again
    window.location.reload()
  }

  const handleGoToLogin = () => {
    clearAuthError()
    router.push('/login')
  }

  // Show loading while validating token on app load
  if (isValidatingToken) {
    return <AuthLoading {...loadingContext} />
  }

  // Show auth error with user-friendly message
  if (authError && authError.showToUser) {
    return (
      <AuthError 
        error={authError}
        onRetry={handleRetryAuth}
        onGoHome={handleGoToLogin}
        showRetry={authError.code === 'NETWORK_ERROR'}
      />
    )
  }

  // Show loading during explicit loading operations (like logout)
  if (isLoading) {
    return <AuthLoading message="Processing..." />
  }

  // Redirect if not authenticated (silent redirect without error)
  if (!isAuthenticated || !user) {
    router.push('/login')
    return null
  }

  const handleStartChat = () => {
    setCurrentSessionId(undefined)
    setCurrentView("chat")
  }

  const handleStartStructuredChat = () => {
    setCurrentSessionId(undefined)
    setCurrentView("structured-chat")
  }

  const handleCreateDocument = () => {
    setCurrentView("documents")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setCurrentSessionId(undefined)
    setSelectedDocumentType(null)
    setSelectedCategory(undefined)
  }

  const handleSelectDocument = (documentType: DocumentType, category: string) => {
    setSelectedDocumentType(documentType)
    setSelectedCategory(category)
    // Navigate to generic document form for all document types (NDA removed)
    setCurrentView("document-form")
  }

  const handleBackToDocuments = () => {
    // Go back to the document list for the selected category
    setCurrentView("documents")
    setSelectedDocumentType(null)
    // Keep selectedCategory to maintain category context
  }

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    // Keep the current view - don't change it when selecting a session
    setIsSidebarOpen(false) // Close sidebar on mobile
  }

  const handleNewChat = () => {
    setCurrentSessionId(undefined)
    // Keep the current view - don't change it when starting a new chat
    setIsSidebarOpen(false) // Close sidebar on mobile
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // NEW ARCHITECTURE: Handle session creation from chat interfaces
  const handleSessionCreated = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    // Trigger sidebar refresh to show the new session immediately
    if (currentView === "chat") {
      quickChatSidebarRef.current?.refreshSessions()
    } else if (currentView === "structured-chat") {
      structuredChatSidebarRef.current?.refreshSessions()
    }
  }

  const handleNavigateToDocumentFromChat = (documentType: any, category: string) => {
    // Set the document type and navigate to document form
    setSelectedDocumentType(documentType);
    setSelectedCategory(category);
    setCurrentView("document-form");
  }

  const handleNavigate = (view: "dashboard" | "documents" | "chat" | "analysis") => {
    switch (view) {
      case "dashboard":
        handleBackToDashboard();
        break;
      case "documents":
        handleCreateDocument();
        break;
      case "chat":
        handleStartChat();
        break;
      case "analysis":
        handleStartStructuredChat();
        break;
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // If not in documents view, navigate there
    if (currentView !== "documents" && currentView !== "document-form") {
      setCurrentView("documents");
    }
  };

  // Compute this value before early returns affect type narrowing
  const shouldShowSearch = currentView === "documents" || currentView === "document-form";

  if (currentView === "chat") {
    return (
      <div className="flex h-screen">
        <ChatSidebar 
          ref={quickChatSidebarRef}
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          chatType="QUICK_CHAT"
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64 xl:ml-80' : 'ml-0'}`}>
          <ChatInterface 
            onBack={handleBackToDashboard}
            sessionId={currentSessionId}
            onToggleSidebar={handleToggleSidebar}
            onSessionCreated={handleSessionCreated}
          />
        </div>
      </div>
    )
  }

  if (currentView === "structured-chat") {
    return (
      <div className="flex h-screen">
        <ChatSidebar 
          ref={structuredChatSidebarRef}
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
          chatType="STRUCTURED_ANALYSIS"
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64 xl:ml-80' : 'ml-0'}`}>
          <StructuredChatInterface 
            onBack={handleBackToDashboard}
            sessionId={currentSessionId}
            onToggleSidebar={handleToggleSidebar}
            onSessionCreated={handleSessionCreated}
            onNavigateToDocument={handleNavigateToDocumentFromChat}
          />
        </div>
      </div>
    )
  }

  if (currentView === "documents") {
    return (
      <EnhancedDocumentSelector 
        onBack={handleBackToDashboard} 
        onSelectDocument={handleSelectDocument}
        onNavigateToChat={handleStartChat}
        onNavigateToAnalysis={handleStartStructuredChat}
        initialCategory={selectedCategory as any}
        initialSearchQuery={searchQuery}
      />
    )
  }

  // NDA form removed - document type has been discontinued

  if (currentView === "document-form" && selectedDocumentType) {
    return <GenericDocumentForm onBack={handleBackToDocuments} documentType={selectedDocumentType} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Enhanced Header */}
      <EnhancedHeader 
        currentView={currentView}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        showSearch={shouldShowSearch}
      />

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-6 py-16 max-w-4xl">
        {/* Central Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D3748] mb-8">What legal help do you need?</h1>
        </div>

        {/* Three Main Action Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Basic Chat Card */}
          <div
            className="bg-[#7C9885] rounded-3xl p-6 md:p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group"
            onClick={handleStartChat}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-white">Quick Chat</h2>
                <p className="text-sm text-white/90 leading-relaxed">
                  Get instant answers about legal questions
                </p>
              </div>

              <Button
                size="lg"
                className="bg-white text-[#7C9885] hover:bg-white/90 font-semibold px-6 py-3 text-base rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Chat
              </Button>
            </div>
          </div>

          {/* Structured Legal Analysis Card */}
          <div
            className="bg-gradient-to-br from-[#7C9885] to-[#5D7A6B] rounded-3xl p-6 md:p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group border-2 border-white/20"
            onClick={handleStartStructuredChat}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <Scale className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-white">Legal Analysis</h2>
                <p className="text-sm text-white/90 leading-relaxed">
                  Get detailed structured legal guidance
                </p>
                <div className="inline-block bg-white/20 text-xs text-white px-2 py-1 rounded-full">
                  ENHANCED
                </div>
              </div>

              <Button
                size="lg"
                className="bg-white text-[#7C9885] hover:bg-white/90 font-semibold px-6 py-3 text-base rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Analysis
              </Button>
            </div>
          </div>

          {/* Create Documents Card */}
          <div
            className="bg-[#C99383] rounded-3xl p-6 md:p-8 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group"
            onClick={handleCreateDocument}
          >
            <div className="space-y-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-3">
                <h2 className="text-xl md:text-2xl font-bold text-white">Documents</h2>
                <p className="text-sm text-white/90 leading-relaxed">
                  Create contracts and legal notices
                </p>
              </div>

              <Button
                size="lg"
                className="bg-white text-[#C99383] hover:bg-white/90 font-semibold px-6 py-3 text-base rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                Create Document
              </Button>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}
