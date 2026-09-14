"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { mockMoodHistory, moodLabels } from "@/lib/mock-data/mood";
import { useAuth } from "@/lib/auth/AuthContext";

// A normalized entry shape the UI renders. We accept both the API item
// shape ({ timestamp, rating, note }) and the mock shape ({ date, rating,
// note }) and coerce everything into this.
interface DisplayMoodEntry {
  rating: number;
  date: string;
  note?: string | null;
}

// The raw item shape returned by GET /.netlify/functions/mood.
interface ApiMoodItem {
  userId: string;
  timestamp: string;
  rating: number;
  note: string | null;
  tags: string[];
  createdAt: string;
}

const getQuickTags = (rating: number | null): string[] => {
  if (rating === null) return [];
  if (rating <= 2) {
    return [
      "\ud83d\ude34 Sleep deprivation",
      "\ud83d\ude30 Overwhelmed",
      "\ud83d\ude22 Crying a lot",
      "\ud83e\udec2 Feeling alone",
      "\ud83d\ude24 Irritable",
      "\ud83e\udde0 Can't think straight",
      "\ud83d\udc91 Partner issues",
      "\ud83c\udfe0 Home stress",
    ];
  }
  if (rating === 3) {
    return [
      "\ud83d\ude34 Tired but okay",
      "\ud83e\udec2 Could use company",
      "\ud83d\udcaa Managing",
      "\ud83c\udf24\ufe0f Some good moments",
      "\ud83d\ude10 Just getting through",
      "\ud83d\udc91 Relationship stuff",
    ];
  }
  return [
    "\ud83d\ude0a Baby smiled at me",
    "\ud83d\ude4f Feeling grateful",
    "\ud83d\ude34 Good sleep last night",
    "\ud83d\udcaa Feeling strong",
    "\ud83d\udc6d Connected with someone",
    "\u2600\ufe0f Got outside today",
    "\ud83c\udf89 Small win today",
    "\ud83d\udc95 Feeling loved",
  ];
};

// Format an ISO timestamp (or an existing date string) into a YYYY-MM-DD
// display value. Falls back to the raw value if it can't be parsed.
const toDisplayDate = (value: string): string => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toISOString().slice(0, 10);
};

// Normalize either an API item or a mock entry into DisplayMoodEntry.
const normalizeEntry = (entry: ApiMoodItem | { date: string; rating: number; note?: string }): DisplayMoodEntry => {
  const rawDate = "timestamp" in entry ? entry.timestamp : entry.date;
  return {
    rating: entry.rating,
    date: toDisplayDate(rawDate),
    note: entry.note ?? undefined,
  };
};

const MOOD_ENDPOINT = "/.netlify/functions/mood";

// Fallback data (newest-first) so the page still looks good in dev when the
// API is unavailable or returns nothing.
const fallbackHistory: DisplayMoodEntry[] = mockMoodHistory.map(normalizeEntry);

