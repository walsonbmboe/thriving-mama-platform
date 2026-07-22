export interface PlatformMetrics {
  totalMothers: number;
  totalSessions: number;
  totalCrisisInterventions: number;
  averageEPDSImprovement: number;
  dailyActiveUsers: number;
  messagesPerDay: number;
  crisisEventsThisMonth: number;
}

export interface CounselorPerformance {
  counselorId: string;
  name: string;
  completedSessions: number;
  averageRating: number;
  crisisHandled: number;
}

export const mockMetrics: PlatformMetrics = {
  totalMothers: 247,
  totalSessions: 89,
  totalCrisisInterventions: 12,
  averageEPDSImprovement: 3.2,
  dailyActiveUsers: 45,
  messagesPerDay: 312,
  crisisEventsThisMonth: 3,
};

export const mockCounselorPerformance: CounselorPerformance[] = [
  {
    counselorId: "counselor-001",
    name: "Dr. Ngozi Adeyemi",
    completedSessions: 52,
    averageRating: 4.8,
    crisisHandled: 7,
  },
  {
    counselorId: "counselor-002",
    name: "Dr. Kofi Mensah",
    completedSessions: 37,
    averageRating: 4.6,
    crisisHandled: 5,
  },
];

export const mockMonthlyData = [
  { month: "Jan", users: 42, sessions: 8, messages: 2100 },
  { month: "Feb", users: 68, sessions: 14, messages: 3400 },
  { month: "Mar", users: 95, sessions: 22, messages: 5100 },
  { month: "Apr", users: 134, sessions: 35, messages: 7200 },
  { month: "May", users: 189, sessions: 58, messages: 9800 },
  { month: "Jun", users: 247, sessions: 89, messages: 12400 },
];
