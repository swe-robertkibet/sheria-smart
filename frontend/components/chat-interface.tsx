"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Send, Mic } from "lucide-react"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface ChatInterfaceProps {
  onBack: () => void
}

export function ChatInterface({ onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI legal assistant. How can I help you with your legal question today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `I understand your question about "${inputMessage}". Under Kenyan law, there are specific provisions that apply to your situation. Let me provide you with detailed guidance...

For your specific case, I recommend:
1. Understanding your rights under the relevant legislation
2. Documenting all relevant communications
3. Following the proper legal procedures

Would you like me to help you generate any specific documents related to this matter?`,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Chat Header */}
      <header className="bg-white border-b border-[#F5F5F5] p-4 sticky top-0 z-50">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-[#7C9885]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-[#2D3748]">Legal Assistant</h1>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-[#718096]">Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs md:max-w-2xl px-6 py-4 rounded-3xl ${
                  message.sender === "user"
                    ? "bg-[#7C9885] text-white"
                    : "bg-[#F8FAF9] text-[#2D3748] border border-[#E2E8F0]"
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-line">{message.content}</p>
                <div className="mt-2">
                  <span className={`text-xs ${message.sender === "user" ? "text-white/70" : "text-[#718096]"}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#F8FAF9] text-[#2D3748] border border-[#E2E8F0] px-6 py-4 rounded-3xl">
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
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input - Fixed at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F5F5F5] p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask your legal question..."
                className="h-14 pr-12 border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20 rounded-2xl text-base"
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
              disabled={!inputMessage.trim()}
              className="h-14 px-6 bg-[#7C9885] hover:bg-[#5D7A6B] text-white rounded-2xl"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
