"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";

export default function MotherLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 const { user } = useAuth();

 return (
 <ProtectedRoute allowedRoles={["mother"]}>
 <Navbar userRole="mother" userName={user?.name || ""} />
 <main className="flex-1 bg-warm-gray-50">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
 {children}
 </div>
 </main>
 <Footer />
 </ProtectedRoute>
 );
}
