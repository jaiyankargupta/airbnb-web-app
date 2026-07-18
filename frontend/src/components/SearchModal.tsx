"use client";

import React, { useState } from "react";
import { X, Search, Plus, Minus, MapPin, Calendar, Users, Compass, Globe } from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../utils/api";
import { useRouter, usePathname } from "next/navigation";

export default function SearchModal() {
  const { searchQuery, setSearchQuery, searchModalOpen, setSearchModalOpen } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const [activeTab, setActiveTab] = useState<"where" | "when" | "who">("where");
  const [location, setLocation] = useState(searchQuery.location);
  const [startDate, setStartDate] = useState(searchQuery.startDate);
  const [endDate, setEndDate] = useState(searchQuery.endDate);
  const [guests, setGuests] = useState(searchQuery.guests);
  const [suggestedLocations, setSuggestedLocations] = useState<string[]>([]);

  React.useEffect(() => {
    const loadLocations = async () => {
      try {
        const listings = await api.listings.list({});
        if (Array.isArray(listings)) {
          const unique = Array.from(
            new Set(listings.map((l: any) => l.location).filter(Boolean))
          ) as string[];
          setSuggestedLocations(unique);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (searchModalOpen) {
      loadLocations();
    }
  }, [searchModalOpen]);

  if (!searchModalOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery({
      location,
      startDate,
      endDate,
      guests
    });
    setSearchModalOpen(false);
    if (pathname !== "/") {
      router.push("/");
    }
  };

  const handleClear = () => {
    setLocation("");
    setStartDate("");
    setEndDate("");
    setGuests(1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative border border-gray-border dark:border-zinc-800 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setSearchModalOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-light dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-6 text-gray-800 dark:text-white">Search stays</h3>

        <div className="flex border border-gray-border dark:border-zinc-800 rounded-full p-1.5 bg-gray-50 dark:bg-zinc-800/50 mb-6 max-w-md mx-auto items-center">
          <button
            type="button"
            onClick={() => setActiveTab("where")}
            className={`flex-1 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${activeTab === "where"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-zinc-300"
              }`}
          >
            Where
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("when")}
            className={`flex-1 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${activeTab === "when"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-zinc-300"
              }`}
          >
            When
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("who")}
            className={`flex-1 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${activeTab === "who"
                ? "bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white"
                : "text-gray-500 hover:text-gray-800 dark:hover:text-zinc-300"
              }`}
          >
            Who
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex flex-col gap-6">
          {activeTab === "where" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                  <MapPin size={14} />
                  <span>Where</span>
                </label>
                <input
                  type="text"
                  placeholder="Search destinations"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-border dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="text-xs font-bold uppercase text-gray-500 mt-2">Suggested destinations</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => {
                    setLocation("");
                    setActiveTab("when");
                  }}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-gray-border/50 dark:border-zinc-850 hover:bg-gray-light dark:hover:bg-zinc-800 text-left transition"
                >
                  <div className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-650 dark:text-zinc-350">
                    <Compass size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white">All Destinations</div>
                    <div className="text-xs text-gray-500 dark:text-zinc-400">Explore stays anywhere</div>
                  </div>
                </button>

                {suggestedLocations.map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => {
                      setLocation(loc);
                      setActiveTab("when");
                    }}
                    className="flex items-center gap-3 p-3 rounded-2xl border border-gray-border/50 dark:border-zinc-850 hover:bg-gray-light dark:hover:bg-zinc-800 text-left transition"
                  >
                    <div className="p-2 rounded-xl bg-gray-100 dark:bg-zinc-800 text-gray-650 dark:text-zinc-350">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-800 dark:text-white">{loc}</div>
                      <div className="text-xs text-gray-550 dark:text-zinc-400">Search stays in this location</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

              {activeTab === "when" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Check in</span>
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-border dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold uppercase text-gray-500 flex items-center gap-1.5">
                        <Calendar size={14} />
                        <span>Check out</span>
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        min={startDate || new Date().toISOString().split("T")[0]}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-border dark:border-zinc-800 rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center mt-6">
                    {["Exact dates", "± 1 day", "± 2 days", "± 3 days", "± 7 days", "± 14 days"].map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setActiveTab("who")}
                        className="px-4 py-2 rounded-full border border-gray-border dark:border-zinc-800 hover:border-foreground text-xs font-semibold text-gray-700 dark:text-zinc-300 hover:text-foreground dark:hover:text-white transition"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}


              {activeTab === "who" && (
                <div className="flex flex-col divide-y divide-gray-border dark:divide-zinc-800">
                  {[
                    { label: "Adults", desc: "Ages 13 or above", value: guests, set: setGuests, min: 1 },
                    { label: "Children", desc: "Ages 2–12", value: 0, set: () => { }, min: 0 },
                    { label: "Infants", desc: "Under 2", value: 0, set: () => { }, min: 0 },
                    { label: "Pets", desc: "Bringing a service animal?", value: 0, set: () => { }, min: 0 }
                  ].map((category) => (
                    <div key={category.label} className="flex justify-between items-center py-4 first:pt-0 last:pb-0">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-gray-800 dark:text-white">{category.label}</span>
                        <span className="text-xs text-gray-500 dark:text-zinc-400">{category.desc}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          disabled={category.value <= category.min}
                          onClick={() => category.set(Math.max(category.min, category.value - 1))}
                          className="w-8 h-8 rounded-full border border-gray-border dark:border-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:border-foreground hover:text-foreground dark:hover:text-white transition focus:outline-none disabled:opacity-30"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-semibold text-sm w-4 text-center text-gray-800 dark:text-white">{category.value}</span>
                        <button
                          type="button"
                          onClick={() => category.set(category.value + 1)}
                          className="w-8 h-8 rounded-full border border-gray-border dark:border-zinc-800 flex items-center justify-center text-gray-600 dark:text-zinc-400 hover:border-foreground hover:text-foreground dark:hover:text-white transition focus:outline-none"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-between items-center border-t border-gray-border dark:border-zinc-800 pt-6 mt-4">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm font-semibold text-gray-500 hover:text-foreground dark:hover:text-white hover:underline transition"
                >
                  Clear all
                </button>
                <button
                  type="submit"
                  className="airbnb-btn px-6 py-3 rounded-xl flex items-center gap-2 text-sm shadow-md"
                >
                  <Search size={16} />
                  <span>Search</span>
                </button>
              </div>
            </form>
      </div>
    </div>
  );
}
