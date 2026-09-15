export type HotlineType = "emergency" | "maternal" | "psychiatric" | "counselor";

export interface Hotline {
  name: string;
  number: string | null;
  available: string;
  type: HotlineType;
  language: string[];
  whatsapp: boolean;
  bookingUrl?: string;
  website?: string;
}

export interface CountryHotlines {
  countryCode: string;
  countryName: string;
  hotlines: Hotline[];
}

export const HOTLINE_TYPE_LABELS: Record<HotlineType, string> = {
  emergency: "Emergency",
  maternal: "Maternal Health",
  psychiatric: "Psychiatric",
  counselor: "ThrivingMama Counselor",
};

export const SUPPORTED_COUNTRIES: { code: string; name: string }[] = [
  { code: "CM", name: "Cameroon" },
  { code: "NG", name: "Nigeria" },
  { code: "GH", name: "Ghana" },
  { code: "ZA", name: "South Africa" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "XX", name: "Other" },
];
