export interface ChatMessage {
  id: string;
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  crisisFlag: boolean;
  createdAt: string;
}

export interface ChatSession {
  id: string;
  startedAt: string;
  messageCount: number;
  preview: string;
}

export const mockChatSessions: ChatSession[] = [
  {
    id: "session-001",
    startedAt: "2026-06-17T08:00:00Z",
    messageCount: 6,
    preview: "I've been feeling overwhelmed with the baby...",
  },
  {
    id: "session-002",
    startedAt: "2026-06-15T14:30:00Z",
    messageCount: 4,
    preview: "Can you help me with sleep routines?",
  },
  {
    id: "session-003",
    startedAt: "2026-06-12T09:15:00Z",
    messageCount: 8,
    preview: "I want to talk about my anxiety...",
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: "msg-001",
    sessionId: "session-001",
    role: "user",
    content:
      "Hi, I've been feeling really overwhelmed lately. The baby cries all night and I don't know if I'm doing this right.",
    crisisFlag: false,
    createdAt: "2026-06-17T08:00:00Z",
  },
  {
    id: "msg-002",
    sessionId: "session-001",
    role: "assistant",
    content:
      "Thank you for sharing that with me, Amara. What you're experiencing is very common among new mothers, and it takes real courage to talk about it. The exhaustion from sleepless nights can make everything feel much harder than it actually is. You are doing a wonderful job by being here and seeking support. Can you tell me more about how long this has been going on?",
    crisisFlag: false,
    createdAt: "2026-06-17T08:00:30Z",
  },
  {
    id: "msg-003",
    sessionId: "session-001",
    role: "user",
    content:
      "About 3 weeks now. Some days I feel like I can't even get out of bed. My mother-in-law keeps saying I should just be grateful.",
    crisisFlag: false,
    createdAt: "2026-06-17T08:01:00Z",
  },
  {
    id: "msg-004",
    sessionId: "session-001",
    role: "assistant",
    content:
      "I hear you, and your feelings are completely valid. Three weeks of persistent low mood and difficulty getting out of bed can be signs that you might benefit from some extra support. It's important to know that these feelings don't mean you're ungrateful — they're a sign that your mind and body need care too.\n\nHere are a few things that might help:\n\n1. Try to rest when the baby rests, even if just for 15 minutes\n2. Share night duties with your partner or a family member if possible\n3. Keep a small daily routine — even brushing your teeth counts as a win\n\nWould you like to try our daily mood check-in? It can help us track how you're feeling over time and notice patterns together.",
    crisisFlag: false,
    createdAt: "2026-06-17T08:01:30Z",
  },
  {
    id: "msg-005",
    sessionId: "session-001",
    role: "user",
    content: "Yes, I'd like to try the mood tracking. Thank you for understanding.",
    crisisFlag: false,
    createdAt: "2026-06-17T08:02:00Z",
  },
  {
    id: "msg-006",
    sessionId: "session-001",
    role: "assistant",
    content:
      "I'm glad you're open to trying it! You can find the mood check-in on your dashboard — it only takes a few seconds each day. Just pick a number from 1 to 5 that represents how you're feeling.\n\nRemember: there's no wrong answer, and bad days don't erase your progress. I'm here whenever you need to talk. You're not alone in this journey, mama.",
    crisisFlag: false,
    createdAt: "2026-06-17T08:02:30Z",
  },
];

export function getMockAIResponse(message: string): string {
  const responses = [
    "Thank you for sharing that with me. It sounds like you're going through a lot right now. Remember, it's okay to feel this way and asking for help is a sign of strength. What would feel most supportive for you right now?",
    "I understand how challenging this can be. Many mothers experience similar feelings, and you're not alone. Let's talk about some strategies that might help you feel more grounded. Would you like to explore some breathing exercises or talk more about what's on your mind?",
    "That's a really important observation about yourself. Self-awareness is the first step toward feeling better. I want you to know that your feelings matter and you deserve support. Shall we explore this further, or would you like me to suggest some resources?",
    "I hear you, and I want you to know that what you're feeling is valid. Being a new mother comes with so many changes — physical, emotional, and social. Let's take this one step at a time. What feels like the most pressing concern right now?",
    "You're doing better than you think, even if it doesn't feel that way right now. The fact that you're here, talking about your feelings, shows incredible strength. Let's work together to find ways to lighten the load. What does your support system look like?",
  ];

  if (message.toLowerCase().includes("sleep")) {
    return "Sleep challenges are one of the most common struggles for new mothers. Here are a few things that have helped other mothers: establishing a consistent bedtime routine, sharing night feeds with a partner, and resting when the baby rests even during the day. Would you like to talk more about creating a sleep strategy?";
  }

  if (message.toLowerCase().includes("anxious") || message.toLowerCase().includes("anxiety")) {
    return "Anxiety is very common in new motherhood, and it's something we can work through together. When you notice anxious thoughts, try the 5-4-3-2-1 grounding technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. Would you like to explore other coping strategies?";
  }

  return responses[Math.floor(Math.random() * responses.length)];
}
