"use client";

import { useState, useCallback, useEffect } from "react";
import { OnboardingState, INITIAL_STATE } from "../types";

const STORAGE_KEY = "thriving-mama-onboarding";

export function useOnboarding() {
 const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
 const [isTransitioning, setIsTransitioning] = useState(false);
 const [isHydrated, setIsHydrated] = useState(false);

 // Hydrate from localStorage after mount (avoids SSR mismatch)
 useEffect(() => {
 const saved = localStorage.getItem(STORAGE_KEY);
 if (saved) {
 try { setState(JSON.parse(saved)); } catch { /* ignore */ }
 }
 setIsHydrated(true);
 }, []);

 // Persist state to localStorage on every change (after hydration)
 useEffect(() => {
 if (isHydrated) {
 localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
 }
 }, [state, isHydrated]);

 const updateState = useCallback((updates: Partial<OnboardingState>) => {
 setState((prev) => ({ ...prev, ...updates }));
 }, []);

 const goToStep = useCallback((step: number) => {
 setIsTransitioning(true);
 setTimeout(() => {
 setState((prev) => ({ ...prev, currentStep: step }));
 setIsTransitioning(false);
 }, 300);
 }, []);

 const onNext = useCallback(() => {
 goToStep(state.currentStep + 1);
 }, [state.currentStep, goToStep]);

 const onBack = useCallback(() => {
 if (state.currentStep > 0) {
 goToStep(state.currentStep - 1);
 }
 }, [state.currentStep, goToStep]);

 const completeOnboarding = useCallback(() => {
 setState((prev) => ({ ...prev, isOnboardingComplete: true, currentStep: 6 }));
 localStorage.removeItem(STORAGE_KEY);
 }, []);

 const saveProgress = useCallback(async (eventName: string, data?: Record<string, unknown>) => {
 const payload = {
 event: eventName,
 timestamp: new Date().toISOString(),
 state: {
 currentOnboardingStep: state.currentStep,
 initialWellbeingStatus: state.initialWellbeingStatus,
 languagePreference: state.languagePreference,
 babyStage: state.babyStage,
 firstBaby: state.firstBaby,
 challenges: state.challenges,
 supportNetwork: state.supportNetwork,
 isOnboardingComplete: state.isOnboardingComplete,
 },
 ...data,
 };
 console.log("[Onboarding Analytics]", payload);
 }, [state]);

 return {
 state,
 updateState,
 onNext,
 onBack,
 goToStep,
 completeOnboarding,
 saveProgress,
 isTransitioning,
 isHydrated,
 };
}
