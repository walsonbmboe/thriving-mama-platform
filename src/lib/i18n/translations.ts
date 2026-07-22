export type Language = "en" | "fr" | "pcm";

export interface Translations {
  nav: {
    home: string;
    familyPortal: string;
    signIn: string;
    getStarted: string;
    dashboard: string;
    aiCoach: string;
    mood: string;
    screening: string;
    bookSession: string;
    peers: string;
    sessions: string;
    referrals: string;
    users: string;
    analytics: string;
  };
  common: {
    greeting: string;
    submit: string;
    cancel: string;
    save: string;
    send: string;
    back: string;
    next: string;
    loading: string;
    search: string;
    viewAll: string;
  };
  landing: {
    heroTitle: string;
    heroHighlight: string;
    heroDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
    languageNote: string;
    featuresTitle: string;
    featuresSubtitle: string;
    howItWorksTitle: string;
    ctaFinalTitle: string;
    ctaFinalDescription: string;
    ctaFinalButton: string;
  };
  mother: {
    dashboardGreeting: string;
    dashboardSubtext: string;
    chatTitle: string;
    chatSubtext: string;
    moodTitle: string;
    moodQuestion: string;
    bookingTitle: string;
    peersTitle: string;
    epdsTitle: string;
  };
  footer: {
    description: string;
    platform: string;
    crisisSupport: string;
    available247: string;
    copyright: string;
  };
}
