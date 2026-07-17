"use client";

import React from "react";
import { X, Star } from "lucide-react";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  rating: number;
  setRating: (val: number) => void;
  comment: string;
  setComment: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export default function ReviewModal({
  isOpen,
  onClose,
  rating,
  setRating,
  comment,
  setComment,
  onSubmit,
  isSubmitting
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative border border-gray-border animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-light text-gray-500 hover:text-gray-800 transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-bold mb-6 text-gray-800">Write a review</h3>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-gray-500 uppercase">Rating</span>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="text-amber-400 hover:scale-110 active:scale-95 transition focus:outline-none"
                >
                  <Star
                    size={28}
                    className={star <= rating ? "fill-current" : "text-gray-300"}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase">Comments</label>
            <textarea
              required
              rows={4}
              placeholder="Tell us about your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="airbnb-btn w-full py-3 rounded-xl text-sm font-bold shadow-md mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>Submit Review</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
