"use client";

import React from "react";
import { Home, Tent, Flame, Waves, TreePine, Ship } from "lucide-react";

interface CategoryItem {
  name: string;
  icon: React.ReactNode;
}

interface CategoryListProps {
  selectedCategory: string;
  onSelectCategory: (name: string) => void;
}

export default function CategoryList({
  selectedCategory,
  onSelectCategory
}: CategoryListProps) {
  const categories: CategoryItem[] = [
    { name: "Cabins", icon: <TreePine size={22} /> },
    { name: "Beachfront", icon: <Waves size={22} /> },
    { name: "Mansions", icon: <Flame size={22} /> },
    { name: "Treehouses", icon: <Tent size={22} /> },
    { name: "Lakefront", icon: <Ship size={22} /> },
    { name: "Trending", icon: <Flame size={22} /> }
  ];

  return (
    <div className="flex-1 min-w-0 flex gap-8 overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => onSelectCategory("")}
        className={`flex flex-col items-center gap-1.5 pb-2 text-xs font-semibold transition cursor-pointer border-b-2 ${selectedCategory === ""
            ? "border-foreground text-foreground"
            : "border-transparent text-gray-medium hover:text-foreground hover:border-gray-border"
          }`}
      >
        <Home size={22} />
        <span className="whitespace-nowrap">All Homes</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.name}
          onClick={() => onSelectCategory(cat.name)}
          className={`flex flex-col items-center gap-1.5 pb-2 text-xs font-semibold transition cursor-pointer border-b-2 ${selectedCategory === cat.name
              ? "border-foreground text-foreground"
              : "border-transparent text-gray-medium hover:text-foreground hover:border-gray-border"
            }`}
        >
          {cat.icon}
          <span className="whitespace-nowrap">{cat.name}</span>
        </button>
      ))}
    </div>
  );
}
