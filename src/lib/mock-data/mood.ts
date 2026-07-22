export interface MoodEntry {
  date: string;
  rating: number;
  note?: string;
}

export const mockMoodHistory: MoodEntry[] = [
  { date: "2026-06-17", rating: 3, note: "Okay day, baby slept a bit longer" },
  { date: "2026-06-16", rating: 2, note: "Very tired, didn't sleep well" },
  { date: "2026-06-15", rating: 2 },
  { date: "2026-06-14", rating: 3, note: "Went for a walk with the baby" },
  { date: "2026-06-13", rating: 4, note: "Good chat with my sister" },
  { date: "2026-06-12", rating: 3 },
  { date: "2026-06-11", rating: 2, note: "Feeling isolated" },
  { date: "2026-06-10", rating: 3 },
  { date: "2026-06-09", rating: 4, note: "Baby smiled for the first time!" },
  { date: "2026-06-08", rating: 3 },
  { date: "2026-06-07", rating: 2 },
  { date: "2026-06-06", rating: 3, note: "Partner helped with feeds" },
  { date: "2026-06-05", rating: 4 },
  { date: "2026-06-04", rating: 3 },
  { date: "2026-06-03", rating: 2, note: "Overwhelming day" },
  { date: "2026-06-02", rating: 3 },
  { date: "2026-06-01", rating: 3, note: "Managed to cook a meal" },
  { date: "2026-05-31", rating: 4 },
  { date: "2026-05-30", rating: 3 },
  { date: "2026-05-29", rating: 2 },
  { date: "2026-05-28", rating: 3 },
  { date: "2026-05-27", rating: 3, note: "Visited the clinic" },
  { date: "2026-05-26", rating: 4 },
  { date: "2026-05-25", rating: 3 },
  { date: "2026-05-24", rating: 2, note: "Crying a lot today" },
  { date: "2026-05-23", rating: 3 },
  { date: "2026-05-22", rating: 3 },
  { date: "2026-05-21", rating: 4, note: "Joined a mothers group" },
  { date: "2026-05-20", rating: 3 },
  { date: "2026-05-19", rating: 3 },
];

export const moodLabels: Record<number, { label: string; emoji: string; color: string }> = {
  1: { label: "Very Low", emoji: "😢", color: "bg-red-100 text-red-700 border-red-200" },
  2: { label: "Low", emoji: "😔", color: "bg-orange-100 text-orange-700 border-orange-200" },
  3: { label: "Okay", emoji: "😐", color: "bg-sunshine-100 text-sunshine-700 border-sunshine-200" },
  4: { label: "Good", emoji: "😊", color: "bg-accent-100 text-accent-700 border-accent-200" },
  5: { label: "Very Well", emoji: "🌟", color: "bg-green-100 text-green-700 border-green-200" },
};
