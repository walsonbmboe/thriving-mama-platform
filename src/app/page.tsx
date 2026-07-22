import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-secondary-50 to-sunshine-50">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary-300 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-20 w-96 h-96 bg-secondary-300 rounded-full blur-3xl" />
            <div className="absolute top-40 right-40 w-48 h-48 bg-sunshine-300 rounded-full blur-3xl" />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-gray-900 leading-tight">
                You Are Not Alone,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-secondary-500">
                  Mama
                </span>
              </h1>
              <p className="mt-6 text-lg sm:text-xl text-warm-gray-600 max-w-2xl mx-auto leading-relaxed">
                AI-powered maternal mental health support available 24/7.
                Get compassionate guidance, track your well-being, connect with peers,
                and access professional counselors — all in your language.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl shadow-lg hover:shadow-xl hover:from-primary-600 hover:to-primary-700 transition-all duration-200"
                >
                  Get Started Free
                </Link>
                <Link
                  href="/family-portal"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 border-2 border-primary-200 bg-white rounded-xl hover:bg-primary-50 transition-all duration-200"
                >
                  Family Resources
                </Link>
              </div>
              <p className="mt-4 text-sm text-warm-gray-500">
                Available in English, French, and Pidgin English
              </p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900">
                Everything You Need to{" "}
                <span className="text-primary-500">Thrive</span>
              </h2>
              <p className="mt-4 text-lg text-warm-gray-600 max-w-2xl mx-auto">
                Comprehensive support designed for the unique journey of African motherhood
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="p-6 rounded-2xl border border-warm-gray-100 hover:border-primary-200 hover:shadow-md transition-all duration-200 group"
                >
                  <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <span className="text-2xl" role="img" aria-label={feature.title}>{feature.icon}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-warm-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-gradient-to-b from-warm-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900">
                How It Works
              </h2>
              <p className="mt-4 text-lg text-warm-gray-600">
                Start your journey in just a few steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <div key={step.title} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {index + 1}
                  </div>
                  <h3 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-warm-gray-600 text-sm">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary-500 to-secondary-500">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-6">
              Every Mother Deserves Support
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join hundreds of mothers across Africa who are finding strength,
              connection, and hope through ThrivingMama.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-primary-600 bg-white rounded-xl shadow-lg hover:shadow-xl hover:bg-primary-50 transition-all duration-200"
            >
              Start Your Journey Today
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const features = [
  {
    icon: "💬",
    iconBg: "bg-primary-100",
    title: "AI Chat Coach",
    description:
      "24/7 empathetic AI companion trained in maternal mental health. Get immediate support in English, French, or Pidgin English.",
  },
  {
    icon: "📊",
    iconBg: "bg-sunshine-100",
    title: "Mood Tracking",
    description:
      "Simple daily check-ins to understand your emotional patterns. Visual charts help you and your care team see progress over time.",
  },
  {
    icon: "🩺",
    iconBg: "bg-accent-100",
    title: "EPDS Screening",
    description:
      "Validated clinical screening to monitor your mental health with the Edinburgh Postnatal Depression Scale.",
  },
  {
    icon: "🚨",
    iconBg: "bg-red-100",
    title: "Crisis Detection",
    description:
      "Automatic detection of crisis signals with immediate human counselor escalation. You're never alone in a dark moment.",
  },
  {
    icon: "👩‍👩‍👧",
    iconBg: "bg-secondary-100",
    title: "Peer Connections",
    description:
      "Connect with mothers who share similar experiences. Find understanding, friendship, and mutual support.",
  },
  {
    icon: "📅",
    iconBg: "bg-earth-100",
    title: "Book a Counselor",
    description:
      "Schedule sessions with professional mental health counselors when you need human expert care.",
  },
];

const steps = [
  {
    title: "Sign Up",
    description:
      "Create your free account in minutes. Choose your preferred language and tell us a bit about yourself.",
  },
  {
    title: "Start Chatting",
    description:
      "Begin a conversation with your AI coach anytime — day or night. It's private, judgment-free, and always available.",
  },
  {
    title: "Grow & Connect",
    description:
      "Track your mood, complete screenings, connect with peers, and book professional sessions as needed.",
  },
];
