"use client";

import { useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Card from "@/components/ui/Card";
import { mockFamilyResources } from "@/lib/mock-data/family-resources";

export default function FamilyPortalPage() {
  const [searchQuery, setSearchQuery] = useState("");
 const { t } = useLanguage();
  const [selectedType, setSelectedType] = useState<"all" | "article" | "guide" | "video">("all");

  const filteredResources = mockFamilyResources.filter((resource) => {
    const matchesSearch =
      searchQuery === "" ||
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = selectedType === "all" || resource.type === selectedType;

    return matchesSearch && matchesType && resource.isPublished;
  });

  const typeIcons: Record<string, string> = {
    article: "📄",
    guide: "📖",
    video: "🎬",
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-earth-50 to-secondary-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-heading text-3xl sm:text-4xl font-bold text-warm-gray-900">
              {t.familyPortal.title}
            </h1>
            <p className="mt-4 text-lg text-warm-gray-600 max-w-2xl mx-auto">
              {t.familyPortal.subtitle}
            </p>

            {/* Search */}
            <div className="mt-8 max-w-lg mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.familyPortal.searchPlaceholder}
                className="w-full px-5 py-3 rounded-xl border border-warm-gray-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-warm-gray-800 placeholder:text-warm-gray-400 shadow-sm"
                aria-label="Search family portal resources"
              />
            </div>
          </div>
        </section>

        {/* Filters + Results */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Type Filters */}
            <div className="flex gap-2 mb-8">
              {(["all", "article", "guide", "video"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    selectedType === type
                      ? "bg-primary-500 text-white"
                      : "bg-warm-gray-100 text-warm-gray-600 hover:bg-warm-gray-200"
                  }`}
                >
                  {type === "all" ? t.familyPortal.all : type === "article" ? t.familyPortal.articles : type === "guide" ? t.familyPortal.guides : t.familyPortal.videos}
                </button>
              ))}
            </div>

            {/* Results */}
            {filteredResources.length === 0 ? (
              <div className="text-center py-12">
                <span className="text-4xl">🔍</span>
                <p className="mt-4 text-warm-gray-600">{t.familyPortal.noResults}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <Card key={resource.id} className="hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{typeIcons[resource.type]}</span>
                      <span className="text-xs font-semibold uppercase text-warm-gray-500 tracking-wider">
                        {resource.type}
                      </span>
                      {resource.language === "fr" && (
                        <span className="ml-auto px-2 py-0.5 text-xs bg-secondary-100 text-secondary-700 rounded-full font-medium">
                          Fran\u00e7ais
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg font-bold text-warm-gray-800 mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-warm-gray-600 leading-relaxed mb-4">
                      {resource.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {resource.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 bg-warm-gray-100 text-warm-gray-500 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
