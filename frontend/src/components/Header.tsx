"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Globe, Menu, User, Heart, Briefcase, Plane, Sun, Moon } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Header() {
  const pathname = usePathname();
  const {
    currentUser,
    toggleRole,
    searchQuery,
    resetSearchQuery,
    setSearchModalOpen,
    currentUserId,
    setCurrentUserId,
    addToast,
    theme,
    toggleTheme
  } = useApp();

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const handleUserChange = (id: number) => {
    setCurrentUserId(id);
    setMenuOpen(false);
    addToast("User account switched successfully", "success");
  };

  const getSearchLabel = () => {
    const loc = searchQuery.location ? searchQuery.location : "Anywhere";
    const dates = searchQuery.startDate && searchQuery.endDate
      ? `${searchQuery.startDate.substring(5)} - ${searchQuery.endDate.substring(5)}`
      : "Any week";
    const guests = searchQuery.guests >= 1
      ? `${searchQuery.guests} guest${searchQuery.guests > 1 ? "s" : ""}`
      : "Add guests";
    return `${loc} | ${dates} | ${guests}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-border py-4 px-6 md:px-12 flex justify-between items-center shadow-sm">
      <Link href="/" onClick={resetSearchQuery} className="flex items-center gap-1.5 text-primary">
        <svg
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
          focusable="false"
          className="w-8 h-8 fill-current"
        >
          <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.91 3.397 0 4.347-3.268 7.62-7.62 7.62-2.367 0-4.383-1.03-5.819-2.909l-.161-.219c-.841-1.198-1.745-2.983-2.739-5.36l-.371-.892c-.1-.237-.21-.46-.328-.669-.117.21-.228.432-.328.669l-.371.892c-.994 2.377-1.898 4.162-2.74 5.36l-.16.219C11.127 29.47 9.112 30.5 6.745 30.5c-4.352 0-7.62-3.273-7.62-7.62 0-.925.243-1.806.909-3.397l.146-.353c.986-2.296 5.146-11.006 7.1-14.836l.533-1.025C9.103 1.963 10.558 1 12.566 1H16zm0 2.566c-1.282 0-2.18.61-3.082 2.22l-.462.888C10.53 10.435 6.425 19.034 5.48 21.238l-.133.322C4.78 22.88 4.606 23.407 4.606 23.88c0 2.766 2.054 4.747 4.747 4.747 1.488 0 2.784-.716 3.864-2.261l.144-.216c.725-1.1 1.558-2.83 2.502-5.187l.375-.92c.3-.736.634-1.272.997-1.579-.364-.307-.697-.843-.997-1.58l-.375-.919c-.944-2.357-1.777-4.088-2.502-5.188l-.144-.216C12.138 9.343 10.84 8.627 9.352 8.627c-2.693 0-4.747 1.981-4.747 4.747 0 .473.174 1 .741 2.358l.133.322c.945 2.204 5.05 10.803 7.02 14.564l.462.888c.902 1.61 1.8 2.22 3.082 2.22h.868zm0 7.422c1.782 0 3.228 1.446 3.228 3.228 0 1.782-1.446 3.228-3.228 3.228-1.782 0-3.228-1.446-3.228-3.228 0-1.782 1.446-3.228 3.228-3.228z"></path>
        </svg>
        <span className="font-bold text-xl tracking-tight hidden sm:inline">airbnb</span>
      </Link>

      <div
        onClick={() => setSearchModalOpen(true)}
        className="flex items-center justify-between border border-gray-border rounded-full py-2 pl-4 pr-2 shadow-sm hover:shadow-md cursor-pointer transition flex-1 min-w-0 sm:flex-initial sm:w-auto max-w-xs sm:max-w-md md:max-w-lg mx-2 sm:mx-4"
      >
        <span className="text-xs sm:text-sm font-semibold text-gray-800 pr-2 sm:pr-4 whitespace-nowrap overflow-hidden text-ellipsis min-w-0">
          {getSearchLabel()}
        </span>
        <div className="bg-primary text-white p-2 rounded-full flex items-center justify-center shrink-0">
          <Search size={14} />
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentUser?.role === "host" ? (
          <Link
            href="/host"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-light text-gray-700"
          >
            <Briefcase size={16} />
            <span>Host Dashboard</span>
          </Link>
        ) : (
          <Link
            href="/trips"
            className="hidden md:flex items-center gap-1.5 text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-light text-gray-700"
          >
            <Plane size={16} />
            <span>My Trips</span>
          </Link>
        )}

        <button
          onClick={toggleRole}
          className="text-sm font-semibold py-2 px-4 rounded-full hover:bg-gray-light text-gray-700 hidden lg:inline"
        >
          Switch to {currentUser?.role === "guest" ? "Hosting" : "Traveling"}
        </button>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-3 border border-gray-border rounded-full p-2 hover:shadow-md transition focus:outline-none bg-white"
          >
            <Menu size={18} className="text-gray-600" />
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
              {currentUser?.avatar_url ? (
                <img
                  src={currentUser.avatar_url}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full p-1 text-gray-400" />
              )}
            </div>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-border py-2 z-50 text-sm">
              <div className="px-4 py-2 border-b border-gray-border">
                <p className="font-semibold text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-500">{currentUser?.email}</p>
                <span className="inline-block mt-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-rose-50 text-primary">
                  Active: {currentUser?.role}
                </span>
              </div>

              <div className="py-1">
                <button
                  onClick={toggleRole}
                  className="w-full text-left px-4 py-3 hover:bg-gray-light text-gray-700 font-semibold"
                >
                  Switch to {currentUser?.role === "guest" ? "Hosting" : "Traveling"}
                </button>
                <Link
                  href="/trips"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-light text-gray-700"
                >
                  My Trips
                </Link>
                <Link
                  href="/wishlist"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 hover:bg-gray-light text-gray-700"
                >
                  Wishlists
                </Link>
                <button
                  onClick={() => {
                    toggleTheme();
                    setMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-light text-gray-700 flex items-center justify-between border-t border-gray-border"
                >
                  <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                </button>
                {currentUser?.role === "host" && (
                  <Link
                    href="/host"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-3 hover:bg-gray-light text-gray-700 border-t border-gray-border"
                  >
                    Host Dashboard
                  </Link>
                )}
              </div>

              <div className="border-t border-gray-border py-1">
                <p className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Select User (Evaluator Tool)
                </p>
                <button
                  onClick={() => handleUserChange(1)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-light text-xs flex justify-between items-center ${currentUserId === 1 ? "text-primary font-bold" : "text-gray-600"
                    }`}
                >
                  <span>Alex Mercer (Guest)</span>
                  {currentUserId === 1 && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
                <button
                  onClick={() => handleUserChange(2)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-light text-xs flex justify-between items-center ${currentUserId === 2 ? "text-primary font-bold" : "text-gray-600"
                    }`}
                >
                  <span>Sarah Jenkins (Host, Superhost)</span>
                  {currentUserId === 2 && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
                <button
                  onClick={() => handleUserChange(3)}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-light text-xs flex justify-between items-center ${currentUserId === 3 ? "text-primary font-bold" : "text-gray-600"
                    }`}
                >
                  <span>John Doe (Host)</span>
                  {currentUserId === 3 && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
