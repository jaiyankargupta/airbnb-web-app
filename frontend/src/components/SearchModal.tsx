"use client";

import React, { useState } from "react";
import { X, Search, Plus, Minus, MapPin, Calendar, Users } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function SearchModal() {
  const { searchQuery, setSearchQuery, searchModalOpen, setSearchModalOpen } = useApp();

  const [location, setLocation] = useState(searchQuery.location);
  const [startDate, setStartDate] = useState(searchQuery.startDate);
  const [endDate, setEndDate] = useState(searchQuery.endDate);
  const [guests, setGuests] = useState(searchQuery.guests);

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
  };

  const handleClear = () => {
    setLocation("");
    setStartDate("");
    setEndDate("");
    setGuests(1);
  };

  const popularDestinations = [
    "California", "Tahoe", "Chicago", "Malibu", "Beverly Hills", "Bali"
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 relative border border-gray-border animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setSearchModalOpen(false)}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-light text-gray-500 hover:text-gray-800 transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-6 text-gray-800">Search stays</h3>

        <form onSubmit={handleSearch} className="flex flex-col gap-6">
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
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/50"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {popularDestinations.map((dest) => (
                <button
                  type="button"
                  key={dest}
                  onClick={() => setLocation(dest)}
                  className="px-3 py-1.5 rounded-full border border-gray-border hover:border-foreground text-xs text-gray-600 hover:text-foreground transition bg-white"
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/50"
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
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/50"
              />
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-border pt-6">
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
                <Users size={16} />
                <span>Who's coming?</span>
              </span>
              <span className="text-xs text-gray-500">Number of guests</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGuests((g) => Math.max(1, g - 1))}
                className="w-8 h-8 rounded-full border border-gray-border flex items-center justify-center text-gray-600 hover:border-foreground hover:text-foreground transition focus:outline-none"
              >
                <Minus size={14} />
              </button>
              <span className="font-semibold text-sm w-4 text-center">{guests}</span>
              <button
                type="button"
                onClick={() => setGuests((g) => g + 1)}
                className="w-8 h-8 rounded-full border border-gray-border flex items-center justify-center text-gray-600 hover:border-foreground hover:text-foreground transition focus:outline-none"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-gray-border pt-6 mt-4">
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-semibold text-gray-500 hover:text-foreground hover:underline transition"
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
