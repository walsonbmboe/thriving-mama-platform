export type CrisisTier = 'NONE' | 'MONITOR' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface CrisisEvaluation {
  tier: CrisisTier;
  confidence: number;
  matchedSignals: string[];
  reasoning: string;
  shouldEscalate: boolean;
  shouldShowHotlines: boolean;
  shouldDeepenConversation: boolean;
}

const CRITICAL_SIGNALS = [
  "seeing things", "hearing things", "voices in my head", "voices telling me to",
  "my baby isn't real", "baby has been replaced", "someone is going to take my baby",
  "shake the baby", "throw the baby", "hurt the baby", "kill the baby",
  "kill my baby", "killing my baby", "smother my baby", "drown my baby",
  "haven't slept in days", "no sleep for days", "days without any sleep",
];

const HIGH_SIGNALS = [
  "kill myself", "end my life", "take my life", "want to die",
  "wish i was dead", "better off dead", "no reason to live",
  "don't want to be here anymore", "don't want to exist",
  "hurt myself", "harm myself", "cut myself", "self harm", "self-harm", "overdose",
  "je veux mourir", "me suicider", "en finir avec ma vie",
  "i wan die", "make i just go", "nobody go miss me", "na me kill myself",
];

const MEDIUM_SIGNALS = [
  "can't go on", "can't do this anymore", "what's the point",
  "given up", "nothing left", "checked out", "disappear",
  "they'd be better off without me", "my baby would be better without me",
  "not wake up", "no way out", "end it all",
  "plus envie de vivre", "je n'en peux plus",
  "i don tire", "i don give up",
];

const MONITOR_SIGNALS = [
  "losing myself", "losing my identity", "not myself anymore",
  "don't recognise myself", "feel like the baby is in danger",
  "something bad will happen", "scared something will happen",
  "constant worry", "can't stop worrying", "so so tired", "exhausted",
  "no sleep", "feel alone", "feel like a bad mother", "failing as a mother",
  "resent my baby", "don't feel bonded", "don't feel anything", "feel nothing",
  "feel trapped", "wish i could escape", "can't cope",
];

const EXCLUSION_CONTEXT = [
  "used to feel", "felt that way before", "read that some mothers",
  "my friend said", "i heard that", "in the past", "not anymore", "getting better",
];

export function evaluateCrisis(
  message: string,
  conversationHistory: string[] = []
): CrisisEvaluation {
  const lower = message.toLowerCase();

  const hasExclusionContext = EXCLUSION_CONTEXT.some(phrase =>
    lower.includes(phrase)
  );

  const criticalMatches = CRITICAL_SIGNALS.filter(s => lower.includes(s));
  const highMatches = HIGH_SIGNALS.filter(s => lower.includes(s));
  const mediumMatches = MEDIUM_SIGNALS.filter(s => lower.includes(s));
  const monitorMatches = MONITOR_SIGNALS.filter(s => lower.includes(s));

  if (criticalMatches.length > 0) {
    return {
      tier: 'CRITICAL',
      confidence: 0.95,
      matchedSignals: criticalMatches,
      reasoning: `Postpartum psychosis or imminent harm signals: ${criticalMatches.join(', ')}`,
      shouldEscalate: true,
      shouldShowHotlines: true,
      shouldDeepenConversation: false,
    };
  }

  if (highMatches.length > 0) {
    const tier = hasExclusionContext ? 'MEDIUM' : 'HIGH';
    return {
      tier,
      confidence: hasExclusionContext ? 0.6 : 0.9,
      matchedSignals: highMatches,
      reasoning: `Active suicidal ideation: ${highMatches.join(', ')}${hasExclusionContext ? ' (past context noted)' : ''}`,
      shouldEscalate: tier === 'HIGH',
      shouldShowHotlines: tier === 'HIGH',
      shouldDeepenConversation: tier === 'MEDIUM',
    };
  }

  if (mediumMatches.length > 0) {
    return {
      tier: 'MEDIUM',
      confidence: 0.7,
      matchedSignals: mediumMatches,
      reasoning: `Passive ideation or profound hopelessness: ${mediumMatches.join(', ')}`,
      shouldEscalate: false,
      shouldShowHotlines: false,
      shouldDeepenConversation: true,
    };
  }

  if (monitorMatches.length > 0) {
    return {
      tier: 'MONITOR',
      confidence: 0.5,
      matchedSignals: monitorMatches,
      reasoning: `Common postpartum distress — deepen conversation: ${monitorMatches.join(', ')}`,
      shouldEscalate: false,
      shouldShowHotlines: false,
      shouldDeepenConversation: true,
    };
  }

  return {
    tier: 'NONE',
    confidence: 1,
    matchedSignals: [],
    reasoning: 'No crisis signals detected',
    shouldEscalate: false,
    shouldShowHotlines: false,
    shouldDeepenConversation: false,
  };
}
