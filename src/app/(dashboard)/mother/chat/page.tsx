"use client";

import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import { useAuth } from "@/lib/auth/AuthContext";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  crisisDetected?: boolean;
  timestamp: string;
}

function getOrCreateSessionId(): string {
  const key = "thriving-mama-chat-session-id";
  let sessionId = localStorage.getItem(key);
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(key, sessionId);
  }
  return sessionId;
}

function generateNewSessionId(): string {
  const key = "thriving-mama-chat-session-id";
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  localStorage.setItem(key, sessionId);
  return sessionId;
}

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionId(getOrCreateSessionId());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewConversation = () => {
    const newId = generateNewSessionId();
    setSessionId(newId);
    setMessages([]);
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageText = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.userId || "anonymous",
          sessionId,
          message: messageText,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data = await response.json();
      const { response: aiContent, crisisDetected } = data;

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content: aiContent,
        crisisDetected: crisisDetected || false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: "assistant",
        content:
          "I'm sorry, I'm having trouble connecting right now. Please try again in a moment. If you need immediate support, please call the crisis line (988) or emergency services (112).",
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-warm-gray-900">AI Chat Coach</h1>
          <p className="text-sm text-warm-gray-500">
            Your safe space to share, reflect, and find guidance. Available 24/7.
          </p>
        </div>
        <button
          onClick={handleNewConversation}
          className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50 transition-colors"
          aria-label="Start a new conversation"
        >
          New Conversation
        </button>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              {message.crisisDetected && message.role === "assistant" && (
                <div className="mb-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="font-semibold text-red-800">Crisis Support</span>
                  </div>
                  <p className="text-sm text-red-700 mb-2">
                    It sounds like you may be going through a very difficult time. Please reach out for immediate help:
                  </p>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li><strong>Emergency Services:</strong> 112</li>
                    <li><strong>Suicide &amp; Crisis Lifeline:</strong> 988</li>
                    <li><strong>Crisis Text Line:</strong> Text HOME to 741741</li>
                  </ul>
                </div>
              )}
              <div
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary-500 text-white rounded-br-sm"
                      : "bg-warm-gray-100 text-warm-gray-800 rounded-bl-sm"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-5 h-5 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-[8px] font-bold">TM</span>
                      </div>
                      <span className="text-xs font-semibold text-warm-gray-500">ThrivingMama Coach</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-warm-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-warm-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-warm-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-warm-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-warm-gray-200 p-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400"
              aria-label="Chat message input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="px-5 py-3 bg-primary-500 text-white rounded-xl font-semibold hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-xs text-warm-gray-400 text-center">
            If you are in crisis, please call emergency services (112) or the crisis line (988) immediately.
          </p>
        </div>
      </Card>
    </div>
  );
}
