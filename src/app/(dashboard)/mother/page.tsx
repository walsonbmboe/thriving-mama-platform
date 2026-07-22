import Link from "next/link";
import Card from "@/components/ui/Card";

export default function MotherDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-warm-gray-900">
          Good morning, Amara
        </h1>
        <p className="mt-1 text-warm-gray-600">
          How are you feeling today? Remember, you&apos;re doing amazing.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link href="/mother/chat">
          <Card className="hover:border-primary-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">💬</span>
              </div>
              <div>
                <h3 className="font-semibold text-warm-gray-800">Chat with AI Coach</h3>
                <p className="text-sm text-warm-gray-500">Talk anytime, day or night</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/mother/mood">
          <Card className="hover:border-sunshine-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-sunshine-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📊</span>
              </div>
              <div>
                <h3 className="font-semibold text-warm-gray-800">Daily Mood Check-in</h3>
                <p className="text-sm text-warm-gray-500">Track how you&apos;re feeling</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/mother/booking">
          <Card className="hover:border-accent-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">📅</span>
              </div>
              <div>
                <h3 className="font-semibold text-warm-gray-800">Book a Session</h3>
                <p className="text-sm text-warm-gray-500">See a professional counselor</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Mood */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-warm-gray-800">Recent Mood</h3>
            <Link href="/mother/mood" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {["😐", "😔", "😔", "😐", "😊", "😐", "😔"].map((emoji, i) => (
                <span key={i} className="text-2xl">{emoji}</span>
              ))}
            </div>
          </div>
          <p className="mt-3 text-sm text-warm-gray-500">Last 7 days</p>
        </Card>

        {/* Upcoming Session */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-warm-gray-800">Upcoming Session</h3>
            <Link href="/mother/booking" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              Manage
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-accent-700">NA</span>
            </div>
            <div>
              <p className="font-semibold text-warm-gray-800">Dr. Ngozi Adeyemi</p>
              <p className="text-sm text-warm-gray-500">June 18, 2026 at 9:00 AM</p>
            </div>
          </div>
        </Card>

        {/* EPDS Reminder */}
        <Card className="border-sunshine-200 bg-sunshine-50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-sunshine-200 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🩺</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-warm-gray-800">EPDS Screening Due</h3>
              <p className="text-sm text-warm-gray-600">
                Your last screening was 7 days ago. Take a quick check-in.
              </p>
            </div>
            <Link
              href="/mother/epds"
              className="px-4 py-2 bg-sunshine-500 text-white rounded-lg text-sm font-semibold hover:bg-sunshine-600 transition-colors"
            >
              Take Now
            </Link>
          </div>
        </Card>

        {/* Peer Connection */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading text-lg font-bold text-warm-gray-800">Peer Connections</h3>
            <Link href="/mother/peers" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              See all
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold text-secondary-700">FN</span>
            </div>
            <div className="flex-1">
              <p className="font-medium text-warm-gray-800">Fatima N.</p>
              <p className="text-sm text-warm-gray-500 truncate">
                How was your night? My baby finally slept 4 hours!
              </p>
            </div>
            <span className="w-2.5 h-2.5 bg-primary-500 rounded-full" />
          </div>
        </Card>
      </div>
    </div>
  );
}
