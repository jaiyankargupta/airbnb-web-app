"use client";

import React from "react";
import { Calendar, Users, DollarSign } from "lucide-react";

interface HostBookingsProps {
  bookings: any[];
}

export default function HostBookings({ bookings }: HostBookingsProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 border border-dashed border-gray-border rounded-2xl bg-gray-light/30">
        <p className="text-gray-500 text-sm">No reservations received yet.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <div
          key={booking.id}
          className={`border border-gray-border rounded-xl p-4 bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
            booking.status === "cancelled" ? "opacity-60 bg-gray-50" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img
                src={booking.listing?.image_url}
                alt={booking.listing?.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{booking.listing?.title}</h4>
              <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                <Calendar size={12} />
                <span>
                  {booking.start_date} to {booking.end_date}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-center text-xs text-gray-600 sm:justify-end w-full sm:w-auto">
            <div className="flex items-center gap-1">
              <Users size={14} className="text-gray-400" />
              <span>{booking.guest_count} guests</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign size={14} className="text-gray-400" />
              <span className="font-bold text-gray-800">${booking.total_price}</span>
            </div>
            <div>
              <span
                className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px] ${
                  booking.status === "confirmed"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {booking.status}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
