"use client";

import React from "react";
import { Star, ShieldAlert } from "lucide-react";

interface ReservationCardProps {
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  startDate: string;
  endDate: string;
  guests: number;
  setStartDate: (val: string) => void;
  setEndDate: (val: string) => void;
  setGuests: (val: number) => void;
  dateError: string | null;
  handleReserve: () => void;
  nights: number;
  basePrice: number;
  cleaningFee: number;
  serviceFee: number;
  totalPrice: number;
}

export default function ReservationCard({
  pricePerNight,
  rating,
  reviewCount,
  maxGuests,
  startDate,
  endDate,
  guests,
  setStartDate,
  setEndDate,
  setGuests,
  dateError,
  handleReserve,
  nights,
  basePrice,
  cleaningFee,
  serviceFee,
  totalPrice
}: ReservationCardProps) {
  return (
    <div className="border border-gray-border rounded-3xl p-6 shadow-card sticky top-28 bg-white flex flex-col gap-6">
      <div className="flex justify-between items-baseline">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-bold text-gray-900">${pricePerNight}</span>
          <span className="text-gray-500 text-sm">night</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-800 font-medium">
          <Star size={12} className="fill-current text-gray-900" />
          <span>{rating.toFixed(2)}</span>
          <span>&middot;</span>
          <span className="underline">{reviewCount} reviews</span>
        </div>
      </div>

      <div className="border border-gray-border rounded-2xl overflow-hidden text-sm flex flex-col">
        <div className="grid grid-cols-2 border-b border-gray-border">
          <div className="p-3 border-r border-gray-border flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-gray-500">Check-in</span>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="focus:outline-none w-full bg-transparent text-xs"
            />
          </div>
          <div className="p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase text-gray-500">Checkout</span>
            <input
              type="date"
              value={endDate}
              min={startDate || new Date().toISOString().split("T")[0]}
              onChange={(e) => setEndDate(e.target.value)}
              className="focus:outline-none w-full bg-transparent text-xs"
            />
          </div>
        </div>
        <div className="p-3 flex flex-col gap-1 bg-white">
          <span className="text-[10px] font-bold uppercase text-gray-500">Guests</span>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="focus:outline-none w-full bg-transparent text-xs py-1"
          >
            {Array.from({ length: maxGuests }).map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} {i + 1 > 1 ? "guests" : "guest"}
              </option>
            ))}
          </select>
        </div>
      </div>

      {dateError && (
        <div className="flex items-start gap-2 text-rose-600 bg-rose-50 p-3 rounded-2xl text-xs border border-rose-100">
          <ShieldAlert size={16} className="shrink-0 mt-0.5" />
          <span>{dateError}</span>
        </div>
      )}

      <button
        onClick={handleReserve}
        disabled={!!dateError}
        className={`airbnb-btn w-full py-3.5 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-1.5 ${dateError ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        <span>Reserve</span>
      </button>

      {startDate && endDate && !dateError && (
        <div className="flex flex-col gap-3.5 text-sm text-gray-600 border-t border-gray-border pt-4 mt-2">
          <div className="flex justify-between">
            <span className="underline">${pricePerNight} x {nights} nights</span>
            <span>${basePrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Cleaning fee</span>
            <span>${cleaningFee}</span>
          </div>
          <div className="flex justify-between">
            <span className="underline">Airbnb service fee</span>
            <span>${serviceFee}</span>
          </div>
          <div className="flex justify-between font-bold text-gray-900 border-t border-gray-border pt-3 mt-1 text-base">
            <span>Total before taxes</span>
            <span>${totalPrice}</span>
          </div>
        </div>
      )}

      <p className="text-center text-xs text-gray-500">You won't be charged yet</p>
    </div>
  );
}
