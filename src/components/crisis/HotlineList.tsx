"use client";

import { useEffect, useState } from "react";
import type { Hotline, HotlineType } from "@/types/hotlines";

interface HotlineListProps {
  countryCode?: string;
  introMessage?: string;
}

interface HotlinesResponse {
  countryCode: string;
  countryName: string;
  hotlines: Hotline[];
}

// Ordering weight: emergency first, counselor always last.
const TYPE_ORDER: Record<HotlineType, number> = {
  emergency: 0,
  maternal: 1,
  psychiatric: 2,
  counselor: 3,
};

const TYPE_LABELS: Record<HotlineType, string> = {
  emergency: "Emergency",
  maternal: "Maternal Health",
  psychiatric: "Psychiatric",
  counselor: "ThrivingMama Counselor",
};

function badgeClasses(type: HotlineType): string {
  switch (type) {
    case "emergency":
      // terracotta
      return "bg-[#fde8e6] text-[#db5a47]";
    case "maternal":
      return "bg-primary-100 text-primary-700";
    case "psychiatric":
      return "bg-accent-100 text-accent-700";
    case "counselor":
      return "bg-white/20 text-white";
    default:
      return "bg-warm-gray-100 text-warm-gray-700";
  }
}

function isRenderable(h: Hotline): boolean {
  return Boolean(h.number || h.website || h.bookingUrl);
}

function sortHotlines(hotlines: Hotline[]): Hotline[] {
  return [...hotlines].sort(
    (a, b) => TYPE_ORDER[a.type] - TYPE_ORDER[b.type]
  );
}

function whatsappHref(rawNumber: string): string {
  const cleaned = rawNumber.replace(/[\s+]/g, "");
  return `https://wa.me/${cleaned}`;
}

function LoadingSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="animate-pulse rounded-2xl border border-warm-gray-200 bg-warm-gray-100 p-5"
        >
          <div className="mb-3 h-4 w-2/3 rounded bg-warm-gray-200" />
          <div className="mb-2 h-6 w-1/2 rounded bg-warm-gray-200" />
          <div className="h-3 w-1/3 rounded bg-warm-gray-200" />
        </div>
      ))}
    </div>
  );
}

function HotlineCard({ hotline }: { hotline: Hotline }) {
  const isCounselor = hotline.type === "counselor";
  const isEmergency = hotline.type === "emergency";

  const containerClasses = isCounselor
    ? "sm:col-span-2 rounded-2xl border border-transparent bg-gradient-to-r from-primary-500 to-secondary-500 p-6 text-white shadow-md"
    : isEmergency
    ? "rounded-2xl border-2 border-[#f5b8b0] bg-red-50 p-5 shadow-sm"
    : "rounded-2xl border border-primary-100 bg-warm-white p-5 shadow-sm";

  const nameClasses = isCounselor
    ? "font-semibold text-white"
    : "font-semibold text-warm-gray-900";

  const numberClasses = isCounselor
    ? "text-lg font-bold text-white"
    : isEmergency
    ? "text-lg font-bold text-[#db5a47]"
    : "text-lg font-bold text-primary-600";

  const availableClasses = isCounselor
    ? "text-sm text-white/80"
    : "text-sm text-warm-gray-500";

  return (
    <div className={containerClasses}>
      <div className="flex items-start justify-between gap-3">
        <p className={nameClasses}>{hotline.name}</p>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeClasses(
            hotline.type
          )}`}
        >
          {TYPE_LABELS[hotline.type]}
        </span>
      </div>

      {hotline.number && (
        <a
          href={`tel:${hotline.number}`}
          className={`mt-2 inline-block ${numberClasses}`}
        >
          {hotline.number}
        </a>
      )}

      <div className="mt-2 flex flex-wrap items-center gap-3">
        {hotline.whatsapp && hotline.number && (
          <a
            href={whatsappHref(hotline.number)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-accent-600 hover:text-accent-700"
          >
            WhatsApp
          </a>
        )}

        {hotline.website && (
          <a
            href={hotline.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium ${
              isCounselor
                ? "text-white underline"
                : "text-primary-600 hover:text-primary-700"
            }`}
          >
            Visit website
          </a>
        )}
      </div>

      {hotline.bookingUrl && (
        <a
          href={hotline.bookingUrl}
          className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-600 shadow-sm transition-colors hover:bg-warm-gray-50"
        >
          Book a Counselor
        </a>
      )}

      <p className={`mt-3 ${availableClasses}`}>{hotline.available}</p>
    </div>
  );
}

export default function HotlineList({
  countryCode,
  introMessage,
}: HotlineListProps) {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const code = countryCode || "XX";

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/.netlify/functions/hotlines?countryCode=${encodeURIComponent(code)}`
        );
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }
        const data: HotlinesResponse = await res.json();
        if (!cancelled) {
          setHotlines(data.hotlines || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            "We couldn't load the support lines right now. Please try again."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  const visible = sortHotlines(hotlines).filter(isRenderable);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h2 className="font-heading text-2xl font-bold text-warm-gray-900">
        You don&apos;t have to face this alone
      </h2>

      {introMessage && (
        <p className="mt-2 text-warm-gray-600 leading-relaxed">
          {introMessage}
        </p>
      )}

      <div className="mt-6">
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <p className="rounded-2xl border border-[#f5b8b0] bg-red-50 p-5 text-[#db5a47]">
            {error}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {visible.map((hotline, index) => (
              <HotlineCard key={`${hotline.name}-${index}`} hotline={hotline} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
