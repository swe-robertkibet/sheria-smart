"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  Search,
  Archive,
  MoreVertical,
  Trash2,
  Edit3,
  Scale,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  X
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ChatSession {
  id: string
  title: string | null
  chatType: 'QUICK_CHAT' | 'STRUCTURED_ANALYSIS'
  messageCount: number
  lastMessageAt: string
  createdAt: string
  updatedAt: string
}

interface ChatSidebarProps {
  isOpen: boolean
  onToggle: () => void
  currentSessionId?: string
  onSessionSelect: (sessionId: string) => void
  onNewChat: () => void
  chatType?: 'QUICK_CHAT' | 'STRUCTURED_ANALYSIS'
}

export function ChatSidebar({ 
  isOpen, 
  onToggle, 
  currentSessionId, 
  onSessionSelect, 
  onNewChat,
  chatType 
}: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showArchived, setShowArchived] = useState(false)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState("")

  // Load chat sessions
  const loadSessions = async (reset = false) => {
    if (isLoading) return
    setIsLoading(true)

    try {
      const url = new URL('/api/chat/sessions', process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000')
      if (!reset && cursor) {
        url.searchParams.set('cursor', cursor)
      }
      if (showArchived) {
        url.pathname = '/api/chat/sessions/archived'
      }
      if (chatType) {
        url.searchParams.set('chatType', chatType)
      }

      const response = await fetch(url.toString(), {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        // Filter sessions by chat type if specified
        let filteredSessions = data.sessions
        if (chatType) {
          filteredSessions = data.sessions.filter((session: ChatSession) => session.chatType === chatType)
        }
        
        if (reset) {
          setSessions(filteredSessions)
        } else {
          setSessions(prev => [...prev, ...filteredSessions])
        }
        setHasMore(data.hasMore)
        setCursor(data.nextCursor)
      } else if (response.status === 401) {
        // User not authenticated
        console.error('User not authenticated')
        window.location.href = '/login?error=authentication_required'
      } else {
        console.error('Failed to load sessions:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Search sessions
  const searchSessions = async (query: string) => {
    if (!query.trim()) {
      loadSessions(true)
      return
    }

    setIsLoading(true)
    try {
      const url = new URL('/api/chat/sessions/search', process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000')
      url.searchParams.set('q', query)
      if (chatType) {
        url.searchParams.set('chatType', chatType)
      }

      const response = await fetch(url.toString(), {
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        // Filter search results by chat type if specified
        let filteredSessions = data.sessions
        if (chatType) {
          filteredSessions = data.sessions.filter((session: ChatSession) => session.chatType === chatType)
        }
        setSessions(filteredSessions)
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error searching sessions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update chat title
  const updateChatTitle = async (sessionId: string, title: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}/title`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title }),
      })

      if (response.ok) {
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? { ...session, title } : session
        ))
      }
    } catch (error) {
      console.error('Error updating title:', error)
    }
  }

  // Archive chat
  const archiveChat = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}/archive`, {
        method: 'PUT',
        credentials: 'include',
      })

      if (response.ok) {
        setSessions(prev => prev.filter(session => session.id !== sessionId))
      }
    } catch (error) {
      console.error('Error archiving chat:', error)
    }
  }

  // Delete chat
  const deleteChat = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        setSessions(prev => prev.filter(session => session.id !== sessionId))
      }
    } catch (error) {
      console.error('Error deleting chat:', error)
    }
  }

  // Handle title editing
  const handleTitleEdit = (sessionId: string, currentTitle: string | null) => {
    setEditingTitle(sessionId)
    setNewTitle(currentTitle || '')
  }

  const handleTitleSave = async (sessionId: string) => {
    if (newTitle.trim() && newTitle !== sessions.find(s => s.id === sessionId)?.title) {
      await updateChatTitle(sessionId, newTitle.trim())
    }
    setEditingTitle(null)
    setNewTitle('')
  }

  const handleTitleCancel = () => {
    setEditingTitle(null)
    setNewTitle('')
  }

  // Format relative time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  // Get session title or generate from first message
  const getSessionTitle = (session: ChatSession) => {
    return session.title || `Chat ${session.messageCount > 0 ? session.messageCount : 'New'}`
  }

  // Load initial sessions
  useEffect(() => {
    loadSessions(true)
  }, [showArchived, chatType])

  // Handle search
  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery) {
        searchSessions(searchQuery)
      } else {
        loadSessions(true)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-white border-r border-[#F5F5F5] z-50 transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        w-80 lg:w-64 xl:w-80
      `}>
        {/* Header */}
        <div className="p-4 border-b border-[#F5F5F5]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#2D3748]">Chats</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={onNewChat}
            className="w-full mb-4 bg-[#7C9885] hover:bg-[#5D7A6B] text-white flex items-center justify-center min-h-[40px] text-sm"
          >
            <Plus className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">New Chat</span>
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#718096]" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20"
            />
          </div>

          {/* Toggle Archive */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
              className="text-[#718096] hover:text-[#7C9885]"
            >
              {showArchived ? <MessageCircle className="w-4 h-4 mr-2" /> : <Archive className="w-4 h-4 mr-2" />}
              {showArchived ? 'Active Chats' : 'Archived'}
            </Button>
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
          <div className="p-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`
                  group relative p-3 rounded-lg cursor-pointer transition-colors mb-2
                  ${session.id === currentSessionId ? 'bg-[#7C9885]/10 border border-[#7C9885]/20' : 'hover:bg-[#F8FAF9]'}
                `}
                onClick={() => onSessionSelect(session.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      {session.chatType === 'STRUCTURED_ANALYSIS' ? (
                        <Scale className="w-4 h-4 text-[#7C9885] flex-shrink-0" />
                      ) : (
                        <MessageCircle className="w-4 h-4 text-[#7C9885] flex-shrink-0" />
                      )}
                      {session.chatType === 'STRUCTURED_ANALYSIS' && (
                        <Badge variant="secondary" className="text-xs">
                          Analysis
                        </Badge>
                      )}
                    </div>

                    {editingTitle === session.id ? (
                      <div className="mb-2">
                        <Input
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleTitleSave(session.id)}
                          onBlur={() => handleTitleSave(session.id)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <h3 className="font-medium text-sm text-[#2D3748] truncate mb-1">
                        {getSessionTitle(session)}
                      </h3>
                    )}

                    <div className="flex items-center space-x-2 text-xs text-[#718096]">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(session.lastMessageAt)}</span>
                      <span>•</span>
                      <span>{session.messageCount} messages</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleTitleEdit(session.id, session.title)}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Title
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => archiveChat(session.id)}>
                        <Archive className="w-4 h-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteChat(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}

            {/* Load More */}
            {hasMore && !isLoading && (
              <Button
                variant="ghost"
                onClick={() => loadSessions(false)}
                className="w-full mt-4 text-[#7C9885] hover:text-[#5D7A6B]"
              >
                Load More
              </Button>
            )}

            {isLoading && (
              <div className="text-center py-4 text-[#718096]">
                Loading...
              </div>
            )}

            {sessions.length === 0 && !isLoading && (
              <div className="text-center py-8 text-[#718096]">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No chats found</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={`
          fixed top-4 z-40 transition-all duration-300
          ${isOpen ? 'left-72 lg:left-56 xl:left-72' : 'left-4'}
          lg:block hidden
        `}
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </Button>
    </>
  )
}