"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export interface Listing {
  id: number;
  title: string;
  description: string;
  price_per_night: number;
  location: string;
  category: string;
  image_url: string;
  gallery_urls?: string;
  amenities: string;
  bedrooms: number;
  bathrooms: number;
  max_guests: number;
  rating: number;
  review_count: number;
}

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { favorites, toggleFavorite } = useApp();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = listing.gallery_urls
    ? [listing.image_url, ...listing.gallery_urls.split(",")]
    : [listing.image_url];

  const isFavorited = favorites.includes(listing.id);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(listing.id);
  };

  return (
    <Link href={`/listings/${listing.id}`} className="group flex flex-col gap-2 cursor-pointer">
      <div className="listing-card-img-container shadow-sm group-hover:shadow-md transition">
        <img
          src={images[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
        />

        {listing.rating >= 4.9 && (
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-zinc-800/95 text-gray-900 dark:text-white px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md z-10 border border-gray-border/50">
            Guest favourite
          </div>
        )}

        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-transparent hover:scale-110 active:scale-95 transition focus:outline-none z-10"
        >
          <Heart
            size={24}
            className={`transition duration-150 ${
              isFavorited ? "fill-primary stroke-primary" : "fill-black/30 stroke-white"
            }`}
          />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 active:scale-90 transition focus:outline-none z-10"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-800 opacity-0 group-hover:opacity-100 active:scale-90 transition focus:outline-none z-10"
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentImageIndex ? "bg-white scale-125" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-between items-start pt-1">
        <h4 className="font-semibold text-sm text-gray-900 truncate max-w-[80%]">
          {listing.location}
        </h4>
        {listing.review_count > 0 ? (
          <div className="flex items-center gap-1 text-sm text-gray-800">
            <Star size={14} className="fill-current text-gray-900" />
            <span>{listing.rating.toFixed(2)}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-sm text-gray-800 font-semibold">
            <Star size={14} className="fill-current text-gray-900" />
            <span>New</span>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 line-clamp-1">
        {listing.category} &middot; {listing.bedrooms} {listing.bedrooms > 1 ? "bedrooms" : "bedroom"}
      </p>

      <div className="flex items-baseline gap-1 text-sm text-gray-900">
        <span className="font-bold">${listing.price_per_night}</span>
        <span className="text-gray-500 text-xs">night</span>
      </div>
    </Link>
  );
}
