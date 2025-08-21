"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Mic, Plus, Menu, LogOut, ChevronDown } from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'
import { useScrollToTop } from "@/hooks/use-scroll-to-top"
import { Avatar } from "antd"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatInterfaceProps {
  onBack: () => void
  sessionId?: string | null
  onToggleSidebar?: () => void
  onSessionCreated?: (sessionId: string) => void
}

export function ChatInterface({ onBack, sessionId: propSessionId, onToggleSidebar, onSessionCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(propSessionId || null)
  const [streamingMessage, setStreamingMessage] = useState<string>("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [isWaitingForStream, setIsWaitingForStream] = useState(false)
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const { user, logout } = useAuth()
  const router = useRouter()
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lastUserMessageRef = useRef<HTMLDivElement>(null)
  const scrollAnchorRef = useRef<HTMLDivElement>(null)

  // Reset scroll position when component mounts
  useScrollToTop()

  const checkIfAtBottom = () => {
    if (!scrollContainerRef.current) return true
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const threshold = 100
    return scrollTop + clientHeight >= scrollHeight - threshold
  }

  const scrollToBottom = () => {
    if (scrollAnchorRef.current && isAtBottom && !isStreaming) {
      scrollAnchorRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const checkIfUserMessageVisible = () => {
    if (!lastUserMessageRef.current || !scrollContainerRef.current) return true
    
    const messageRect = lastUserMessageRef.current.getBoundingClientRect()
    const containerRect = scrollContainerRef.current.getBoundingClientRect()
    
    return messageRect.top >= containerRect.top && messageRect.top <= containerRect.bottom
  }

  const scrollUserMessageToTop = () => {
    if (lastUserMessageRef.current) {
      lastUserMessageRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "start"
      })
    }
  }

  const handleScroll = () => {
    const atBottom = checkIfAtBottom()
    const userMessageVisible = checkIfUserMessageVisible()
    
    if (atBottom && !userMessageVisible && !isStreaming) {
      setIsAtBottom(true)
    } else if (isStreaming || isWaitingForStream) {
      setIsAtBottom(false)
    } else {
      setIsAtBottom(atBottom)
    }
  }

  // Throttled scroll handler for performance
  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      let ticking = false
      const throttledScroll = () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll()
            ticking = false
          })
          ticking = true
        }
      }
      
      container.addEventListener('scroll', throttledScroll, { passive: true })
      return () => container.removeEventListener('scroll', throttledScroll)
    }
  }, [])

  // Auto-scroll during streaming
  useEffect(() => {
    if (!isStreaming && isAtBottom) {
      requestAnimationFrame(() => {
        scrollToBottom()
      })
    }
  }, [streamingMessage, isStreaming, isAtBottom])

  // NEW ARCHITECTURE: Initialize chat session loading if sessionId provided
  useEffect(() => {
    const initSession = async () => {
      if (propSessionId) {
        // Load existing session
        setSessionId(propSessionId)
        setShowWelcomeMessage(false)
        await loadChatHistory(propSessionId)
      } else {
        // NEW: No session creation on mount - wait for first message
        setSessionId(null)
        setShowWelcomeMessage(true)
      }
    }
    
    initSession()
  }, [propSessionId])

  // Load chat history for existing session
  const loadChatHistory = async (sessionId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/chat/history/${sessionId}`, {
        credentials: 'include',
      })
      
      if (response.ok) {
        const data = await response.json()
        const chatMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.role === 'USER' ? 'user' : 'ai',
          timestamp: new Date(msg.createdAt),
        }))
        setMessages(chatMessages)
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    }
  }

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  const startNewConversation = async () => {
    // NEW ARCHITECTURE: Reset to sessionless state
    setMessages([])
    setStreamingMessage("")
    setIsStreaming(false)
    setIsWaitingForStream(false)
    setShowWelcomeMessage(true)
    setInputMessage("")
    setIsAtBottom(true)
    setSessionId(null) // NEW: No session until first message
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    // Add user message to the conversation
    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setShowWelcomeMessage(false)
    
    // Start waiting for stream
    setIsWaitingForStream(true)
    setStreamingMessage("")

    // Wait for DOM update, then scroll user message to top
    setTimeout(() => {
      scrollUserMessageToTop()
      setIsAtBottom(false)
    }, 50)

    try {
      const requestBody = {
        sessionId: sessionId, // NEW: Can be null for first message
        message: currentMessage,
      }
      
      console.log('🔍 [DEBUG] Sending chat request:', {
        url: 'http://localhost:5000/api/chat/send-stream',
        method: 'POST',
        sessionId,
        messageLength: currentMessage.length,
        messagePreview: currentMessage.substring(0, 100) + (currentMessage.length > 100 ? '...' : ''),
        timestamp: new Date().toISOString()
      })
      
      const response = await fetch('http://localhost:5000/api/chat/send-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
      })
      
      console.log('🔍 [DEBUG] Response received:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        url: response.url,
        timestamp: new Date().toISOString()
      })

      if (response.ok && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let accumulatedText = ""

        // Start streaming
        setIsWaitingForStream(false)
        setIsStreaming(true)

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const chunk = decoder.decode(value, { stream: true })
          
          // NEW ARCHITECTURE: Check for session ID in stream
          if (chunk.includes('__SESSION_ID__:')) {
            const sessionIdMatch = chunk.match(/__SESSION_ID__:([a-zA-Z0-9\-]+)/)
            if (sessionIdMatch) {
              const newSessionId = sessionIdMatch[1]
              console.log('Received new session ID:', newSessionId)
              setSessionId(newSessionId)
              
              // Notify parent component about session creation
              if (onSessionCreated) {
                onSessionCreated(newSessionId)
              }
              
              // Remove session ID from display text
              const cleanChunk = chunk.replace(/__SESSION_ID__:[a-zA-Z0-9\-]+\n?/g, '')
              if (cleanChunk) {
                accumulatedText += cleanChunk
                setStreamingMessage(accumulatedText)
              }
              continue
            }
          }
          
          accumulatedText += chunk
          setStreamingMessage(accumulatedText)
        }

        // Create the final AI message and add to conversation
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: accumulatedText,
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        // Handle error
        console.error('🚨 [ERROR] Non-OK response:', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
          timestamp: new Date().toISOString()
        })
        
        // Try to get error details from response
        try {
          const errorText = await response.text()
          console.error('🚨 [ERROR] Response body:', errorText)
        } catch (e) {
          console.error('🚨 [ERROR] Could not read response body:', e)
        }
        
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I'm having trouble processing your request right now. Please try again later.",
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('🚨 [ERROR] Exception during fetch:', {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error',
        timestamp: new Date().toISOString()
      })
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to the server. Please check your connection and try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsWaitingForStream(false)
      setIsStreaming(false)
      setStreamingMessage("")
    }
  }

  return (
    <>
      {/* Full-Width Chat Header - Positioned above everything */}
      <header className="fixed top-0 left-0 right-0 bg-[#FEFCF3] border-b border-[#F5F5F5] px-3 py-4 sm:px-4 z-[70]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Hamburger menu - positioned at far left */}
            {onToggleSidebar && (
              <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="text-[#7C9885] min-h-[44px] min-w-[44px] touch-manipulation">
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onBack} className="text-[#7C9885] min-h-[44px] min-w-[44px] touch-manipulation">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/sheria-smart-ico.png"
                alt="Sheria Smart Icon"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <div className="text-xl font-bold hidden sm:block">
                <span style={{ color: '#7C9885' }}>Sheria</span>
                <span style={{ color: '#C99383' }}> Smart</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* New Conversation Button - Only show when conversation exists */}
            {!showWelcomeMessage && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={startNewConversation}
                className="text-[#7C9885] hover:bg-[#7C9885]/10 hidden sm:flex"
                disabled={isStreaming || isWaitingForStream}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            )}
            
            {/* User Profile */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center space-x-2 px-3 min-h-[44px] touch-manipulation"
                  style={{ 
                    border: 'none',
                    background: 'transparent',
                    color: '#2D3748'
                  }}
                >
                  <Avatar 
                    size={32}
                    src={user?.picture}
                    style={{ 
                      backgroundColor: '#7C9885',
                      color: 'white'
                    }}
                  >
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </Avatar>
                  <span className="hidden md:inline text-[#2D3748]">
                    {user?.name || user?.email || "User"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-[#718096] hidden sm:block" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-32 max-w-[calc(100vw-16px)] z-[80] bg-white shadow-lg border border-[#E2E8F0] mt-2 mr-4 sm:mr-2">
                <DropdownMenuItem onClick={handleLogout} className="min-h-[44px] cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content Container with top padding for fixed header */}
      <div className="h-screen bg-[#FEFCF3] flex flex-col pt-20">

      {/* Main Chat Container - Unified with input */}
      <div className="flex-1 flex flex-col min-h-0">
        {/* Welcome Message - Only show when no conversation started */}
        {showWelcomeMessage && (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="max-w-2xl text-center">
              <div className="bg-[#F8FAF9] text-[#2D3748] border border-[#E2E8F0] px-6 py-4 rounded-3xl">
                <p className="text-lg">Hello! I'm your AI legal assistant. How can I help you with your legal question today?</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages Container - Scrollable */}
        {!showWelcomeMessage && (
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-4 response-scroll"
            style={{ 
              paddingBottom: '20px'
            }}
          >
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message, index) => (
                <div 
                  key={message.id} 
                  ref={message.sender === "user" && index === messages.length - 1 ? lastUserMessageRef : null}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-2xl px-6 py-4 rounded-3xl ${
                      message.sender === "user"
                        ? "bg-[#7C9885] text-white"
                        : "bg-[#F8FAF9] text-[#2D3748] border border-[#E2E8F0]"
                    }`}
                  >
                    {message.sender === "user" ? (
                      <p className="text-base leading-relaxed whitespace-pre-line">{message.content}</p>
                    ) : (
                      <div className="prose prose-lg max-w-none prose-slate">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeSanitize]}
                          components={{
                            ul: ({children}) => <ul className="prose-ul:font-semibold marker:font-bold marker:text-[#2D3748]">{children}</ul>,
                            ol: ({children}) => <ol className="prose-ol:font-semibold marker:font-bold marker:text-[#2D3748]">{children}</ol>,
                            blockquote: ({children}) => <blockquote className="border-l-4 border-[#7C9885] pl-4 my-2 italic text-[#718096]">{children}</blockquote>,
                            a: ({children, href}) => <a href={href} className="text-[#7C9885] hover:text-[#5D7A6B] underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    )}
                    <div className="mt-2">
                      <span className={`text-xs ${message.sender === "user" ? "text-white/70" : "text-[#718096]"}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Waiting for Stream */}
              {isWaitingForStream && (
                <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-2xl px-6 py-4 rounded-3xl bg-[#F8FAF9] text-[#2D3748] border border-[#E2E8F0]">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-[#718096]">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Streaming Message */}
              {isStreaming && streamingMessage && (
                <div className="flex justify-start">
                  <div className="max-w-xs md:max-w-2xl px-6 py-4 rounded-3xl bg-[#F8FAF9] text-[#2D3748] border border-[#E2E8F0] streaming-container">
                    <div className="prose prose-lg max-w-none prose-slate">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize]}
                        components={{
                          ul: ({children}) => <ul className="prose-ul:font-semibold marker:font-bold marker:text-[#2D3748]">{children}</ul>,
                          ol: ({children}) => <ol className="prose-ol:font-semibold marker:font-bold marker:text-[#2D3748]">{children}</ol>,
                          blockquote: ({children}) => <blockquote className="border-l-4 border-[#7C9885] pl-4 my-2 italic text-[#718096]">{children}</blockquote>,
                          a: ({children, href}) => <a href={href} className="text-[#7C9885] hover:text-[#5D7A6B] underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                        }}
                      >
                        {streamingMessage}
                      </ReactMarkdown>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-[#7C9885] rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span className="text-xs text-[#718096]">Typing...</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Scroll anchor for auto-scroll */}
              <div ref={scrollAnchorRef} id="scroll-anchor" />
            </div>
          </div>
        )}

        {/* Input Area - Part of main container */}
        <div className="bg-[#FEFCF3] border-t border-[#F5F5F5] p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-3">
              <div className="flex-1 relative">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask your legal question..."
                  className="h-14 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-2xl text-base touch-manipulation"
                  onKeyPress={(e) => e.key === "Enter" && !isStreaming && !isWaitingForStream && handleSendMessage()}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#718096] hover:text-[#7C9885]"
                >
                  <Mic className="w-5 h-5" />
                </Button>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isStreaming || isWaitingForStream}
                className="h-14 px-6 bg-[#7C9885] hover:bg-[#5D7A6B] text-white rounded-2xl disabled:opacity-50 touch-manipulation min-w-[44px]"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  )
}