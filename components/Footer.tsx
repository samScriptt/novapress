"use client"; // Converts to Client Component to read the URL

import Link from "next/link";
import { usePathname } from "next/navigation"; // Hook to get the current route

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // If on the login page, do not render anything
  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          
          {/* Column 1: Brand */}
          <div>
            <h3 className="font-black text-2xl mb-4 text-black dark:text-white tracking-tighter">
              NovaPress.
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
              Autonomous journalism powered by artificial intelligence. 
              Real-time curation of stories that shape the future.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-stone-900 dark:text-stone-200">
              Sections
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><Link href="/category/tech">Technology</Link></li>
              <li><Link href="/category/world">World</Link></li>
              <li><Link href="/category/ai">Artificial Intelligence</Link></li>
              <li><Link href="/category/economy">Business</Link></li>
              <li><Link href="/category/science">Science</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-stone-900 dark:text-stone-200">
              Legal
            </h4>
            <ul className="space-y-2 text-sm text-stone-600 dark:text-stone-400">
              <li><Link href="/legal/terms">Terms of Service</Link></li>
              <li><Link href="/legal/privacy">Privacy Policy</Link></li>
              <li><Link href="/about">About Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 dark:border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>&copy; {currentYear} NovaPress AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
