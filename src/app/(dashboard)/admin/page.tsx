"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { mockMetrics, mockCounselorPerformance, mockMonthlyData } from "@/lib/mock-data/analytics";
import { mockUsers } from "@/lib/mock-data/users";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "counselors" | "config">("overview");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-warm-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-warm-gray-600">
          Platform management and analytics overview.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(["overview", "users", "counselors", "config"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-primary-500 text-white"
                : "bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard label="Total Mothers" value={mockMetrics.totalMothers} color="primary" />
            <MetricCard label="Sessions Completed" value={mockMetrics.totalSessions} color="accent" />
            <MetricCard label="Crisis Interventions" value={mockMetrics.totalCrisisInterventions} color="red" />
            <MetricCard label="Avg EPDS Improvement" value={`${mockMetrics.averageEPDSImprovement} pts`} color="sunshine" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <MetricCard label="Daily Active Users" value={mockMetrics.dailyActiveUsers} color="secondary" />
            <MetricCard label="Messages Per Day" value={mockMetrics.messagesPerDay} color="earth" />
          </div>

          {/* Growth Chart */}
          <Card>
            <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">Platform Growth</h2>
            <div className="flex items-end gap-3 h-48">
              {mockMonthlyData.map((data) => {
                const height = (data.users / 250) * 100;
                return (
                  <div key={data.month} className="flex-1 flex flex-col items-center justify-end h-full">
                    <span className="text-xs font-bold text-warm-gray-700 mb-1">{data.users}</span>
                    <div
                      className="w-full bg-gradient-to-t from-primary-500 to-primary-300 rounded-t-lg transition-all"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-warm-gray-500 mt-2">{data.month}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-warm-gray-500 mt-3 text-center">Registered mothers by month (2026)</p>
          </Card>

          {/* Export */}
          <div className="mt-6 flex justify-end">
            <Button variant="outline">
              Export Monthly Report (CSV)
            </Button>
          </div>
        </>
      )}

      {activeTab === "users" && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-heading text-lg font-bold text-warm-gray-800">User Management</h2>
            <span className="text-sm text-warm-gray-500">{mockUsers.length} users</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-warm-gray-200">
                  <th className="text-left py-3 px-2 font-semibold text-warm-gray-700">Name</th>
                  <th className="text-left py-3 px-2 font-semibold text-warm-gray-700">Email</th>
                  <th className="text-left py-3 px-2 font-semibold text-warm-gray-700">Role</th>
                  <th className="text-left py-3 px-2 font-semibold text-warm-gray-700">Status</th>
                  <th className="text-left py-3 px-2 font-semibold text-warm-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b border-warm-gray-50">
                    <td className="py-3 px-2 font-medium text-warm-gray-800">{user.name}</td>
                    <td className="py-3 px-2 text-warm-gray-600">{user.email}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        user.role === "mother" ? "bg-secondary-100 text-secondary-700" :
                        user.role === "counselor" ? "bg-accent-100 text-accent-700" :
                        "bg-sunshine-100 text-sunshine-700"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                        {user.isActive ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "counselors" && (
        <Card>
          <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">Counselor Performance</h2>
          <div className="space-y-4">
            {mockCounselorPerformance.map((counselor) => (
              <div key={counselor.counselorId} className="p-4 bg-warm-gray-50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-accent-700">
                      {counselor.name.split(" ").slice(0,2).map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-warm-gray-800">{counselor.name}</p>
                    <p className="text-sm text-warm-gray-500">{counselor.completedSessions} sessions completed</p>
                  </div>
                </div>
                <div className="flex gap-4 text-center">
                  <div>
                    <p className="text-lg font-bold text-sunshine-600">{counselor.averageRating}</p>
                    <p className="text-xs text-warm-gray-500">Avg Rating</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-red-500">{counselor.crisisHandled}</p>
                    <p className="text-xs text-warm-gray-500">Crisis</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "config" && (
        <div className="space-y-6">
          <Card>
            <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">Crisis Keywords</h2>
            <p className="text-sm text-warm-gray-500 mb-4">
              Keywords the AI monitors for crisis detection. Edit with care.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {["suicide", "kill myself", "end it all", "harm baby", "can't go on", "want to die", "no reason to live", "hurt myself"].map((keyword) => (
                <span key={keyword} className="px-3 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  {keyword}
                  <button className="ml-2 text-red-400 hover:text-red-600" aria-label={`Remove keyword: ${keyword}`}>&times;</button>
                </span>
              ))}
            </div>
            <Button size="sm" variant="outline">Add Keyword</Button>
          </Card>

          <Card>
            <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">On-Call Counselor</h2>
            <p className="text-sm text-warm-gray-500 mb-4">
              Designate the counselor who receives crisis notifications.
            </p>
            <div className="flex items-center gap-4 p-4 bg-accent-50 rounded-xl border border-accent-200">
              <div className="w-10 h-10 bg-accent-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-accent-700">NA</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-warm-gray-800">Dr. Ngozi Adeyemi</p>
                <p className="text-xs text-warm-gray-500">Currently on-call</p>
              </div>
              <Button size="sm" variant="outline">Change</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary-50 border-primary-200",
    secondary: "bg-secondary-50 border-secondary-200",
    accent: "bg-accent-50 border-accent-200",
    sunshine: "bg-sunshine-50 border-sunshine-200",
    earth: "bg-earth-50 border-earth-200",
    red: "bg-red-50 border-red-200",
  };

  const textColorMap: Record<string, string> = {
    primary: "text-primary-700",
    secondary: "text-secondary-700",
    accent: "text-accent-700",
    sunshine: "text-sunshine-700",
    earth: "text-earth-700",
    red: "text-red-700",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorMap[color] || colorMap.primary}`}>
      <p className="text-sm text-warm-gray-600 mb-1">{label}</p>
      <p className={`text-2xl font-bold ${textColorMap[color] || textColorMap.primary}`}>
        {value}
      </p>
    </div>
  );
}
