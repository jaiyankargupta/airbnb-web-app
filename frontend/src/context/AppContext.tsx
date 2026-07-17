"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../utils/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  is_superhost: boolean;
  avatar_url: string;
}

export interface SearchQuery {
  location: string;
  startDate: string;
  endDate: string;
  guests: number;
}

export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AppContextType {
  currentUser: User | null;
  toggleRole: () => Promise<void>;
  searchQuery: SearchQuery;
  setSearchQuery: (query: SearchQuery) => void;
  resetSearchQuery: () => void;
  favorites: number[];
  toggleFavorite: (listingId: number) => Promise<void>;
  toasts: Toast[];
  addToast: (message: string, type?: "success" | "error" | "info") => void;
  removeToast: (id: string) => void;
  searchModalOpen: boolean;
  setSearchModalOpen: (open: boolean) => void;
  currentUserId: number;
  setCurrentUserId: (id: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<number>(1);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQueryState] = useState<SearchQuery>({
    location: "",
    startDate: "",
    endDate: "",
    guests: 1,
  });

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchUser = async (userId: number) => {
    try {
      const data = await api.users.getMe(userId);
      setCurrentUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFavorites = async (userId: number) => {
    try {
      const data = await api.wishlist.list(userId);
      setFavorites(data.map((item: any) => item.id));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUser(currentUserId);
    fetchFavorites(currentUserId);
  }, [currentUserId]);

  const toggleRole = async () => {
    if (!currentUser) return;
    const nextRole = currentUser.role === "guest" ? "host" : "guest";
    try {
      const updated = await api.users.updateRole(currentUserId, nextRole);
      setCurrentUser(updated);
      addToast(`Switched to ${nextRole} dashboard`, "info");
    } catch (e) {
      addToast("Failed to switch role", "error");
    }
  };

  const toggleFavorite = async (listingId: number) => {
    const isFav = favorites.includes(listingId);
    try {
      if (isFav) {
        await api.wishlist.remove(listingId, currentUserId);
        setFavorites((prev) => prev.filter((id) => id !== listingId));
        addToast("Removed from wishlist", "info");
      } else {
        await api.wishlist.add(listingId, currentUserId);
        setFavorites((prev) => [...prev, listingId]);
        addToast("Added to wishlist", "success");
      }
    } catch (e) {
      addToast("Failed to update wishlist", "error");
    }
  };

  const setSearchQuery = (query: SearchQuery) => {
    setSearchQueryState(query);
  };

  const resetSearchQuery = () => {
    setSearchQueryState({
      location: "",
      startDate: "",
      endDate: "",
      guests: 1,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        toggleRole,
        searchQuery,
        setSearchQuery,
        resetSearchQuery,
        favorites,
        toggleFavorite,
        toasts,
        addToast,
        removeToast,
        searchModalOpen,
        setSearchModalOpen,
        currentUserId,
        setCurrentUserId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
