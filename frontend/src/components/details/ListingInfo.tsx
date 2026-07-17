"use client";

import React from "react";
import { Award } from "lucide-react";

interface Host {
  name: string;
  avatar_url: string;
  is_superhost: boolean;
}

interface ListingInfoProps {
  host: Host;
  description: string;
  amenities: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
}

export default function ListingInfo({
  host,
  description,
  amenities,
  maxGuests,
  bedrooms,
  bathrooms
}: ListingInfoProps) {
  return (
    <div className="flex flex-col gap-8">
      <div className="border-b border-gray-border pb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              Entire home hosted by {host.name}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {maxGuests} guests &middot; {bedrooms} {bedrooms > 1 ? "bedrooms" : "bedroom"} &middot; {bathrooms} {bathrooms > 1 ? "bathrooms" : "bathroom"}
            </p>
          </div>
          <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img src={host.avatar_url} alt={host.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {host.is_superhost && (
          <div className="flex items-center gap-3 bg-gray-light p-4 rounded-2xl mt-4">
            <div className="text-primary flex-shrink-0">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-800">{host.name} is a Superhost</h4>
              <p className="text-xs text-gray-500">
                Superhosts are experienced, highly rated hosts who are committed to providing great stays.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="border-b border-gray-border pb-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-3">About this space</h3>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{description}</p>
      </div>

      <div className="border-b border-gray-border pb-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">What this place offers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {amenities.split(",").map((am: string) => (
            <div key={am} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>{am}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
