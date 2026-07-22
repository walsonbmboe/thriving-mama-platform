export interface BookingSlot {
  id: string;
  counselorId: string;
  counselorName: string;
  startTime: string;
  endTime: string;
  status: "available" | "reserved" | "completed" | "cancelled";
  bookedBy?: string;
}

export interface Session {
  id: string;
  motherId: string;
  motherName: string;
  counselorId: string;
  counselorName: string;
  startTime: string;
  status: "confirmed" | "cancelled" | "completed";
}

export const mockSlots: BookingSlot[] = [
  {
    id: "slot-001",
    counselorId: "counselor-001",
    counselorName: "Dr. Ngozi Adeyemi",
    startTime: "2026-06-19T09:00:00Z",
    endTime: "2026-06-19T10:00:00Z",
    status: "available",
  },
  {
    id: "slot-002",
    counselorId: "counselor-001",
    counselorName: "Dr. Ngozi Adeyemi",
    startTime: "2026-06-19T11:00:00Z",
    endTime: "2026-06-19T12:00:00Z",
    status: "available",
  },
  {
    id: "slot-003",
    counselorId: "counselor-002",
    counselorName: "Dr. Kofi Mensah",
    startTime: "2026-06-20T14:00:00Z",
    endTime: "2026-06-20T15:00:00Z",
    status: "available",
  },
  {
    id: "slot-004",
    counselorId: "counselor-002",
    counselorName: "Dr. Kofi Mensah",
    startTime: "2026-06-21T10:00:00Z",
    endTime: "2026-06-21T11:00:00Z",
    status: "available",
  },
  {
    id: "slot-005",
    counselorId: "counselor-001",
    counselorName: "Dr. Ngozi Adeyemi",
    startTime: "2026-06-22T09:00:00Z",
    endTime: "2026-06-22T10:00:00Z",
    status: "available",
  },
  {
    id: "slot-006",
    counselorId: "counselor-001",
    counselorName: "Dr. Ngozi Adeyemi",
    startTime: "2026-06-18T09:00:00Z",
    endTime: "2026-06-18T10:00:00Z",
    status: "reserved",
    bookedBy: "user-001",
  },
];

export const mockSessions: Session[] = [
  {
    id: "session-b-001",
    motherId: "user-001",
    motherName: "Amara Okafor",
    counselorId: "counselor-001",
    counselorName: "Dr. Ngozi Adeyemi",
    startTime: "2026-06-18T09:00:00Z",
    status: "confirmed",
  },
  {
    id: "session-b-002",
    motherId: "user-001",
    motherName: "Amara Okafor",
    counselorId: "counselor-002",
    counselorName: "Dr. Kofi Mensah",
    startTime: "2026-06-10T14:00:00Z",
    status: "completed",
  },
];
