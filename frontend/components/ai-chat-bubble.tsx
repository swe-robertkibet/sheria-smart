"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  HelpCircle,
  Lightbulb,
  FileText,
  Scale,
} from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatBubbleProps {
  context?: "documents" | "document-form" | "categories" | "dashboard";
  contextData?: {
    documentType?: string;
    categoryName?: string;
    currentStep?: string;
  };
  onNavigate?: (view: "chat" | "analysis") => void;
  className?: string;
}

export function AIChatBubble({
  context = "dashboard",
  contextData,
  onNavigate,
  className = "",
}: AIChatBubbleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Context-aware suggestions
  const getContextSuggestions = () => {
    switch (context) {
      case "documents":
        return [
          {
            icon: HelpCircle,
            text: "Which document do I need?",
            query: "Help me choose the right document type for my situation",
          },
          {
            icon: Scale,
            text: "Legal requirements?",
            query: "What are the legal requirements for this type of document?",
          },
        ];
      case "document-form":
        return [
          {
            icon: FileText,
            text: "Help with this form",
            query: `Help me understand the ${contextData?.documentType} form requirements`,
          },
          {
            icon: Lightbulb,
            text: "Best practices",
            query: `What are best practices when creating a ${contextData?.documentType}?`,
          },
        ];
      case "categories":
        return [
          {
            icon: HelpCircle,
            text: "Explain this category",
            query: `Tell me more about ${contextData?.categoryName} documents`,
          },
          {
            icon: Scale,
            text: "Legal implications",
            query: `What are the legal implications of ${contextData?.categoryName}?`,
          },
        ];
      default:
        return [
          {
            icon: MessageCircle,
            text: "Start a conversation",
            query: "I have a legal question",
          },
          {
            icon: FileText,
            text: "Need a document?",
            query: "Help me find the right legal document",
          },
        ];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I understand you're asking about: "${userMessage.content}". Let me help you with that. For more detailed assistance, you might want to use our full chat or analysis features.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSuggestionClick = (query: string) => {
    setInputMessage(query);
    if (!isOpen) setIsOpen(true);
    if (isMinimized) setIsMinimized(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestions = getContextSuggestions();

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      {!isOpen && (
        <>
          {/* Floating suggestions */}
          <div className="mb-4 space-y-2">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="bg-white/95 backdrop-blur-sm border-[#7C9885]/20 text-[#7C9885] hover:bg-[#7C9885] hover:text-white shadow-lg animate-in slide-in-from-right duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => handleSuggestionClick(suggestion.query)}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {suggestion.text}
                </Button>
              );
            })}
          </div>

          {/* Main chat button */}
          <Button
            size="lg"
            className="w-14 h-14 rounded-full bg-[#7C9885] hover:bg-[#7C9885]/90 shadow-lg transform hover:scale-110 transition-all duration-200"
            onClick={() => setIsOpen(true)}
          >
            <MessageCircle className="w-6 h-6" />
          </Button>
        </>
      )}

      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] transition-all duration-300 ${
            isMinimized ? "w-80 h-16" : "w-80 h-96"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-[#7C9885] rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-white font-medium">AI Assistant</h3>
                <p className="text-white/80 text-xs">Here to help</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-white hover:bg-white/20"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="w-3 h-3" />
                ) : (
                  <Minimize2 className="w-3 h-3" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-white hover:bg-white/20"
                onClick={() => setIsOpen(false)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Messages */}
              <ScrollArea className="h-56 p-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-8 h-8 text-[#718096] mx-auto mb-2" />
                    <p className="text-[#718096] text-sm mb-4">
                      Ask me anything about legal documents!
                    </p>
                    <div className="space-y-2">
                      {suggestions.map((suggestion, index) => {
                        const Icon = suggestion.icon;
                        return (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="text-[#7C9885] border-[#7C9885]/20 hover:bg-[#7C9885]/10 text-xs"
                            onClick={() => handleSuggestionClick(suggestion.query)}
                          >
                            <Icon className="w-3 h-3 mr-1" />
                            {suggestion.text}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] p-3 rounded-lg text-sm ${
                            message.type === "user"
                              ? "bg-[#7C9885] text-white rounded-br-sm"
                              : "bg-[#F8FAF9] text-[#2D3748] rounded-bl-sm"
                          }`}
                        >
                          {message.content}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-[#F8FAF9] p-3 rounded-lg rounded-bl-sm">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-[#718096] rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-[#718096] rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                            <div className="w-2 h-2 bg-[#718096] rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t border-[#E2E8F0]">
                <div className="flex space-x-2">
                  <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Type your question..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 text-sm border-[#E2E8F0] focus:border-[#7C9885] focus:ring-[#7C9885]/20"
                    disabled={isLoading}
                  />
                  <Button
                    size="sm"
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-[#7C9885] hover:bg-[#7C9885]/90"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick actions */}
                <div className="flex justify-center space-x-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[#718096] hover:text-[#7C9885]"
                    onClick={() => onNavigate?.("chat")}
                  >
                    Full Chat
                  </Button>
                  <div className="text-[#CBD5E0]">•</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs text-[#718096] hover:text-[#7C9885]"
                    onClick={() => onNavigate?.("analysis")}
                  >
                    Legal Analysis
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}