"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Send, Mic, AlertTriangle, CheckCircle, Clock, FileText, Scale, User } from "lucide-react"
import { StructuredLegalResponse, QuestionClassification, StructuredChatResponse, UrgencyLevel, LegalArea } from "../types/legal"
import { useScrollToTop } from "@/hooks/use-scroll-to-top"

interface Message {
  id: string
  content: string | StructuredLegalResponse
  sender: "user" | "ai"
  timestamp: Date
  isStructured?: boolean
  classification?: QuestionClassification
}

interface StructuredChatInterfaceProps {
  onBack: () => void
}

export function StructuredChatInterface({ onBack }: StructuredChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI legal assistant with enhanced structured responses. I can provide detailed, organized legal guidance specific to Kenyan law. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Reset scroll position when component mounts
  useScrollToTop()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize chat session
  useEffect(() => {
    const initSession = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/chat/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        })
        
        if (response.ok) {
          const data = await response.json()
          setSessionId(data.sessionId)
        }
      } catch (error) {
        console.error('Failed to initialize chat session:', error)
      }
    }
    
    initSession()
  }, [])

  const getUrgencyColor = (urgency: UrgencyLevel) => {
    switch (urgency) {
      case UrgencyLevel.URGENT: return "bg-red-100 text-red-800"
      case UrgencyLevel.HIGH: return "bg-orange-100 text-orange-800"
      case UrgencyLevel.MEDIUM: return "bg-yellow-100 text-yellow-800"
      case UrgencyLevel.LOW: return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getLegalAreaColor = (area: LegalArea) => {
    const colors = {
      [LegalArea.CONTRACT_LAW]: "bg-blue-100 text-blue-800",
      [LegalArea.EMPLOYMENT_LAW]: "bg-purple-100 text-purple-800",
      [LegalArea.PROPERTY_LAW]: "bg-green-100 text-green-800",
      [LegalArea.FAMILY_LAW]: "bg-pink-100 text-pink-800",
      [LegalArea.CRIMINAL_LAW]: "bg-red-100 text-red-800",
      [LegalArea.BUSINESS_LAW]: "bg-indigo-100 text-indigo-800",
      [LegalArea.CONSUMER_PROTECTION]: "bg-cyan-100 text-cyan-800",
      [LegalArea.TENANCY_LAW]: "bg-teal-100 text-teal-800",
      [LegalArea.CONSTITUTIONAL_LAW]: "bg-amber-100 text-amber-800",
      [LegalArea.CIVIL_PROCEDURE]: "bg-slate-100 text-slate-800",
      [LegalArea.OTHER]: "bg-gray-100 text-gray-800",
    }
    return colors[area] || "bg-gray-100 text-gray-800"
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !sessionId) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:5000/api/chat/send-structured', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId,
          message: currentMessage,
        }),
      })

      if (response.ok) {
        const data: StructuredChatResponse = await response.json()
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.advice,
          sender: "ai",
          timestamp: new Date(),
          isStructured: true,
          classification: data.classification,
        }
        setMessages((prev) => [...prev, aiMessage])
      } else {
        // Handle error
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Sorry, I'm having trouble processing your request right now. Please try again later.",
          sender: "ai",
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to the server. Please check your connection and try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const renderStructuredResponse = (response: StructuredLegalResponse, classification?: QuestionClassification) => (
    <div className="space-y-4 max-w-4xl">
      {/* Classification Header */}
      {classification && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getLegalAreaColor(classification.legalArea)}>
            <Scale className="w-3 h-3 mr-1" />
            {classification.legalArea}
          </Badge>
          <Badge className={getUrgencyColor(classification.urgencyLevel)}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {classification.urgencyLevel.toUpperCase()}
          </Badge>
          <Badge variant="outline">
            {classification.complexity.toUpperCase()}
          </Badge>
        </div>
      )}

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Legal Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{response.summary}</p>
        </CardContent>
      </Card>

      {/* Rights */}
      {response.rights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {response.rights.map((right, index) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-800">{right.title}</h4>
                <p className="text-gray-700 text-sm">{right.description}</p>
                <p className="text-xs text-gray-500 mt-1">Legal Basis: {right.legalBasis}</p>
                {right.limitations && right.limitations.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600">Limitations:</p>
                    <ul className="text-xs text-gray-500 ml-4 list-disc">
                      {right.limitations.map((limitation, i) => (
                        <li key={i}>{limitation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Obligations */}
      {response.obligations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
              Your Obligations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {response.obligations.map((obligation, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-4">
                <h4 className="font-semibold text-orange-800">{obligation.title}</h4>
                <p className="text-gray-700 text-sm">{obligation.description}</p>
                <p className="text-xs text-gray-500 mt-1">Legal Basis: {obligation.legalBasis}</p>
                <p className="text-xs text-red-600 mt-1">Consequences: {obligation.consequences}</p>
                {obligation.deadline && (
                  <p className="text-xs font-medium text-red-700 mt-1">Deadline: {obligation.deadline}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      {response.nextSteps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-600" />
              Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {response.nextSteps.map((step, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-blue-800">{step.description}</h4>
                  <Badge size="sm" className={getUrgencyColor(step.priority)}>
                    {step.priority}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500">Timeframe: {step.timeframe}</p>
                {step.requiredDocuments && step.requiredDocuments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-gray-600">Required Documents:</p>
                    <ul className="text-xs text-gray-500 ml-4 list-disc">
                      {step.requiredDocuments.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Required Documents */}
      {response.requiredDocuments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <FileText className="w-5 h-5 mr-2 text-purple-600" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {response.requiredDocuments.map((doc, index) => (
                <li key={index} className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  {doc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Legal References */}
      {response.relevantLaws.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Legal References</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-1">
              {response.relevantLaws.map((law, index) => (
                <li key={index} className="text-sm text-gray-700">
                  • {law}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Warnings */}
      {response.warnings && response.warnings.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-lg text-red-800 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Important Warnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {response.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-red-700 flex items-start">
                  <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                  {warning}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Consultation Recommendation */}
      {response.recommendConsultation && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg text-blue-800 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Legal Consultation Recommended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-blue-700">
              {response.consultationReason || "It is recommended that you consult with a qualified lawyer for your specific situation."}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Disclaimers */}
      <Card className="border-gray-200 bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm text-gray-600">Legal Disclaimers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {response.disclaimers.map((disclaimer, index) => (
              <li key={index} className="text-xs text-gray-600">
                • {disclaimer}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )

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
              <span className="text-sm text-[#718096]">Structured Mode</span>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs md:max-w-4xl ${
                  message.sender === "user"
                    ? "bg-[#7C9885] text-white px-6 py-4 rounded-3xl"
                    : "w-full"
                }`}
              >
                {message.sender === "user" ? (
                  <>
                    <p className="text-base leading-relaxed">{message.content as string}</p>
                    <div className="mt-2">
                      <span className="text-xs text-white/70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="bg-[#F8FAF9] text-[#2D3748] border border-[#E2E8F0] p-6 rounded-3xl">
                    {message.isStructured ? (
                      renderStructuredResponse(message.content as StructuredLegalResponse, message.classification)
                    ) : (
                      <p className="text-base leading-relaxed">{message.content as string}</p>
                    )}
                    <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
                      <span className="text-xs text-[#718096]">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                  </div>
                )}
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
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask your legal question for structured analysis..."
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