"use client";

import React from "react";

interface PhotoGalleryProps {
  images: string[];
  title: string;
}

export default function PhotoGallery({ images, title }: PhotoGalleryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden aspect-video md:aspect-[2.2/1] relative">
      <div className="md:col-span-2 h-full">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover hover:opacity-95 transition"
        />
      </div>
      <div className="hidden md:grid grid-cols-2 col-span-2 gap-2 h-full">
        {images.slice(1, 5).map((img, idx) => (
          <div key={idx} className="h-full">
            <img
              src={img || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=400&q=80"}
              alt={title}
              className="w-full h-full object-cover hover:opacity-95 transition"
            />
          </div>
        ))}
        {images.length < 5 &&
          Array.from({ length: 4 - images.slice(1, 5).length }).map((_, idx) => (
            <div
              key={`placeholder-${idx}`}
              className="bg-gray-100 h-full flex items-center justify-center text-gray-400 text-xs"
            >
              <span>More photos coming soon</span>
            </div>
          ))}
      </div>
    </div>
  );
}
