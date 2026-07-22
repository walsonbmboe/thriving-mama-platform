"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { mockMoodHistory, moodLabels } from "@/lib/mock-data/mood";

export default function MoodPage() {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (selectedRating === null) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const maxRating = 5;
  const chartData = mockMoodHistory.slice(0, 30).reverse();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-warm-gray-900">Mood Tracker</h1>
        <p className="text-sm text-warm-gray-500">
          Check in daily to understand your emotional patterns over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Daily Check-in */}
        <Card className="lg:col-span-1">
          <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
            How are you feeling today?
          </h2>

          {submitted ? (
            <div className="text-center py-8">
              <span className="text-5xl">🌸</span>
              <p className="mt-4 font-semibold text-warm-gray-800">Thank you for checking in!</p>
              <p className="text-sm text-warm-gray-500 mt-1">
                Every check-in helps you understand your patterns.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setSelectedRating(rating)}
                    className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${
                      selectedRating === rating
                        ? "border-primary-500 bg-primary-50 scale-105"
                        : "border-warm-gray-100 hover:border-warm-gray-200"
                    }`}
                    aria-label={`Rate mood as ${moodLabels[rating].label}`}
                  >
                    <span className="text-2xl">{moodLabels[rating].emoji}</span>
                    <span className="text-xs mt-1 text-warm-gray-600">{moodLabels[rating].label}</span>
                  </button>
                ))}
              </div>

              <div className="mb-4">
                <label htmlFor="mood-note" className="block text-sm font-medium text-warm-gray-700 mb-1">
                  Add a note (optional)
                </label>
                <textarea
                  id="mood-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400 resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              <Button
                onClick={handleSubmit}
                disabled={selectedRating === null}
                className="w-full"
              >
                Submit Check-in
              </Button>
            </>
          )}
        </Card>

        {/* Mood Chart */}
        <Card className="lg:col-span-2">
          <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
            30-Day Mood History
          </h2>

          {/* Simple bar chart */}
          <div className="flex items-end gap-1 h-48 px-2">
            {chartData.map((entry, index) => {
              const height = (entry.rating / maxRating) * 100;
              const colors = [
                "bg-red-400",
                "bg-orange-400",
                "bg-sunshine-400",
                "bg-accent-400",
                "bg-green-400",
              ];
              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center justify-end h-full"
                  title={`${entry.date}: ${moodLabels[entry.rating]?.label || "N/A"}${entry.note ? ` - ${entry.note}` : ""}`}
                >
                  <div
                    className={`w-full rounded-t-sm ${colors[entry.rating - 1]} transition-all hover:opacity-80`}
                    style={{ height: `${height}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex justify-between mt-4 text-xs text-warm-gray-500">
            <span>30 days ago</span>
            <span>Today</span>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-warm-gray-100">
            {Object.entries(moodLabels).map(([rating, { label, emoji }]) => (
              <span key={rating} className="flex items-center gap-1 text-xs text-warm-gray-600">
                {emoji} {label}
              </span>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Entries */}
      <Card className="mt-6">
        <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
          Recent Entries
        </h2>
        <div className="space-y-3">
          {mockMoodHistory.slice(0, 7).map((entry) => (
            <div key={entry.date} className="flex items-center gap-4 py-2 border-b border-warm-gray-50 last:border-0">
              <span className="text-2xl">{moodLabels[entry.rating]?.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-warm-gray-700">{entry.date}</p>
                {entry.note && (
                  <p className="text-sm text-warm-gray-500">{entry.note}</p>
                )}
              </div>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${moodLabels[entry.rating]?.color}`}>
                {moodLabels[entry.rating]?.label}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
