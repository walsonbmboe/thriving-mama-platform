export interface PeerMatch {
  id: string;
  name: string;
  babyAge: string;
  language: string;
  challenges: string[];
  matchScore: number;
}

export interface PeerMessage {
  id: string;
  threadId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

export interface PeerConnection {
  id: string;
  peerId: string;
  peerName: string;
  threadId: string;
  status: "active" | "removed";
  lastMessage?: string;
  lastMessageAt?: string;
}

export const mockPeerMatches: PeerMatch[] = [
  {
    id: "user-002",
    name: "Fatima N.",
    babyAge: "3 months",
    language: "French",
    challenges: ["sleep", "anxiety", "isolation"],
    matchScore: 85,
  },
  {
    id: "user-004",
    name: "Grace A.",
    babyAge: "2 months",
    language: "English",
    challenges: ["overwhelm", "sleep", "feeding"],
    matchScore: 78,
  },
  {
    id: "user-005",
    name: "Chioma E.",
    babyAge: "4 months",
    language: "Pidgin",
    challenges: ["isolation", "body-image", "sleep"],
    matchScore: 72,
  },
];

export const mockPeerConnections: PeerConnection[] = [
  {
    id: "conn-001",
    peerId: "user-002",
    peerName: "Fatima N.",
    threadId: "thread-001",
    status: "active",
    lastMessage: "How was your night? My baby finally slept 4 hours!",
    lastMessageAt: "2026-06-17T07:30:00Z",
  },
];

export const mockPeerMessages: PeerMessage[] = [
  {
    id: "pm-001",
    threadId: "thread-001",
    senderId: "user-002",
    senderName: "Fatima N.",
    content: "Hi Amara! I saw we were matched. I'm also dealing with sleepless nights. How are you coping?",
    createdAt: "2026-06-15T10:00:00Z",
  },
  {
    id: "pm-002",
    threadId: "thread-001",
    senderId: "user-001",
    senderName: "Amara O.",
    content: "Hi Fatima! It's so good to connect with someone who understands. Some nights are really hard. Do you have any tips?",
    createdAt: "2026-06-15T10:15:00Z",
  },
  {
    id: "pm-003",
    threadId: "thread-001",
    senderId: "user-002",
    senderName: "Fatima N.",
    content: "I've been trying to nap when baby naps during the day. Also, white noise really helps my little one. Have you tried it?",
    createdAt: "2026-06-15T10:30:00Z",
  },
  {
    id: "pm-004",
    threadId: "thread-001",
    senderId: "user-001",
    senderName: "Amara O.",
    content: "I'll try the white noise! Thank you. It really helps just knowing I'm not alone in this.",
    createdAt: "2026-06-15T11:00:00Z",
  },
  {
    id: "pm-005",
    threadId: "thread-001",
    senderId: "user-002",
    senderName: "Fatima N.",
    content: "How was your night? My baby finally slept 4 hours!",
    createdAt: "2026-06-17T07:30:00Z",
  },
];
