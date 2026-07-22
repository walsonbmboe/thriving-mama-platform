import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-warm-gray-800 text-warm-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">TM</span>
              </div>
              <span className="font-heading text-lg font-bold text-white">
                ThrivingMama
              </span>
            </div>
            <p className="text-sm text-warm-gray-400 max-w-sm">
              AI-powered maternal mental health support for mothers across Africa.
              24/7 access to compassionate care, community, and resources.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2">
              <li><Link href="/family-portal" className="text-sm hover:text-primary-300 transition-colors">Family Portal</Link></li>
              <li><Link href="/register" className="text-sm hover:text-primary-300 transition-colors">Get Started</Link></li>
              <li><Link href="/login" className="text-sm hover:text-primary-300 transition-colors">Sign In</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">
              Crisis Support
            </h3>
            <ul className="space-y-2">
              <li className="text-sm">Emergency: <span className="text-primary-300 font-semibold">112</span></li>
              <li className="text-sm">Crisis Line: <span className="text-primary-300 font-semibold">988</span></li>
              <li className="text-sm text-warm-gray-400">Available 24/7</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-warm-gray-700 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-warm-gray-500">
            &copy; {new Date().getFullYear()} ThrivingMama. Founded by Sharon Asukia Mboe. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-warm-gray-500 hover:text-warm-gray-300">Privacy Policy</Link>
            <Link href="#" className="text-xs text-warm-gray-500 hover:text-warm-gray-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
