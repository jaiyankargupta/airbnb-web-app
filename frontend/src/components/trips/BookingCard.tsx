"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Users, Trash2, MessageSquarePlus } from "lucide-react";

interface BookingCardProps {
  booking: any;
  onCancel: (id: number) => void;
  onOpenReview: (listingId: number) => void;
}

export default function BookingCard({
  booking,
  onCancel,
  onOpenReview
}: BookingCardProps) {
  return (
    <div
      className={`border border-gray-border rounded-2xl overflow-hidden shadow-sm flex flex-col md:flex-row bg-white hover:shadow-md transition ${booking.status === "cancelled" ? "opacity-75" : ""
        }`}
    >
      <div className="w-full md:w-64 h-48 md:h-auto overflow-hidden bg-gray-100 flex-shrink-0 relative">
        <img
          src={booking.listing?.image_url}
          alt={booking.listing?.title}
          className="w-full h-full object-cover"
        />
        {booking.status === "cancelled" && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="px-3 py-1 rounded bg-rose-600 text-white font-bold text-xs uppercase tracking-wide">
              Cancelled
            </span>
          </div>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                {booking.listing?.category}
              </span>
              <h3 className="font-bold text-lg text-gray-900 mt-0.5 hover:underline truncate max-w-xs md:max-w-md">
                <Link href={`/listings/${booking.listing?.id}`}>{booking.listing?.title}</Link>
              </h3>
              <p className="text-xs text-gray-500">{booking.listing?.location}</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-500">Total Price</span>
              <span className="font-bold text-gray-900">${booking.total_price}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2 text-xs text-gray-600 bg-gray-light/50 p-3 rounded-xl border border-gray-border/50">
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-500" />
              <span className="font-medium">Check-in: {booking.start_date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-500" />
              <span className="font-medium">Checkout: {booking.end_date}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users size={14} className="text-gray-500" />
              <span className="font-medium">{booking.guest_count} guests</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center border-t border-gray-border pt-4 mt-2">
          <div className="flex gap-3">
            {booking.status === "confirmed" && (
              <button
                onClick={() => onOpenReview(booking.listing.id)}
                className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 border border-gray-border rounded-xl text-gray-700 hover:border-foreground hover:text-foreground transition cursor-pointer bg-white"
              >
                <MessageSquarePlus size={14} />
                <span>Leave a review</span>
              </button>
            )}
          </div>

          {booking.status === "confirmed" && (
            <button
              onClick={() => onCancel(booking.id)}
              className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 transition py-2 px-3 hover:bg-rose-50 rounded-xl cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Cancel Stay</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
