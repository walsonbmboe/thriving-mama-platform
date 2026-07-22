export interface EPDSQuestion {
  id: number;
  question: string;
  options: { value: number; label: string }[];
}

export interface EPDSResult {
  id: string;
  score: number;
  date: string;
  answers: number[];
}

export const epdsQuestions: EPDSQuestion[] = [
  {
    id: 1,
    question: "I have been able to laugh and see the funny side of things",
    options: [
      { value: 0, label: "As much as I always could" },
      { value: 1, label: "Not quite so much now" },
      { value: 2, label: "Definitely not so much now" },
      { value: 3, label: "Not at all" },
    ],
  },
  {
    id: 2,
    question: "I have looked forward with enjoyment to things",
    options: [
      { value: 0, label: "As much as I ever did" },
      { value: 1, label: "Rather less than I used to" },
      { value: 2, label: "Definitely less than I used to" },
      { value: 3, label: "Hardly at all" },
    ],
  },
  {
    id: 3,
    question: "I have blamed myself unnecessarily when things went wrong",
    options: [
      { value: 3, label: "Yes, most of the time" },
      { value: 2, label: "Yes, some of the time" },
      { value: 1, label: "Not very often" },
      { value: 0, label: "No, never" },
    ],
  },
  {
    id: 4,
    question: "I have been anxious or worried for no good reason",
    options: [
      { value: 0, label: "No, not at all" },
      { value: 1, label: "Hardly ever" },
      { value: 2, label: "Yes, sometimes" },
      { value: 3, label: "Yes, very often" },
    ],
  },
  {
    id: 5,
    question: "I have felt scared or panicky for no very good reason",
    options: [
      { value: 3, label: "Yes, quite a lot" },
      { value: 2, label: "Yes, sometimes" },
      { value: 1, label: "No, not much" },
      { value: 0, label: "No, not at all" },
    ],
  },
  {
    id: 6,
    question: "Things have been getting on top of me",
    options: [
      { value: 3, label: "Yes, most of the time I haven't been able to cope at all" },
      { value: 2, label: "Yes, sometimes I haven't been coping as well as usual" },
      { value: 1, label: "No, most of the time I have coped quite well" },
      { value: 0, label: "No, I have been coping as well as ever" },
    ],
  },
  {
    id: 7,
    question: "I have been so unhappy that I have had difficulty sleeping",
    options: [
      { value: 3, label: "Yes, most of the time" },
      { value: 2, label: "Yes, sometimes" },
      { value: 1, label: "Not very often" },
      { value: 0, label: "No, not at all" },
    ],
  },
  {
    id: 8,
    question: "I have felt sad or miserable",
    options: [
      { value: 3, label: "Yes, most of the time" },
      { value: 2, label: "Yes, quite often" },
      { value: 1, label: "Not very often" },
      { value: 0, label: "No, not at all" },
    ],
  },
  {
    id: 9,
    question: "I have been so unhappy that I have been crying",
    options: [
      { value: 3, label: "Yes, most of the time" },
      { value: 2, label: "Yes, quite often" },
      { value: 1, label: "Only occasionally" },
      { value: 0, label: "No, never" },
    ],
  },
  {
    id: 10,
    question: "The thought of harming myself has occurred to me",
    options: [
      { value: 3, label: "Yes, quite often" },
      { value: 2, label: "Sometimes" },
      { value: 1, label: "Hardly ever" },
      { value: 0, label: "Never" },
    ],
  },
];

export const mockEPDSHistory: EPDSResult[] = [
  { id: "epds-001", score: 8, date: "2026-06-10", answers: [1, 1, 1, 1, 0, 1, 1, 1, 1, 0] },
  { id: "epds-002", score: 12, date: "2026-05-27", answers: [2, 1, 2, 1, 1, 2, 1, 1, 1, 0] },
  { id: "epds-003", score: 14, date: "2026-05-13", answers: [2, 2, 2, 2, 1, 2, 1, 1, 1, 0] },
  { id: "epds-004", score: 11, date: "2026-04-29", answers: [1, 2, 1, 2, 1, 1, 1, 1, 1, 0] },
];
