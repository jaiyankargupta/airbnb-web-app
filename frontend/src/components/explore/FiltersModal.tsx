"use client";

import React from "react";
import { X } from "lucide-react";

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  priceMax: number;
  onPriceChange: (val: number) => void;
}

export default function FiltersModal({
  isOpen,
  onClose,
  priceMax,
  onPriceChange
}: FiltersModalProps) {
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

        <h3 className="text-lg font-bold mb-6 text-gray-800">Filters</h3>

        <div className="flex flex-col gap-6">
          <div>
            <h5 className="font-semibold text-sm text-gray-800 mb-4">Price range (per night)</h5>
            <div className="flex justify-between text-sm font-semibold text-gray-700 mb-2">
              <span>$50</span>
              <span>Up to ${priceMax}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={priceMax}
              onChange={(e) => onPriceChange(Number(e.target.value))}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>

          <div className="flex justify-between items-center border-t border-gray-border pt-6 mt-2">
            <button
              type="button"
              onClick={() => onPriceChange(1000)}
              className="text-sm font-semibold text-gray-500 hover:text-foreground hover:underline transition"
            >
              Reset Price
            </button>
            <button
              onClick={onClose}
              className="airbnb-btn px-6 py-2.5 rounded-xl text-sm font-bold shadow-md"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
