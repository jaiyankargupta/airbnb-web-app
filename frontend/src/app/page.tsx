"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ListingCard, { Listing } from "../components/ListingCard";
import CategoryList from "../components/explore/CategoryList";
import FiltersModal from "../components/explore/FiltersModal";
import { SlidersHorizontal } from "lucide-react";
import { api } from "../utils/api";

export default function ExplorePage() {
  const { searchQuery, resetSearchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(1000);

  const fetchListings = async () => {
    setLoading(true);
    try {
      const data = await api.listings.list({
        category: selectedCategory,
        location: searchQuery.location,
        guests: searchQuery.guests,
        start_date: searchQuery.startDate,
        end_date: searchQuery.endDate
      });
      const filtered = data.filter((item: Listing) => item.price_per_night <= priceMax);
      setListings(filtered);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, searchQuery, priceMax]);

  const handleReset = () => {
    setSelectedCategory("");
    resetSearchQuery();
    setPriceMax(1000);
  };

  const isFiltered = selectedCategory !== "" || searchQuery.location !== "" || searchQuery.startDate !== "" || searchQuery.endDate !== "" || priceMax < 1000;

  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b border-gray-border py-3 px-6 md:px-12 flex justify-between items-center sticky top-[73px] z-30 shadow-sm gap-4 overflow-x-auto">
        <CategoryList
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setShowFiltersModal(true)}
            className="flex items-center gap-2 border border-gray-border rounded-xl px-4 py-3 text-xs font-semibold hover:border-foreground transition cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>Filters</span>
          </button>
          {isFiltered && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-8 flex-1">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col gap-3 w-full">
                <div className="aspect-[20/19] w-full rounded-2xl shimmer" />
                <div className="h-4 w-2/3 rounded shimmer" />
                <div className="h-3 w-1/2 rounded shimmer" />
                <div className="h-4 w-1/3 rounded shimmer" />
              </div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
            <p className="text-gray-500 text-sm mb-6">
              Try adjusting your search criteria, price range, or category filters.
            </p>
            <button
              onClick={handleReset}
              className="airbnb-btn px-5 py-2.5 rounded-xl text-sm"
            >
              Remove all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </div>

      <FiltersModal
        isOpen={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        priceMax={priceMax}
        onPriceChange={setPriceMax}
      />
    </div>
  );
}
