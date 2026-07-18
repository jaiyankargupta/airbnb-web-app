"use client";

import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, Heart, MapPin } from "lucide-react";
import { useApp } from "../../../context/AppContext";
import BookingModal from "../../../components/BookingModal";
import PhotoGallery from "../../../components/details/PhotoGallery";
import ListingInfo from "../../../components/details/ListingInfo";
import ReservationCard from "../../../components/details/ReservationCard";
import ReviewList from "../../../components/details/ReviewList";
import { api } from "../../../utils/api";

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = Number(resolvedParams.id);
  const router = useRouter();
  const { currentUserId, favorites, toggleFavorite, addToast } = useApp();

  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(1);
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchListing = async () => {
    try {
      const data = await api.listings.get(id);
      setListing(data);
    } catch (e) {
      console.error(e);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 flex-1 w-full">
        <div className="h-8 w-1/3 rounded shimmer mb-4" />
        <div className="h-4 w-1/4 rounded shimmer mb-8" />
        <div className="aspect-[2/1] w-full rounded-2xl shimmer mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          <div className="md:col-span-2 flex flex-col gap-6 w-full">
            <div className="h-6 w-1/2 rounded shimmer" />
            <div className="h-24 w-full rounded shimmer" />
          </div>
          <div className="h-64 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const isFavorited = favorites.includes(listing.id);
  const images = listing.gallery_urls
    ? [listing.image_url, ...listing.gallery_urls.split(",")]
    : [listing.image_url];

  const getOverlapError = () => {
    if (!startDate || !endDate) return null;

    if (startDate >= endDate) {
      return "Checkout date must be after check-in date";
    }

    for (const rangeStr of listing.booked_dates) {
      const [bStart, bEnd] = rangeStr.split(":");
      if (startDate < bEnd && endDate > bStart) {
        return "These dates overlap with an existing booking";
      }
    }
    return null;
  };

  const dateError = getOverlapError();

  const handleReserve = () => {
    if (!startDate || !endDate) {
      addToast("Please select dates before reserving", "error");
      return;
    }
    if (dateError) {
      addToast(dateError, "error");
      return;
    }
    setShowCheckout(true);
  };

  const confirmBooking = async () => {
    try {
      await api.bookings.create(
        {
          listing_id: listing.id,
          start_date: startDate,
          end_date: endDate,
          guest_count: guests
        },
        currentUserId
      );
      addToast("Reservation completed successfully", "success");
      return true;
    } catch (e: any) {
      addToast(e.message || "Booking failed", "error");
      return false;
    }
  };

  const handleCheckoutClose = () => {
    setShowCheckout(false);
    router.push("/trips");
  };

  const getNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
  };

  const nights = getNights();
  const basePrice = nights * listing.price_per_night;
  const serviceFee = Math.round(basePrice * 0.14);
  const cleaningFee = Math.round(listing.price_per_night * 0.2);
  const totalPrice = basePrice + serviceFee + cleaningFee;

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-8 flex-1 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">{listing.title}</h1>
        <div className="flex flex-wrap justify-between items-center gap-4 text-sm text-gray-700">
          <div className="flex items-center gap-1.5 font-medium">
            <Star size={16} className="fill-current text-gray-900" />
            {listing.review_count > 0 ? (
              <>
                <span>{listing.rating.toFixed(2)}</span>
                <span>&middot;</span>
                <span className="underline cursor-pointer">{listing.review_count} {listing.review_count === 1 ? "review" : "reviews"}</span>
              </>
            ) : (
              <span>New</span>
            )}
            <span>&middot;</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{listing.location}</span>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => toggleFavorite(listing.id)}
              className="flex items-center gap-2 underline font-semibold hover:text-black transition cursor-pointer"
            >
              <Heart size={16} className={isFavorited ? "fill-primary text-primary" : ""} />
              <span>{isFavorited ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>
      </div>

      <PhotoGallery images={images} title={listing.title} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-6">
        <div className="lg:col-span-2">
          <ListingInfo
            host={listing.host}
            description={listing.description}
            amenities={listing.amenities}
            maxGuests={listing.max_guests}
            bedrooms={listing.bedrooms}
            bathrooms={listing.bathrooms}
          />
        </div>

        <div className="relative">
          <ReservationCard
            pricePerNight={listing.price_per_night}
            rating={listing.rating}
            reviewCount={listing.review_count}
            maxGuests={listing.max_guests}
            startDate={startDate}
            endDate={endDate}
            guests={guests}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            setGuests={setGuests}
            dateError={dateError}
            handleReserve={handleReserve}
            nights={nights}
            basePrice={basePrice}
            cleaningFee={cleaningFee}
            serviceFee={serviceFee}
            totalPrice={totalPrice}
            isHost={listing.host_id === currentUserId}
          />
        </div>
      </div>

      <ReviewList
        rating={listing.rating}
        reviewCount={listing.review_count}
        reviews={listing.reviews}
      />

      <div className="border-t border-gray-border py-8 mt-8">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Where you'll be</h3>
        <p className="text-gray-500 text-sm mb-4">{listing.location}</p>
        <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-gray-border shadow-sm">
          <iframe
            width="100%"
            height="100%"
            title="Location Map"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(listing.location)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
            frameBorder="0"
            scrolling="no"
            marginHeight={0}
            marginWidth={0}
            className="filter dark:invert dark:hue-rotate-180"
          />
        </div>
      </div>

      {showCheckout && (
        <BookingModal
          listing={listing}
          startDate={startDate}
          endDate={endDate}
          guestCount={guests}
          onClose={handleCheckoutClose}
          onConfirm={confirmBooking}
        />
      )}
    </div>
  );
}
