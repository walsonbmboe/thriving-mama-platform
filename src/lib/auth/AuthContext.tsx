"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { configureAuth } from "./config";
import { getCurrentUser, signOut as authSignOut, AuthUser, UserRole, getDashboardPath } from "./auth";

// Configure Amplify on module load
configureAuth();

interface AuthContextType {
 user: AuthUser | null;
 isLoading: boolean;
 isAuthenticated: boolean;
 role: UserRole | null;
 refreshUser: () => Promise<void>;
 logout: () => Promise<void>;
 getDashboard: () => string;
}

const AuthContext = createContext<AuthContextType>({
 user: null,
 isLoading: true,
 isAuthenticated: false,
 role: null,
 refreshUser: async () => {},
 logout: async () => {},
 getDashboard: () => "/mother",
});

export function AuthProvider({ children }: { children: ReactNode }) {
 const [user, setUser] = useState<AuthUser | null>(null);
 const [isLoading, setIsLoading] = useState(true);

 const refreshUser = useCallback(async () => {
 try {
 const currentUser = await getCurrentUser();
 setUser(currentUser);
 } catch {
 setUser(null);
 } finally {
 setIsLoading(false);
 }
 }, []);

 useEffect(() => {
 refreshUser();
 }, [refreshUser]);

 const logout = useCallback(async () => {
 await authSignOut();
 setUser(null);
 window.location.href = "/login";
 }, []);

 const getDashboard = useCallback(() => {
 return user ? getDashboardPath(user.role) : "/mother";
 }, [user]);

 return (
 <AuthContext.Provider
 value={{
 user,
 isLoading,
 isAuthenticated: !!user,
 role: user?.role || null,
 refreshUser,
 logout,
 getDashboard,
 }}
 >
 {children}
 </AuthContext.Provider>
 );
}

export function useAuth() {
 const context = useContext(AuthContext);
 if (!context) {
 throw new Error("useAuth must be used within an AuthProvider");
 }
 return context;
}
