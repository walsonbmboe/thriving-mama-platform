import Card from "@/components/ui/Card";

const upcomingSessions = [
  { id: 1, motherName: "Amara Okafor", time: "June 18, 9:00 AM", type: "Follow-up" },
  { id: 2, motherName: "Blessing Eze", time: "June 19, 2:00 PM", type: "First Session" },
  { id: 3, motherName: "Grace Asante", time: "June 20, 10:00 AM", type: "Follow-up" },
];

const pendingReferrals = [
  {
    id: 1,
    motherName: "Fatima Ndiaye",
    date: "June 16, 2026",
    reason: "Persistent low mood and sleep disturbance. Mother expressed feelings of hopelessness across 3 consecutive sessions.",
  },
  {
    id: 2,
    motherName: "Chioma Eke",
    date: "June 15, 2026",
    reason: "EPDS score of 14 triggered automatic referral. Mother reports increasing anxiety and difficulty bonding.",
  },
];

const highRiskMothers = [
  { id: 1, name: "Fatima Ndiaye", epds: 14, mood: 2, crisisEvent: true },
  { id: 2, name: "Chioma Eke", epds: 12, mood: 2, crisisEvent: false },
  { id: 3, name: "Ada Nwankwo", epds: 11, mood: 1, crisisEvent: false },
];

export default function CounselorDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-warm-gray-900">Counselor Dashboard</h1>
        <p className="mt-1 text-warm-gray-600">
          Welcome back, Dr. Ngozi. You have {upcomingSessions.length} upcoming sessions.
        </p>
      </div>

      {/* Crisis Alert Banner */}
      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl">🚨</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-red-700">Active Crisis Event</p>
          <p className="text-sm text-red-600">
            Fatima Ndiaye triggered a crisis alert at 7:45 AM today. Emergency hotline info displayed. Review recommended.
          </p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
          Review
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Sessions */}
        <Card className="lg:col-span-2">
          <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
            Upcoming Sessions
          </h2>
          <div className="space-y-3">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-4 bg-warm-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">
                      {session.motherName.split(" ").map(n => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-warm-gray-800">{session.motherName}</p>
                    <p className="text-xs text-warm-gray-500">{session.time}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-accent-100 text-accent-700 text-xs font-medium rounded-full">
                  {session.type}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* High Risk Mothers */}
        <Card>
          <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
            High-Risk Mothers
          </h2>
          <div className="space-y-3">
            {highRiskMothers.map((mother) => (
              <div key={mother.id} className="p-3 border border-warm-gray-100 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-warm-gray-800 text-sm">{mother.name}</p>
                  {mother.crisisEvent && (
                    <span className="w-2 h-2 bg-red-500 rounded-full" />
                  )}
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                    EPDS: {mother.epds}
                  </span>
                  <span className="px-2 py-0.5 text-xs bg-orange-100 text-orange-700 rounded-full">
                    Mood: {mother.mood}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Referrals */}
        <Card className="lg:col-span-3">
          <h2 className="font-heading text-lg font-bold text-warm-gray-800 mb-4">
            Pending Smart Referrals
          </h2>
          <div className="space-y-4">
            {pendingReferrals.map((referral) => (
              <div key={referral.id} className="p-4 border border-warm-gray-100 rounded-xl flex items-start gap-4">
                <div className="w-10 h-10 bg-sunshine-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-sunshine-700">
                    {referral.motherName.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-warm-gray-800">{referral.motherName}</p>
                    <span className="text-xs text-warm-gray-500">{referral.date}</span>
                  </div>
                  <p className="text-sm text-warm-gray-600 mt-1">{referral.reason}</p>
                </div>
                <button className="px-3 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-semibold hover:bg-primary-600 transition-colors">
                  Mark Reviewed
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
