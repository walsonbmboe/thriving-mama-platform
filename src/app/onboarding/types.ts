export type WellbeingStatus = "okay" | "struggling" | "crisis";
export type BabyStage = "pregnant" | "0-3m" | "3-6m" | "6-12m" | "12m+";
export type SupportNetwork = "partner" | "family" | "friends" | "mostly_alone" | "complicated";
export type Language = "en" | "fr" | "pcm";

export const CHALLENGES = [
 { id: "sleep", emoji: "😴", label: "Sleep deprivation" },
 { id: "anxiety", emoji: "😰", label: "Anxiety or worry" },
 { id: "loneliness", emoji: "🫂", label: "Loneliness or isolation" },
 { id: "relationship", emoji: "💑", label: "Relationship stress" },
 { id: "breastfeeding", emoji: "🤱", label: "Breastfeeding challenges" },
 { id: "anger", emoji: "😤", label: "Anger or irritability" },
 { id: "brainfog", emoji: "🧠", label: "Brain fog or confusion" },
 { id: "low_mood", emoji: "😢", label: "Feeling low or hopeless" },
 { id: "financial", emoji: "🏠", label: "Financial or housing stress" },
 { id: "other", emoji: "🌀", label: "Something else" },
] as const;

export const BABY_STAGES = [
 { id: "pregnant" as BabyStage, emoji: "🤰", label: "I'm pregnant" },
 { id: "0-3m" as BabyStage, emoji: "👶", label: "My baby is 0–3 months" },
 { id: "3-6m" as BabyStage, emoji: "🌱", label: "My baby is 3–6 months" },
 { id: "6-12m" as BabyStage, emoji: "🌸", label: "My baby is 6–12 months" },
 { id: "12m+" as BabyStage, emoji: "🌟", label: "My baby is 12 months or older" },
] as const;

export const SUPPORT_OPTIONS = [
 { id: "partner" as SupportNetwork, emoji: "💑", label: "A supportive partner or co-parent" },
 { id: "family" as SupportNetwork, emoji: "👨‍👩‍👧", label: "Family nearby who help" },
 { id: "friends" as SupportNetwork, emoji: "👭", label: "Friends I can talk to" },
 { id: "mostly_alone" as SupportNetwork, emoji: "🤲", label: "Mostly on my own" },
 { id: "complicated" as SupportNetwork, emoji: "🌀", label: "It's complicated" },
] as const;

export interface OnboardingState {
 currentStep: number;
 initialWellbeingStatus: WellbeingStatus | null;
 languagePreference: Language;
 babyStage: BabyStage | null;
 firstBaby: boolean | null;
 challenges: string[];
 supportNetwork: SupportNetwork | null;
 consentGiven: boolean;
 epdsChoice: "started" | "skipped" | null;
 isOnboardingComplete: boolean;
}

export const INITIAL_STATE: OnboardingState = {
 currentStep: 0,
 initialWellbeingStatus: null,
 languagePreference: "en",
 babyStage: null,
 firstBaby: null,
 challenges: [],
 supportNetwork: null,
 consentGiven: false,
 epdsChoice: null,
 isOnboardingComplete: false,
};

export interface StepProps {
 state: OnboardingState;
 onNext: () => void;
 onBack: () => void;
 updateState: (updates: Partial<OnboardingState>) => void;
}
