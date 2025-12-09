"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/");
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-xs md:max-w-sm">
      <input
        type="text"
        placeholder="Search news..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-stone-800 border-none rounded-full focus:ring-2 focus:ring-blue-500 outline-none transition-all"
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
    </form>
  );
}