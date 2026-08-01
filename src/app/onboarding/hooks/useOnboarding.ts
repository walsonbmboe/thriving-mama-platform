"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { OnboardingState, INITIAL_STATE } from "../types";
import { useAuth } from "@/lib/auth/AuthContext";

const STORAGE_KEY = "thriving-mama-onboarding";

export function useOnboarding() {
  const { user } = useAuth();
  const [state, setState] = useState<OnboardingState>(INITIAL_STATE);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const savingRef = useRef(false);

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

  // Save progress to DynamoDB via API (non-blocking)
  const saveToAPI = useCallback(async (currentState: OnboardingState) => {
    if (!user?.userId || savingRef.current) return;
    
    savingRef.current = true;
    try {
      await fetch("/.netlify/functions/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          initialWellbeingStatus: currentState.initialWellbeingStatus,
          languagePreference: currentState.languagePreference,
          babyStage: currentState.babyStage,
          firstBaby: currentState.firstBaby,
          challenges: currentState.challenges,
          supportNetwork: currentState.supportNetwork ? [currentState.supportNetwork] : [],
          currentOnboardingStep: currentState.currentStep,
          isOnboardingComplete: currentState.isOnboardingComplete,
        }),
      });
    } catch (error) {
      console.error("[Onboarding] Failed to save progress:", error);
    } finally {
      savingRef.current = false;
    }
  }, [user]);

  const updateState = useCallback((updates: Partial<OnboardingState>) => {
    setState((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback((step: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setState((prev) => {
        const newState = { ...prev, currentStep: step };
        // Save to API when advancing (non-blocking)
        saveToAPI(newState);
        return newState;
      });
      setIsTransitioning(false);
    }, 300);
  }, [saveToAPI]);

  const onNext = useCallback(() => {
    goToStep(state.currentStep + 1);
  }, [state.currentStep, goToStep]);

  const onBack = useCallback(() => {
    if (state.currentStep > 0) {
      goToStep(state.currentStep - 1);
    }
  }, [state.currentStep, goToStep]);

  const completeOnboarding = useCallback(() => {
    const finalState = { ...state, isOnboardingComplete: true, currentStep: 6 };
    setState(finalState);
    saveToAPI(finalState);
    localStorage.removeItem(STORAGE_KEY);
  }, [state, saveToAPI]);

  const saveProgress = useCallback(async (eventName: string, data?: Record<string, unknown>) => {
    console.log("[Onboarding Event]", eventName, data);
    saveToAPI(state);
  }, [state, saveToAPI]);

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
