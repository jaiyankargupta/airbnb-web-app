"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ListingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: any;
}

export default function ListingFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData
}: ListingFormModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pricePerNight, setPricePerNight] = useState(150);
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("Cabins");
  const [imageUrl, setImageUrl] = useState("");
  const [galleryUrls, setGalleryUrls] = useState("");
  const [amenities, setAmenities] = useState("");
  const [bedrooms, setBedrooms] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);
  const [maxGuests, setMaxGuests] = useState(2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setPricePerNight(initialData.price_per_night || 150);
      setLocation(initialData.location || "");
      setCategory(initialData.category || "Cabins");
      setImageUrl(initialData.image_url || "");
      setGalleryUrls(initialData.gallery_urls || "");
      setAmenities(initialData.amenities || "");
      setBedrooms(initialData.bedrooms || 1);
      setBathrooms(initialData.bathrooms || 1);
      setMaxGuests(initialData.max_guests || 2);
    } else {
      setTitle("");
      setDescription("");
      setPricePerNight(150);
      setLocation("");
      setCategory("Cabins");
      setImageUrl("");
      setGalleryUrls("");
      setAmenities("");
      setBedrooms(1);
      setBathrooms(1);
      setMaxGuests(2);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({
        title,
        description,
        price_per_night: Number(pricePerNight),
        location,
        category,
        image_url: imageUrl || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80",
        gallery_urls: galleryUrls,
        amenities: amenities || "Wifi, Kitchen",
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        max_guests: Number(maxGuests)
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = ["Cabins", "Beachfront", "Mansions", "Treehouses", "Lakefront", "Trending"];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative border border-gray-border max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-light text-gray-500 hover:text-gray-800 transition focus:outline-none"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold mb-6 text-gray-800">
          {initialData ? "Edit listing" : "Create a new listing"}
        </h3>

        <form onSubmit={handleSubmitForm} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-500">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-500">Description</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">Price per night ($)</label>
              <input
                type="number"
                required
                min="1"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-500">Location</label>
            <input
              type="text"
              required
              placeholder="e.g. Portland, Oregon"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">Bedrooms</label>
              <input
                type="number"
                required
                min="1"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">Bathrooms</label>
              <input
                type="number"
                required
                min="1"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 text-center"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-gray-500">Max Guests</label>
              <input
                type="number"
                required
                min="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30 text-center"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-500">Primary Image URL</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-500">Gallery Image URLs (comma separated)</label>
            <input
              type="text"
              placeholder="url1, url2, url3"
              value={galleryUrls}
              onChange={(e) => setGalleryUrls(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold uppercase text-gray-500">Amenities (comma separated)</label>
            <input
              type="text"
              placeholder="Wifi, Pool, Gym, Kitchen"
              value={amenities}
              onChange={(e) => setAmenities(e.target.value)}
              className="w-full px-4 py-3 border border-gray-border rounded-xl focus:outline-none focus:border-primary text-sm bg-gray-light/30"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="airbnb-btn w-full py-3.5 rounded-xl text-sm font-bold shadow-md mt-2 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{initialData ? "Save changes" : "Create listing"}</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
