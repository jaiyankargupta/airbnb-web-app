"use client";

import React from "react";
import { DollarSign, Home, Calendar, Star } from "lucide-react";

interface HostStatsProps {
  listingsCount: number;
  bookingsCount: number;
  revenue: number;
  averageRating: number;
}

export default function HostStats({
  listingsCount,
  bookingsCount,
  revenue,
  averageRating
}: HostStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="border border-gray-border rounded-2xl p-5 bg-white shadow-sm flex items-center gap-4">
        <div className="p-3.5 bg-rose-50 text-primary rounded-xl">
          <DollarSign size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Revenue</span>
          <span className="text-xl font-bold text-gray-900">${revenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="border border-gray-border rounded-2xl p-5 bg-white shadow-sm flex items-center gap-4">
        <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl">
          <Home size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Active Listings</span>
          <span className="text-xl font-bold text-gray-900">{listingsCount}</span>
        </div>
      </div>

      <div className="border border-gray-border rounded-2xl p-5 bg-white shadow-sm flex items-center gap-4">
        <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-xl">
          <Calendar size={24} />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Total Bookings</span>
          <span className="text-xl font-bold text-gray-900">{bookingsCount}</span>
        </div>
      </div>

      <div className="border border-gray-border rounded-2xl p-5 bg-white shadow-sm flex items-center gap-4">
        <div className="p-3.5 bg-amber-50 text-amber-500 rounded-xl">
          <Star size={24} className="fill-current" />
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Average Rating</span>
          <span className="text-xl font-bold text-gray-900">
            {averageRating > 0 ? averageRating.toFixed(2) : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
