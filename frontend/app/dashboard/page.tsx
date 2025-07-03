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
import { MessageCircle, FileText, User, LogOut, ChevronDown, Menu, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { DocumentSelector } from "@/components/document-selector"

export default function DashboardPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "chat" | "documents">("dashboard")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userName] = useState("John")
  const router = useRouter()

  const handleLogout = () => {
    router.push("/")
  }

  const handleStartChat = () => {
    setCurrentView("chat")
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

        {/* Two Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Ask AI Assistant Card */}
          <div
            className="bg-[#7C9885] rounded-3xl p-8 md:p-12 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group"
            onClick={handleStartChat}
          >
            <div className="space-y-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <MessageCircle className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Ask Legal Question</h2>
                <p className="text-lg text-white/90 leading-relaxed">
                  Get instant answers about contracts, tenancy, and rights
                </p>
              </div>

              <Button
                size="lg"
                className="bg-white text-[#7C9885] hover:bg-white/90 font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Chat
              </Button>
            </div>
          </div>

          {/* Create Documents Card */}
          <div
            className="bg-[#C99383] rounded-3xl p-8 md:p-12 text-center cursor-pointer transform hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl group"
            onClick={handleCreateDocument}
          >
            <div className="space-y-6">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                <FileText className="w-10 h-10 text-white" />
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold text-white">Generate Documents</h2>
                <p className="text-lg text-white/90 leading-relaxed">Create contracts, agreements, and legal notices</p>
              </div>

              <Button
                size="lg"
                className="bg-white text-[#C99383] hover:bg-white/90 font-semibold px-8 py-4 text-lg rounded-xl transform hover:scale-105 transition-all duration-300"
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
