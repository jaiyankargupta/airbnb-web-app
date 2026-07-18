"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
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
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUserId, setCurrentUserId] = useState<number>(1);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const userCache = useRef<Record<number, any>>({});
  const favoritesCache = useRef<Record<number, number[]>>({});
  const [favorites, setFavorites] = useState<number[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQueryState] = useState<SearchQuery>({
    location: "",
    startDate: "",
    endDate: "",
    guests: 1,
  });
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark";
    if (saved) {
      setTheme(saved);
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
      }
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    if (next === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const addToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchUser = async (userId: number) => {
    if (userCache.current[userId]) {
      setCurrentUser(userCache.current[userId]);
    }
    try {
      const data = await api.users.getMe(userId);
      userCache.current[userId] = data;
      setCurrentUser(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchFavorites = async (userId: number) => {
    if (favoritesCache.current[userId]) {
      setFavorites(favoritesCache.current[userId]);
    }
    try {
      const data = await api.wishlist.list(userId);
      const favIds = data.map((item: any) => item.id);
      favoritesCache.current[userId] = favIds;
      setFavorites(favIds);
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
    const previousFavorites = [...favorites];

    if (isFav) {
      setFavorites((prev) => prev.filter((id) => id !== listingId));
      addToast("Removed from wishlist", "info");
    } else {
      setFavorites((prev) => [...prev, listingId]);
      addToast("Added to wishlist", "success");
    }

    try {
      if (isFav) {
        await api.wishlist.remove(listingId, currentUserId);
        favoritesCache.current[currentUserId] = favoritesCache.current[currentUserId]?.filter((id) => id !== listingId) || [];
      } else {
        await api.wishlist.add(listingId, currentUserId);
        favoritesCache.current[currentUserId] = [...(favoritesCache.current[currentUserId] || []), listingId];
      }
    } catch (e) {
      setFavorites(previousFavorites);
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
        theme,
        toggleTheme,
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
