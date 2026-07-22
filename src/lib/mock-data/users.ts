export type UserRole = "mother" | "counselor" | "admin";
export type Language = "en" | "fr" | "pcm";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  languagePreference: Language;
  isActive: boolean;
  createdAt: string;
  phoneNumber?: string;
}

export const mockUsers: User[] = [
  {
    id: "user-001",
    email: "amara@example.com",
    name: "Amara Okafor",
    role: "mother",
    languagePreference: "en",
    isActive: true,
    createdAt: "2026-01-15T10:00:00Z",
    phoneNumber: "+237670000001",
  },
  {
    id: "user-002",
    email: "fatima@example.com",
    name: "Fatima Ndiaye",
    role: "mother",
    languagePreference: "fr",
    isActive: true,
    createdAt: "2026-02-20T08:30:00Z",
    phoneNumber: "+237670000002",
  },
  {
    id: "user-003",
    email: "blessing@example.com",
    name: "Blessing Eze",
    role: "mother",
    languagePreference: "pcm",
    isActive: true,
    createdAt: "2026-03-05T14:15:00Z",
  },
  {
    id: "counselor-001",
    email: "dr.ngozi@example.com",
    name: "Dr. Ngozi Adeyemi",
    role: "counselor",
    languagePreference: "en",
    isActive: true,
    createdAt: "2025-11-01T09:00:00Z",
    phoneNumber: "+237670000010",
  },
  {
    id: "counselor-002",
    email: "dr.kofi@example.com",
    name: "Dr. Kofi Mensah",
    role: "counselor",
    languagePreference: "en",
    isActive: true,
    createdAt: "2025-12-10T11:00:00Z",
    phoneNumber: "+237670000011",
  },
  {
    id: "admin-001",
    email: "sharon@thrivingmama.org",
    name: "Sharon Asukia Mboe",
    role: "admin",
    languagePreference: "en",
    isActive: true,
    createdAt: "2025-10-01T08:00:00Z",
  },
];

export const currentUser: User = mockUsers[0];
