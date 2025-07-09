"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, FileText, User, LogOut, ChevronDown, Menu, X, Scale, Loader2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { StructuredChatInterface } from "@/components/structured-chat-interface"
import { DocumentSelector } from "@/components/document-selector"
import { ChatSidebar } from "@/components/chat-sidebar"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "chat" | "structured-chat" | "documents">("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const router = useRouter()
  const { user, logout, isLoading, isAuthenticated } = useAuth()

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, router])

  // Reset scroll position when switching between dashboard views
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentView])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#7C9885]" />
          <p className="text-[#718096]">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null
  }

  const handleStartChat = () => {
    setCurrentSessionId(null)
    setCurrentView("chat")
  }

  const handleStartStructuredChat = () => {
    setCurrentSessionId(null)
    setCurrentView("structured-chat")
  }

  const handleCreateDocument = () => {
    setCurrentView("documents")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setCurrentSessionId(null)
  }

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    setCurrentView("chat")
    setIsSidebarOpen(false) // Close sidebar on mobile
  }

  const handleNewChat = () => {
    setCurrentSessionId(null)
    setCurrentView("chat")
    setIsSidebarOpen(false) // Close sidebar on mobile
  }

  const handleToggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  // NEW ARCHITECTURE: Handle session creation from chat interfaces
  const handleSessionCreated = (sessionId: string) => {
    setCurrentSessionId(sessionId)
    // Note: We don't need to update the sidebar here as it will refresh automatically
    // when the user navigates or when the sidebar component re-fetches sessions
  }

  if (currentView === "chat") {
    return (
      <div className="flex h-screen">
        <ChatSidebar 
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
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
          isOpen={isSidebarOpen}
          onToggle={handleToggleSidebar}
          currentSessionId={currentSessionId}
          onSessionSelect={handleSessionSelect}
          onNewChat={handleNewChat}
        />
        <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64 xl:ml-80' : 'ml-0'}`}>
          <StructuredChatInterface 
            onBack={handleBackToDashboard}
            sessionId={currentSessionId}
            onToggleSidebar={handleToggleSidebar}
            onSessionCreated={handleSessionCreated}
          />
        </div>
      </div>
    )
  }

  if (currentView === "documents") {
    return <DocumentSelector onBack={handleBackToDashboard} />
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal Top Bar */}
      <header className="bg-white border-b border-[#F5F5F5] h-15 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Image
              src="/sheria-smart-ico.png"
              alt="Sheria Smart Icon"
              width={24}
              height={24}
              className="h-6 w-6"
            />
            <div className="text-xl font-bold">
              <span className="text-[#7C9885]">Sheria</span>
              <span className="text-[#C99383]"> Smart</span>
            </div>
          </div>

          {/* Mobile Menu Button and Sidebar Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleToggleSidebar}
              className="text-[#7C9885] hover:text-[#5D7A6B]"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {/* User Menu - Desktop */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8 bg-[#7C9885]">
                    {user.picture ? (
                      <AvatarImage src={user.picture} alt={user.name} />
                    ) : null}
                    <AvatarFallback className="text-white font-semibold">
                      {user.name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[#2D3748]">{user.name || user.email}</span>
                  <ChevronDown className="w-4 h-4 text-[#718096]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#F5F5F5] p-4 space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </header>

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

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5F5F5] p-4">
        <div className="flex justify-around">
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 text-[#7C9885]"
            onClick={handleStartChat}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-medium">Chat</span>
          </Button>
          <Button
            variant="ghost"
            className="flex flex-col items-center space-y-1 text-[#C99383]"
            onClick={handleCreateDocument}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs font-medium">Documents</span>
          </Button>
          <Button variant="ghost" className="flex flex-col items-center space-y-1 text-[#718096]">
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
