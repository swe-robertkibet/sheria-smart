"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { MessageCircle, FileText, Scale, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button, Card, theme } from "antd"
import { ChatInterface } from "@/components/chat-interface"
import { StructuredChatInterface } from "@/components/structured-chat-interface"
import { EnhancedDocumentSelector } from "@/components/enhanced-document-selector"
import { EnhancedGenericDocumentForm } from "@/components/enhanced-generic-document-form"
import { EnhancedHeader } from "@/components/enhanced-header"
import { ChatSidebar, ChatSidebarRef } from "@/components/chat-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { AuthError } from "@/components/auth-error"
import { AuthLoading } from "@/components/auth-loading"
import { DocumentType } from "@/types/document"
import { semanticColors, getColorValue } from "@/lib/theme-config"
import RateLimitConfirmDialog from "@/components/rate-limit-confirm-dialog"

type ViewType = "dashboard" | "chat" | "structured-chat" | "documents" | "document-form";

export default function DashboardPage() {
  const { token } = theme.useToken()
  const [currentView, setCurrentView] = useState<ViewType>("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(undefined)
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [rateLimitDialogOpen, setRateLimitDialogOpen] = useState(false)
  const [pendingFeatureType, setPendingFeatureType] = useState<'QUICK_CHAT' | 'STRUCTURED_ANALYSIS' | 'DOCUMENT_GENERATION' | null>(null)
  const router = useRouter()
  const { user, logout, isLoading, isLoggingOut, isAuthenticated, authError, isValidatingToken, loadingContext, clearAuthError } = useAuth()
  
  // Refs for sidebar components
  const quickChatSidebarRef = useRef<ChatSidebarRef>(null)
  const structuredChatSidebarRef = useRef<ChatSidebarRef>(null)

  // Reset scroll position when switching between dashboard views
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView])

  // Handle authentication redirect in useEffect to avoid setState during render
  useEffect(() => {
    if (!isAuthenticated && !user && !isValidatingToken && !isLoading && !authError) {
      router.push('/login')
    }
  }, [isAuthenticated, user, isValidatingToken, isLoading, authError, router])


  const handleRetryAuth = () => {
    clearAuthError()
    // Trigger token validation again
    window.location.reload()
  }

  const handleGoToLogin = () => {
    clearAuthError()
    router.push('/login')
  }

  // Show loading animation while validating token
  if (isValidatingToken) {
    return <AuthLoading {...loadingContext} />
  }

  // Show loading animation while logging out
  if (isLoggingOut) {
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

  // Return null during explicit loading operations (like logout)
  if (isLoading) {
    return null
  }

  // Return null if not authenticated (redirect handled in useEffect)
  if (!isAuthenticated || !user) {
    return null
  }

  const handleStartChat = () => {
    setPendingFeatureType('QUICK_CHAT')
    setRateLimitDialogOpen(true)
  }

  const handleStartStructuredChat = () => {
    setPendingFeatureType('STRUCTURED_ANALYSIS')
    setRateLimitDialogOpen(true)
  }

  const handleCreateDocument = () => {
    setPendingFeatureType('DOCUMENT_GENERATION')
    setRateLimitDialogOpen(true)
  }

  const handleRateLimitConfirm = () => {
    if (pendingFeatureType === 'QUICK_CHAT') {
      setCurrentSessionId(undefined)
      setCurrentView("chat")
    } else if (pendingFeatureType === 'STRUCTURED_ANALYSIS') {
      setCurrentSessionId(undefined)
      setCurrentView("structured-chat")
    } else if (pendingFeatureType === 'DOCUMENT_GENERATION') {
      setCurrentView("documents")
    }
    setPendingFeatureType(null)
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
      <div className="relative h-screen">
        <Suspense fallback={<div className="w-64 bg-gray-100 animate-pulse"></div>}>
          <ChatSidebar 
            ref={quickChatSidebarRef}
            isOpen={isSidebarOpen}
            onToggle={handleToggleSidebar}
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
            chatType="QUICK_CHAT"
          />
        </Suspense>
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64 xl:ml-80' : ''}`}>
          <Suspense fallback={
            <div className="h-screen bg-white flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#7C9885]/20 border-t-[#7C9885] rounded-full animate-spin mx-auto"></div>
                <p className="text-[#718096]">Loading...</p>
              </div>
            </div>
          }>
            <ChatInterface 
              onBack={handleBackToDashboard}
              sessionId={currentSessionId}
              onToggleSidebar={handleToggleSidebar}
              onSessionCreated={handleSessionCreated}
            />
          </Suspense>
        </div>
      </div>
    )
  }

  if (currentView === "structured-chat") {
    return (
      <div className="relative h-screen">
        <Suspense fallback={<div className="w-64 bg-gray-100 animate-pulse"></div>}>
          <ChatSidebar 
            ref={structuredChatSidebarRef}
            isOpen={isSidebarOpen}
            onToggle={handleToggleSidebar}
            currentSessionId={currentSessionId}
            onSessionSelect={handleSessionSelect}
            onNewChat={handleNewChat}
            chatType="STRUCTURED_ANALYSIS"
          />
        </Suspense>
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64 xl:ml-80' : ''}`}>
          <Suspense fallback={
            <div className="h-screen bg-white flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#C99383]/20 border-t-[#C99383] rounded-full animate-spin mx-auto"></div>
                <p className="text-[#718096]">Loading...</p>
              </div>
            </div>
          }>
            <StructuredChatInterface 
              onBack={handleBackToDashboard}
              sessionId={currentSessionId}
              onToggleSidebar={handleToggleSidebar}
              onSessionCreated={handleSessionCreated}
              onNavigateToDocument={handleNavigateToDocumentFromChat}
            />
          </Suspense>
        </div>
      </div>
    )
  }

  if (currentView === "documents") {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#F7DC6F]/20 border-t-[#F7DC6F] rounded-full animate-spin mx-auto"></div>
            <p className="text-[#718096]">Loading...</p>
          </div>
        </div>
      }>
        <EnhancedDocumentSelector 
          onBack={handleBackToDashboard} 
          onSelectDocument={handleSelectDocument}
          onNavigateToChat={handleStartChat}
          onNavigateToAnalysis={handleStartStructuredChat}
          initialCategory={selectedCategory as any}
          initialSearchQuery={searchQuery}
        />
      </Suspense>
    )
  }

  // NDA form removed - document type has been discontinued

  if (currentView === "document-form" && selectedDocumentType) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[#7C9885]/20 border-t-[#7C9885] rounded-full animate-spin-slow mx-auto"></div>
            <p className="text-[#718096]">Loading...</p>
          </div>
        </div>
      }>
        <EnhancedGenericDocumentForm onBack={handleBackToDocuments} documentType={selectedDocumentType} />
      </Suspense>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: token.colorBgContainer }}>
      {/* Enhanced Header */}
      <EnhancedHeader 
        currentView={currentView}
        onNavigate={handleNavigate}
        onSearch={handleSearch}
        showSearch={shouldShowSearch}
      />

      {/* Main Dashboard Content */}
      <main style={{ 
        maxWidth: '1024px', 
        margin: '0 auto', 
        padding: `${token.paddingXL}px ${token.paddingLG}px` 
      }}>
        {/* Central Hero Section */}
        <div style={{ textAlign: 'center', marginBottom: token.marginXL * 2 }}>
          <h1 style={{ 
            fontSize: token.fontSizeHeading1,
            fontWeight: token.fontWeightStrong,
            color: '#2D3748',
            marginBottom: token.marginXL,
            lineHeight: token.lineHeightHeading1
          }}>
            What legal help do you need?
          </h1>
        </div>

        {/* Three Main Action Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: token.paddingLG,
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {/* Quick Chat Card */}
          <Card
            hoverable
            onClick={handleStartChat}
            style={{
              background: 'linear-gradient(135deg, #7C9885 0%, #5D7A6B 100%)',
              border: 'none',
              borderRadius: token.borderRadiusLG * 2,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
              boxShadow: '0 8px 24px #7C988533',
            }}
            styles={{
              body: { 
                padding: 0,
                textAlign: 'center',
                color: 'white',
                height: '100%'
              }
            }}
            className="group hover:shadow-2xl hover:-translate-y-1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '300px', padding: `${token.paddingXL}px ${token.paddingLG}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: token.paddingMD }}>
                <div style={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                }} className="group-hover:scale-110">
                  <MessageCircle size={32} color="white" />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ 
                    fontSize: token.fontSizeHeading3,
                    fontWeight: token.fontWeightStrong,
                    color: 'white',
                    marginBottom: token.marginSM
                  }}>
                    Quick Chat
                  </h2>
                  <p style={{ 
                    fontSize: token.fontSize,
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: token.lineHeight,
                    marginBottom: 0
                  }}>
                    Get instant answers about legal questions
                  </p>
                </div>
              </div>

              <Button 
                type="default"
                size="large"
                style={{
                  backgroundColor: 'white',
                  color: '#7C9885',
                  border: 'none',
                  fontWeight: token.fontWeightStrong,
                  borderRadius: token.borderRadiusLG,
                  height: 48,
                  paddingInline: token.paddingLG,
                  transition: 'all 0.3s ease'
                }}
                className="hover:scale-105"
              >
                Start Chat
              </Button>
            </div>
          </Card>

          {/* Legal Analysis Card */}
          <Card
            hoverable
            onClick={handleStartStructuredChat}
            style={{
              background: 'linear-gradient(135deg, #C99383 0%, #B8826F 100%)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: token.borderRadiusLG * 2,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
              boxShadow: '0 8px 24px #C9938333',
            }}
            styles={{
              body: { 
                padding: 0,
                textAlign: 'center',
                color: 'white',
                height: '100%'
              }
            }}
            className="group hover:shadow-2xl hover:-translate-y-1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '300px', padding: `${token.paddingXL}px ${token.paddingLG}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: token.paddingMD }}>
                <div style={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                }} className="group-hover:scale-110">
                  <Scale size={32} color="white" />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ 
                    fontSize: token.fontSizeHeading3,
                    fontWeight: token.fontWeightStrong,
                    color: 'white',
                    marginBottom: token.marginSM
                  }}>
                    Legal Analysis
                  </h2>
                  <p style={{ 
                    fontSize: token.fontSize,
                    color: 'rgba(255, 255, 255, 0.9)',
                    lineHeight: token.lineHeight,
                    marginBottom: 0
                  }}>
                    Get detailed structured legal guidance
                  </p>
                </div>
              </div>

              <Button 
                type="default"
                size="large"
                style={{
                  backgroundColor: 'white',
                  color: '#C99383',
                  border: 'none',
                  fontWeight: token.fontWeightStrong,
                  borderRadius: token.borderRadiusLG,
                  height: 48,
                  paddingInline: token.paddingLG,
                  transition: 'all 0.3s ease'
                }}
                className="hover:scale-105"
              >
                Start Analysis
              </Button>
            </div>
          </Card>

          {/* Documents Card */}
          <Card
            hoverable
            onClick={handleCreateDocument}
            style={{
              background: 'linear-gradient(135deg, #F7DC6F 0%, #F4D03F 100%)',
              border: 'none',
              borderRadius: token.borderRadiusLG * 2,
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
              boxShadow: '0 8px 24px #F7DC6F33',
            }}
            styles={{
              body: { 
                padding: 0,
                textAlign: 'center',
                color: '#2D3748',
                height: '100%'
              }
            }}
            className="group hover:shadow-2xl hover:-translate-y-1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '300px', padding: `${token.paddingXL}px ${token.paddingLG}px` }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: token.paddingMD }}>
                <div style={{
                  width: 64,
                  height: 64,
                  backgroundColor: 'rgba(45, 55, 72, 0.1)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                }} className="group-hover:scale-110">
                  <FileText size={32} color="#2D3748" />
                </div>
                
                <div style={{ textAlign: 'center' }}>
                  <h2 style={{ 
                    fontSize: token.fontSizeHeading3,
                    fontWeight: token.fontWeightStrong,
                    color: '#2D3748',
                    marginBottom: token.marginSM
                  }}>
                    Documents
                  </h2>
                  <p style={{ 
                    fontSize: token.fontSize,
                    color: 'rgba(45, 55, 72, 0.8)',
                    lineHeight: token.lineHeight,
                    marginBottom: 0
                  }}>
                    Create contracts and legal notices
                  </p>
                </div>
              </div>

              <Button 
                type="default"
                size="large"
                style={{
                  backgroundColor: '#2D3748',
                  color: '#F7DC6F',
                  border: 'none',
                  fontWeight: token.fontWeightStrong,
                  borderRadius: token.borderRadiusLG,
                  height: 48,
                  paddingInline: token.paddingLG,
                  transition: 'all 0.3s ease'
                }}
                className="hover:scale-105"
              >
                Create Document
              </Button>
            </div>
          </Card>
        </div>
      </main>

      {/* Rate Limit Confirmation Dialog */}
      {pendingFeatureType && (
        <RateLimitConfirmDialog
          open={rateLimitDialogOpen}
          onOpenChange={setRateLimitDialogOpen}
          featureType={pendingFeatureType}
          onConfirm={handleRateLimitConfirm}
        />
      )}

    </div>
  )
}
