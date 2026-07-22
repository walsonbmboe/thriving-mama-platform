"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { mockPeerMatches, mockPeerConnections, mockPeerMessages } from "@/lib/mock-data/peers";

export default function PeersPage() {
  const [activeTab, setActiveTab] = useState<"connections" | "matches">("connections");
  const [selectedThread, setSelectedThread] = useState<string | null>("thread-001");
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setNewMessage("");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-warm-gray-900">Peer Connections</h1>
        <p className="text-sm text-warm-gray-500">
          Connect with mothers who understand your journey. You are not alone.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "connections"
              ? "bg-primary-500 text-white"
              : "bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200"
          }`}
        >
          My Connections ({mockPeerConnections.length})
        </button>
        <button
          onClick={() => setActiveTab("matches")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            activeTab === "matches"
              ? "bg-primary-500 text-white"
              : "bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200"
          }`}
        >
          Find Peers
        </button>
      </div>

      {activeTab === "matches" ? (
        <div>
          <Card className="mb-4 bg-secondary-50 border-secondary-200">
            <p className="text-sm text-warm-gray-600">
              <strong>Community Guidelines:</strong> Be kind, respectful, and supportive.
              Never share medical advice. If you or someone you&apos;re talking to is in crisis,
              encourage them to use the AI Coach or call emergency services.
            </p>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockPeerMatches.map((match) => (
              <Card key={match.id}>
                <div className="text-center">
                  <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-br from-secondary-300 to-primary-300 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">{match.name.split(" ").map(n => n[0]).join("")}</span>
                  </div>
                  <h3 className="font-semibold text-warm-gray-800">{match.name}</h3>
                  <p className="text-xs text-warm-gray-500 mt-1">Baby: {match.babyAge} old</p>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {match.challenges.map((challenge) => (
                      <span key={challenge} className="px-2 py-0.5 bg-warm-gray-100 text-warm-gray-600 text-xs rounded-full">
                        {challenge}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-1">
                    <span className="text-xs text-warm-gray-500">Match:</span>
                    <span className="text-xs font-bold text-primary-600">{match.matchScore}%</span>
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">
                    Connect
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Connections List */}
          <Card className="lg:col-span-1 p-0">
            <div className="p-4 border-b border-warm-gray-100">
              <h2 className="font-semibold text-warm-gray-800">Messages</h2>
            </div>
            <div className="divide-y divide-warm-gray-50">
              {mockPeerConnections.map((conn) => (
                <button
                  key={conn.id}
                  onClick={() => setSelectedThread(conn.threadId)}
                  className={`w-full text-left p-4 transition-colors ${
                    selectedThread === conn.threadId ? "bg-primary-50" : "hover:bg-warm-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-secondary-700">
                        {conn.peerName.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-warm-gray-800 text-sm">{conn.peerName}</p>
                      <p className="text-xs text-warm-gray-500 truncate">{conn.lastMessage}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Chat Thread */}
          <Card className="lg:col-span-2 flex flex-col p-0 h-[500px]">
            <div className="p-4 border-b border-warm-gray-100 flex items-center gap-3">
              <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-secondary-700">FN</span>
              </div>
              <span className="font-semibold text-warm-gray-800">Fatima N.</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {mockPeerMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === "user-001" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                      msg.senderId === "user-001"
                        ? "bg-primary-500 text-white rounded-br-sm"
                        : "bg-warm-gray-100 text-warm-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-warm-gray-100 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none text-sm"
                  aria-label="Peer message input"
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="sm" onClick={handleSendMessage}>Send</Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
