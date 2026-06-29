"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tools = [
  { label: "MP3 변환", href: "/audio/convert/" },
];

export default function AudioToolNav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-neutral-100 dark:border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
        {tools.map((t) => {
          const active = pathname === t.href || pathname === t.href.slice(0, -1);
          return active ? (
            <span key={t.href} className="shrink-0 px-3 py-3 text-sm font-semibold text-neutral-900 dark:text-white border-b-2 border-neutral-900 dark:border-white">
              {t.label}
            </span>
          ) : (
            <Link key={t.href} href={t.href}
              className="shrink-0 px-3 py-3 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border-b-2 border-transparent hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors">
              {t.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
