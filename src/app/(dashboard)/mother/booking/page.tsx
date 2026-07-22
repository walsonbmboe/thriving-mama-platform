"use client";

import { useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { mockSlots, mockSessions } from "@/lib/mock-data/booking";

export default function BookingPage() {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  const availableSlots = mockSlots.filter((s) => s.status === "available");
  const upcomingSessions = mockSessions.filter((s) => s.status === "confirmed");
  const pastSessions = mockSessions.filter((s) => s.status === "completed");

  const handleBook = () => {
    if (!selectedSlot) return;
    setBookingConfirmed(true);
    setTimeout(() => setBookingConfirmed(false), 4000);
  };

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-bold text-warm-gray-900">Book a Session</h1>
        <p className="text-sm text-warm-gray-500">
          Schedule a one-on-one session with a professional counselor.
        </p>
      </div>

      {bookingConfirmed && (
        <div className="mb-6 p-4 bg-accent-50 border border-accent-200 rounded-xl flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-semibold text-accent-700">Session Booked!</p>
            <p className="text-sm text-accent-600">A confirmation email has been sent to you.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Slots */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
              Available Time Slots
            </h2>
            <div className="space-y-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot.id)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    selectedSlot === slot.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-warm-gray-100 hover:border-warm-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-warm-gray-800">{slot.counselorName}</p>
                      <p className="text-sm text-warm-gray-500">{formatDateTime(slot.startTime)}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      selectedSlot === slot.id
                        ? "border-primary-500 bg-primary-500"
                        : "border-warm-gray-300"
                    }`}>
                      {selectedSlot === slot.id && (
                        <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <Button
              onClick={handleBook}
              disabled={!selectedSlot}
              className="w-full mt-4"
            >
              Confirm Booking
            </Button>
          </Card>
        </div>

        {/* Sidebar: My Sessions */}
        <div className="space-y-6">
          <Card>
            <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
              Upcoming Sessions
            </h2>
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-warm-gray-500">No upcoming sessions.</p>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.map((session) => (
                  <div key={session.id} className="p-3 bg-accent-50 rounded-xl border border-accent-100">
                    <p className="font-semibold text-warm-gray-800 text-sm">{session.counselorName}</p>
                    <p className="text-xs text-warm-gray-500">{formatDateTime(session.startTime)}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-accent-200 text-accent-700 rounded-full font-medium">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
              Past Sessions
            </h2>
            {pastSessions.length === 0 ? (
              <p className="text-sm text-warm-gray-500">No past sessions yet.</p>
            ) : (
              <div className="space-y-3">
                {pastSessions.map((session) => (
                  <div key={session.id} className="p-3 bg-warm-gray-50 rounded-xl">
                    <p className="font-semibold text-warm-gray-800 text-sm">{session.counselorName}</p>
                    <p className="text-xs text-warm-gray-500">{formatDateTime(session.startTime)}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-warm-gray-200 text-warm-gray-600 rounded-full font-medium">
                      Completed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