export default function MoodPage() {
  const { user } = useAuth();

  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState<DisplayMoodEntry[]>(fallbackHistory);
  const [consecutiveLowMood, setConsecutiveLowMood] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the last 30 days of mood history for the current user. Newest-first
  // from the API. Falls back to mock data on failure or empty response.
  const fetchMoodHistory = useCallback(async () => {
    if (!user?.userId) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${MOOD_ENDPOINT}?userId=${encodeURIComponent(user.userId)}&days=30`
      );
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();
      const checkins: ApiMoodItem[] = Array.isArray(data?.checkins) ? data.checkins : [];

      if (checkins.length > 0) {
        setMoodHistory(checkins.map(normalizeEntry));
      } else {
        // Keep mock data as a fallback so the page still looks good in dev.
        setMoodHistory(fallbackHistory);
      }
    } catch (err) {
      console.error("Failed to load mood history:", err);
      setMoodHistory(fallbackHistory);
    } finally {
      setLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    fetchMoodHistory();
  }, [fetchMoodHistory]);

  const handleSubmit = async () => {
    if (selectedRating === null) return;

    setError(null);

    if (!user?.userId) {
      setError("You need to be signed in to save a check-in.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(MOOD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          rating: selectedRating,
          note,
          tags: selectedTags,
        }),
      });

      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

      const data = await res.json();

      setConsecutiveLowMood(Boolean(data?.consecutiveLowMood));
      setSubmitted(true);

      // Refresh history so the chart and recent entries reflect the new check-in.
      await fetchMoodHistory();

      // Reset the composer for next time.
      setSelectedRating(null);
      setSelectedTags([]);
      setNote("");

      setTimeout(() => setSubmitted(false), 6000);
    } catch (err) {
      console.error("Failed to save mood check-in:", err);
      setError("We couldn't save your check-in just now. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        const updated = prev.filter((t) => t !== tag);
        setNote(updated.join(", "));
        return updated;
      } else {
        const updated = [...prev, tag];
        setNote(updated.join(", "));
        return updated;
      }
    });
  };

  const getNoteLabel = () => {
    if (selectedRating === null) return "Add a note (optional)";
    if (selectedRating <= 2) return "Want to share what\u2019s weighing on you?";
    if (selectedRating === 3) return "Anything on your mind today?";
    if (selectedRating >= 4) return "What\u2019s making today a good day?";
    return "Add a note (optional)";
  };

  const getPlaceholder = () => {
    if (selectedRating !== null && selectedRating <= 2) return "I\u2019m feeling this way because...";
    if (selectedRating !== null && selectedRating >= 4) return "Today I\u2019m thankful for...";
    return "What\u2019s on your mind?";
  };

  const maxRating = 5;
  // History is newest-first; the chart reads oldest -> newest (left -> right).
  const chartData = [...moodHistory].slice(0, 30).reverse();
  // Recent entries stay newest-first.
  const recentEntries = moodHistory.slice(0, 7);

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
              <span className="text-5xl">\ud83c\udf38</span>
              <p className="mt-4 font-semibold text-warm-gray-800">Thank you for checking in!</p>
              <p className="text-sm text-warm-gray-500 mt-1">
                Every check-in helps you understand your patterns.
              </p>

              {consecutiveLowMood && (
                <div className="mt-6 text-left rounded-2xl border border-primary-100 bg-primary-50/60 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">\ud83e\udec2</span>
                    <div>
                      <p className="font-semibold text-warm-gray-800">
                        We\u2019ve noticed a few tender days in a row.
                      </p>
                      <p className="text-sm text-warm-gray-600 mt-1">
                        Would it help to talk it through? You don\u2019t have to carry this on your own.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 mt-4">
                        <Link href="/mother/epds" className="flex-1">
                          <Button variant="secondary" className="w-full">
                            Take the EPDS check
                          </Button>
                        </Link>
                        <Link href="/mother/chat" className="flex-1">
                          <Button className="w-full">Talk to Mama AI</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-5 gap-2 mb-6">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => { setSelectedRating(rating); setSelectedTags([]); setNote(""); }}
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
                  {getNoteLabel()}
                </label>

                <div className="flex flex-wrap gap-2 mb-3">
                  {getQuickTags(selectedRating).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagToggle(tag)}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-all ${
                        selectedTags.includes(tag)
                          ? "border-primary-500 bg-primary-50 text-primary-700 font-medium"
                          : "border-warm-gray-200 text-warm-gray-600 hover:border-warm-gray-300 hover:bg-warm-gray-50"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                <textarea
                  id="mood-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400 resize-none"
                  placeholder={getPlaceholder()}
                />
              </div>

              {error && (
                <p className="mb-3 text-sm text-red-600" role="alert">
                  {error}
                </p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={selectedRating === null || loading}
                className="w-full"
              >
                {loading ? "Saving\u2026" : "Submit Check-in"}
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
          {recentEntries.map((entry, index) => (
            <div key={`${entry.date}-${index}`} className="flex items-center gap-4 py-2 border-b border-warm-gray-50 last:border-0">
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
