"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MessageCircle, FileText, User, LogOut, ChevronDown, Menu, X, Scale } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { StructuredChatInterface } from "@/components/structured-chat-interface"
import { DocumentSelector } from "@/components/document-selector"

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "chat" | "structured-chat" | "documents">("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName] = useState("John")
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  const handleStartChat = () => {
    setCurrentView("chat")
  }

  const handleStartStructuredChat = () => {
    setCurrentView("structured-chat")
  }

  const handleCreateDocument = () => {
    setCurrentView("documents")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
  }

  if (currentView === "chat") {
    return <ChatInterface onBack={handleBackToDashboard} />
  }

  if (currentView === "structured-chat") {
    return <StructuredChatInterface onBack={handleBackToDashboard} />
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
          <div className="text-2xl font-bold">
            <span className="text-[#7C9885]">Sheria</span>
            <span className="text-[#C99383]"> Smart</span>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* User Menu - Desktop */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8 bg-[#7C9885]">
                    <AvatarFallback className="text-white font-semibold">{userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[#2D3748]">{userName}</span>
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
