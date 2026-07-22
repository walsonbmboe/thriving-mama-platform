export interface FamilyResource {
  id: string;
  title: string;
  type: "article" | "guide" | "video";
  language: "en" | "fr";
  description: string;
  tags: string[];
  isPublished: boolean;
  createdAt: string;
  imageUrl?: string;
}

export const mockFamilyResources: FamilyResource[] = [
  {
    id: "res-001",
    title: "Understanding Postpartum Depression",
    type: "article",
    language: "en",
    description:
      "Learn about the signs, symptoms, and treatment options for postpartum depression. This comprehensive guide helps family members recognize when a new mother might need extra support.",
    tags: ["postpartum", "depression", "mental-health", "support"],
    isPublished: true,
    createdAt: "2026-01-15T10:00:00Z",
  },
  {
    id: "res-002",
    title: "How Partners Can Support New Mothers",
    type: "guide",
    language: "en",
    description:
      "Practical tips and strategies for partners to provide emotional and physical support during the postpartum period. From sharing household duties to active listening techniques.",
    tags: ["partner", "support", "practical-tips", "communication"],
    isPublished: true,
    createdAt: "2026-02-01T08:30:00Z",
  },
  {
    id: "res-003",
    title: "When to Seek Professional Help",
    type: "article",
    language: "en",
    description:
      "A guide for family members on recognizing the signs that a new mother may need professional mental health support, and how to start that conversation with care and sensitivity.",
    tags: ["professional-help", "warning-signs", "intervention", "family"],
    isPublished: true,
    createdAt: "2026-02-20T14:15:00Z",
  },
  {
    id: "res-004",
    title: "Comprendre la D\u00e9pression Post-Partum",
    type: "article",
    language: "fr",
    description:
      "Comprendre les signes et sympt\u00f4mes de la d\u00e9pression post-partum et comment les membres de la famille peuvent offrir un soutien adapt\u00e9.",
    tags: ["postpartum", "d\u00e9pression", "sant\u00e9-mentale", "soutien"],
    isPublished: true,
    createdAt: "2026-03-01T09:00:00Z",
  },
  {
    id: "res-005",
    title: "Self-Care for the Whole Family",
    type: "guide",
    language: "en",
    description:
      "A family-centered approach to self-care during the postpartum period. Includes tips for partners, grandparents, and siblings to take care of their own well-being while supporting the new mother.",
    tags: ["self-care", "family", "well-being", "balance"],
    isPublished: true,
    createdAt: "2026-03-15T11:30:00Z",
  },
  {
    id: "res-006",
    title: "Baby Blues vs. Postpartum Depression",
    type: "video",
    language: "en",
    description:
      "A short educational video explaining the difference between normal 'baby blues' and clinical postpartum depression, helping families understand when feelings go beyond typical adjustment.",
    tags: ["baby-blues", "education", "video", "awareness"],
    isPublished: true,
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "res-007",
    title: "Building a Support Network in Africa",
    type: "guide",
    language: "en",
    description:
      "Culturally-relevant guide for building a support network for new mothers in African communities. Covers extended family dynamics, community resources, and overcoming stigma around mental health.",
    tags: ["africa", "community", "support-network", "culture", "stigma"],
    isPublished: true,
    createdAt: "2026-04-20T13:45:00Z",
  },
  {
    id: "res-008",
    title: "Emergency Resources and Hotlines",
    type: "article",
    language: "en",
    description:
      "Important contact information and resources for families in crisis. Includes national hotlines, local support services, and steps to take in an emergency.",
    tags: ["emergency", "crisis", "hotlines", "resources"],
    isPublished: true,
    createdAt: "2026-05-01T08:00:00Z",
  },
];
