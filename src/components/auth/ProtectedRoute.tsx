"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { UserRole } from "@/lib/auth/auth";

interface ProtectedRouteProps {
 children: React.ReactNode;
 allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
 const { user, isLoading, isAuthenticated } = useAuth();

 useEffect(() => {
 if (!isLoading && !isAuthenticated) {
 window.location.href = "/login";
 }
 }, [isLoading, isAuthenticated]);

 useEffect(() => {
 if (!isLoading && isAuthenticated && allowedRoles && user) {
 if (!allowedRoles.includes(user.role)) {
 window.location.href = "/login";
 }
 }
 }, [isLoading, isAuthenticated, allowedRoles, user]);

 if (isLoading) {
 return (
 <div className="min-h-screen flex items-center justify-center bg-warm-gray-50">
 <div className="text-center">
 <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" />
 <p className="text-warm-gray-500 text-sm">Loading...</p>
 </div>
 </div>
 );
 }

 if (!isAuthenticated) {
 return null;
 }

 if (allowedRoles && user && !allowedRoles.includes(user.role)) {
 return null;
 }

 return <>{children}</>;
}
