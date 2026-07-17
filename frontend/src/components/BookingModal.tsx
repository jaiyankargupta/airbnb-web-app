"use client";

import React, { useState } from "react";
import { X, CreditCard, Calendar, Users, ShieldCheck, CheckCircle } from "lucide-react";

interface Listing {
  id: number;
  title: string;
  price_per_night: number;
  location: string;
  image_url: string;
}

interface BookingModalProps {
  listing: Listing;
  startDate: string;
  endDate: string;
  guestCount: number;
  onClose: () => void;
  onConfirm: () => Promise<boolean>;
}

export default function BookingModal({
  listing,
  startDate,
  endDate,
  guestCount,
  onClose,
  onConfirm
}: BookingModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getNights = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = getNights();
  const basePrice = nights * listing.price_per_night;
  const serviceFee = Math.round(basePrice * 0.14);
  const cleaningFee = Math.round(listing.price_per_night * 0.2);
  const totalPrice = basePrice + serviceFee + cleaningFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(async () => {
      const ok = await onConfirm();
      if (ok) {
        setIsSuccess(true);
      }
      setIsSubmitting(false);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-border animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
          <p className="text-gray-500 text-sm mb-6">
            Your stay at <span className="font-semibold text-gray-800">{listing.title}</span> has been successfully booked.
          </p>

          <div className="bg-gray-light rounded-2xl p-4 mb-6 text-left text-sm flex flex-col gap-2.5">
            <div className="flex justify-between">
              <span className="text-gray-500">Location</span>
              <span className="font-semibold">{listing.location}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Dates</span>
              <span className="font-semibold">{startDate} to {endDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Guests</span>
              <span className="font-semibold">{guestCount} {guestCount > 1 ? "guests" : "guest"}</span>
            </div>
            <div className="flex justify-between border-t border-gray-border pt-2 mt-1 font-bold text-base">
              <span>Total Paid</span>
              <span className="text-primary">${totalPrice}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="airbnb-btn w-full py-3.5 rounded-xl text-sm font-bold shadow-md"
          >
            Go to My Trips
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-gray-border animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-light text-gray-500 hover:text-gray-800 transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-6 text-gray-800">Confirm and pay</h3>

        <div className="flex gap-4 mb-6 pb-6 border-b border-gray-border">
          <div className="w-24 h-18 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={listing.image_url} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{listing.title}</h4>
            <p className="text-xs text-gray-500">{listing.location}</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 mb-6">
          <h5 className="font-bold text-sm text-gray-800">Trip details</h5>
          <div className="flex justify-between items-center bg-gray-light/50 p-3 rounded-2xl border border-gray-border/50 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <Calendar size={16} />
              <span>{startDate} to {endDate}</span>
            </div>
            <span className="font-semibold text-xs text-gray-500">({nights} {nights > 1 ? "nights" : "night"})</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-light/50 p-3 rounded-2xl border border-gray-border/50 text-sm text-gray-700">
            <Users size={16} />
            <span>{guestCount} {guestCount > 1 ? "guests" : "guest"}</span>
          </div>
        </div>

        <div className="border-t border-gray-border pt-4 mb-6">
          <h5 className="font-bold text-sm text-gray-800 mb-3">Price details</h5>
          <div className="flex flex-col gap-2.5 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>${listing.price_per_night} x {nights} nights</span>
              <span>${basePrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Cleaning fee</span>
              <span>${cleaningFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Airbnb service fee</span>
              <span>${serviceFee}</span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t border-gray-border pt-2 mt-1">
              <span>Total (USD)</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <h5 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
            <CreditCard size={16} />
            <span>Pay with (Mocked)</span>
          </h5>

          <div className="flex flex-col gap-2.5">
            <input
              type="text"
              placeholder="Name on Card"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
            />
            <input
              type="text"
              placeholder="Card Number (e.g. 4111 2222 3333 4444)"
              required
              maxLength={19}
              value={cardNumber}
              onChange={(e) => {
                const v = e.target.value.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
                setCardNumber(v);
              }}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                required
                maxLength={5}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 text-center"
              />
              <input
                type="password"
                placeholder="CVV"
                required
                maxLength={3}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 text-center"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
            <ShieldCheck size={14} className="text-emerald-600" />
            <span>Mock payment simulation. No real money will be charged.</span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="airbnb-btn w-full py-3.5 rounded-xl text-sm font-bold shadow-md mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Confirm and Pay (${totalPrice})</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
