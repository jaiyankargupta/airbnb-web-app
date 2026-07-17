"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Plane } from "lucide-react";
import { useApp } from "../../context/AppContext";
import BookingCard from "../../components/trips/BookingCard";
import ReviewModal from "../../components/trips/ReviewModal";
import { api } from "../../utils/api";

export default function TripsPage() {
  const { currentUserId, addToast } = useApp();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.bookings.list(currentUserId);
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentUserId]);

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await api.bookings.cancel(bookingId, currentUserId);
      addToast("Booking cancelled successfully", "success");
      fetchBookings();
    } catch (e: any) {
      addToast(e.message || "Cancellation failed", "error");
    }
  };

  const handleOpenReview = (listingId: number) => {
    setSelectedListingId(listingId);
    setRating(5);
    setComment("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListingId) return;
    setIsSubmitting(true);

    try {
      await api.reviews.create(
        {
          listing_id: selectedListingId,
          rating,
          comment
        },
        currentUserId
      );
      addToast("Review submitted successfully", "success");
      setShowReviewModal(false);
    } catch (e) {
      addToast("Failed to submit review", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 flex-1 flex flex-col gap-6">
      <div className="border-b border-gray-border pb-4 flex justify-between items-baseline">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Plane className="text-primary" />
          <span>My Trips</span>
        </h1>
        <span className="text-sm font-semibold text-gray-500">{bookings.length} reservations</span>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-44 w-full rounded-2xl bg-gray-200 shimmer" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto">
          <Plane size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-1">No trips booked... yet!</h3>
          <p className="text-gray-500 text-sm mb-6">
            Time to dust off your bags and start planning your next adventure.
          </p>
          <Link href="/" className="airbnb-btn px-6 py-3 rounded-xl text-sm inline-block shadow-md">
            Start searching
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onCancel={handleCancelBooking}
              onOpenReview={handleOpenReview}
            />
          ))}
        </div>
      )}

      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => setShowReviewModal(false)}
        rating={rating}
        setRating={setRating}
        comment={comment}
        setComment={setComment}
        onSubmit={handleSubmitReview}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
