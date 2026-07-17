"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Home, Briefcase } from "lucide-react";
import { useApp } from "../../context/AppContext";
import HostStats from "../../components/host/HostStats";
import HostBookings from "../../components/host/HostBookings";
import ListingFormModal from "../../components/host/ListingFormModal";
import { api } from "../../utils/api";

export default function HostDashboardPage() {
  const { currentUserId, addToast } = useApp();
  const [listings, setListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<any | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const listingsData = await api.listings.list({ host_id: currentUserId });
      setListings(listingsData);
      
      const bookingsData = await api.bookings.list(currentUserId);
      setBookings(bookingsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentUserId]);

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (editingListing) {
        await api.listings.update(editingListing.id, formData, currentUserId);
        addToast("Listing updated successfully", "success");
      } else {
        await api.listings.create(formData, currentUserId);
        addToast("Listing created successfully", "success");
      }
      fetchData();
    } catch (e: any) {
      addToast(e.message || "Failed to save listing", "error");
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm("Are you sure you want to delete this listing? All associated bookings will be deleted.")) return;

    try {
      await api.listings.delete(listingId, currentUserId);
      addToast("Listing deleted successfully", "success");
      fetchData();
    } catch (e: any) {
      addToast(e.message || "Deletion failed", "error");
    }
  };

  const handleOpenEdit = (listing: any) => {
    setEditingListing(listing);
    setModalOpen(true);
  };

  const handleOpenCreate = () => {
    setEditingListing(null);
    setModalOpen(true);
  };

  const getStats = () => {
    const revenue = bookings
      .filter((b) => b.status === "confirmed")
      .reduce((sum, b) => sum + b.total_price, 0);

    const averageRating = listings.length > 0
      ? listings.reduce((sum, l) => sum + l.rating, 0) / listings.length
      : 0;

    return {
      listingsCount: listings.length,
      bookingsCount: bookings.filter((b) => b.status === "confirmed").length,
      revenue,
      averageRating
    };
  };

  const stats = getStats();

  return (
    <div className="max-w-7xl mx-auto w-full px-6 md:px-12 py-10 flex-1 flex flex-col gap-8">
      <div className="border-b border-gray-border pb-4 flex justify-between items-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="text-primary" />
          <span>Host Dashboard</span>
        </h1>
        <button
          onClick={handleOpenCreate}
          className="airbnb-btn px-4 py-2.5 rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5"
        >
          <Plus size={16} />
          <span>Create Listing</span>
        </button>
      </div>

      {loading ? (
        <div className="h-96 w-full rounded-2xl shimmer" />
      ) : (
        <>
          <HostStats
            listingsCount={stats.listingsCount}
            bookingsCount={stats.bookingsCount}
            revenue={stats.revenue}
            averageRating={stats.averageRating}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Home size={18} />
                <span>My Listings</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listings.map((listing) => (
                  <div
                    key={listing.id}
                    className="border border-gray-border rounded-2xl overflow-hidden bg-white shadow-sm flex flex-col justify-between group"
                  >
                    <div className="aspect-[1.8/1] overflow-hidden bg-gray-100 relative">
                      <img
                        src={listing.image_url}
                        alt={listing.title}
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                      />
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                      <div>
                        <span className="text-[9px] font-bold uppercase text-primary tracking-wider">
                          {listing.category}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 mt-0.5 truncate">{listing.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">{listing.location}</p>
                        <div className="flex justify-between text-xs font-semibold text-gray-700 mt-2">
                          <span>${listing.price_per_night} / night</span>
                          <span>Rating: {listing.rating.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-gray-border mt-1">
                        <button
                          onClick={() => handleOpenEdit(listing)}
                          className="flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-foreground transition py-1.5 px-3 rounded-lg border border-gray-border hover:bg-gray-light cursor-pointer"
                        >
                          <Edit size={12} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDeleteListing(listing.id)}
                          className="flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-800 transition py-1.5 px-3 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {listings.length === 0 && (
                  <p className="text-gray-500 text-sm italic col-span-2">No listings created yet.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-lg font-bold text-gray-800">Reservation History</h3>
              <HostBookings bookings={bookings} />
            </div>
          </div>
        </>
      )}

      <ListingFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editingListing}
      />
    </div>
  );
}
