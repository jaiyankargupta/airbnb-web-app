"use client";

import React from "react";
import { Star } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  author: {
    name: string;
    avatar_url: string;
  };
}

interface ReviewListProps {
  rating: number;
  reviewCount: number;
  reviews: Review[];
}

export default function ReviewList({
  rating,
  reviewCount,
  reviews
}: ReviewListProps) {
  return (
    <div className="border-t border-gray-border pt-8 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Star size={20} className="fill-current text-gray-900" />
        <h3 className="font-semibold text-xl text-gray-900">
          {reviewCount > 0 ? (
            <>{rating.toFixed(2)} &middot; {reviewCount} {reviewCount === 1 ? "review" : "reviews"}</>
          ) : (
            <>No reviews yet</>
          )}
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
        {reviews.map((rev) => (
          <div key={rev.id} className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img src={rev.author.avatar_url} alt={rev.author.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-gray-800">{rev.author.name}</h4>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <div className="flex text-amber-500">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} size={10} className="fill-current" />
                    ))}
                  </div>
                  <span>&middot;</span>
                  <span>{rev.created_at}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <p className="text-gray-500 text-sm italic col-span-2">No reviews yet for this listing.</p>
        )}
      </div>
    </div>
  );
}
