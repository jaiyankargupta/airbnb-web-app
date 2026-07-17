"use client";

import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useApp } from "../../context/AppContext";
import ListingCard, { Listing } from "../../components/ListingCard";
import { api } from "../../utils/api";

export default function WishlistPage() {
  const { currentUserId, favorites } = useApp();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const data = await api.wishlist.list(currentUserId);
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [currentUserId, favorites]);

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 flex-1 flex flex-col gap-6">
      <div className="border-b border-gray-border pb-4 flex justify-between items-baseline">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="text-primary fill-primary" />
          <span>Wishlist</span>
        </h1>
        <span className="text-sm font-semibold text-gray-500">{listings.length} saved properties</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-3 w-full">
              <div className="aspect-[20/19] w-full rounded-2xl shimmer" />
              <div className="h-4 w-2/3 rounded shimmer" />
              <div className="h-3 w-1/2 rounded shimmer" />
              <div className="h-4 w-1/3 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-20 max-w-sm mx-auto">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-1">Create your first wishlist</h3>
          <p className="text-gray-500 text-sm mb-6">
            As you search, click the heart icon on your favorite places to save them here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
