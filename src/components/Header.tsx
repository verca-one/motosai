"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navCategories: { label: string; href: string; soon?: boolean }[] = [
  { label: "이미지", href: "/image/" },
  { label: "오디오", href: "/audio/" },
  { label: "문서", href: "/document/" },
];

const communityBoards = [
  { label: "자유 게시판", href: "/community/free", desc: "자유롭게 이야기해요" },
];

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [communityOpen, setCommunityOpen] = useState(false);
  const communityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (communityRef.current && !communityRef.current.contains(e.target as Node)) {
        setCommunityOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-neutral-950/90 backdrop-blur border-b border-neutral-100 dark:border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-8 h-8 rounded-lg bg-neutral-900 dark:bg-white flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="white" className="dark:fill-neutral-900" />
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="white" className="dark:fill-neutral-900" />
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="white" className="dark:fill-neutral-900" />
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="white" className="dark:fill-neutral-900" opacity="0.4" />
            </svg>
          </span>
          <span className="font-semibold text-lg tracking-tight">JpgMono</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navCategories.map((cat) => {
            const isActive = !cat.soon && pathname === cat.href;
            return isActive ? (
              <span
                key={cat.label}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800"
              >
                {cat.label}
              </span>
            ) : (
              <Link
                key={cat.label}
                href={cat.soon ? "#" : cat.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  cat.soon
                    ? "text-neutral-400 dark:text-neutral-600 cursor-default"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                {cat.label}
                {cat.soon && (
                  <span className="ml-1.5 text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-full">
                    준비중
                  </span>
                )}
              </Link>
            );
          })}

          {/* Community dropdown */}
          <div ref={communityRef} className="relative">
            <button
              onClick={() => setCommunityOpen((v) => !v)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                communityOpen
                  ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              커뮤니티
              <svg
                width="14" height="14" viewBox="0 0 14 14" fill="none"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                className={`transition-transform duration-200 ${communityOpen ? "rotate-180" : ""}`}
              >
                <path d="M3 5L7 9L11 5" />
              </svg>
            </button>

            {communityOpen && (
              <div className="absolute top-full left-0 mt-2 w-52 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-lg shadow-neutral-200/60 dark:shadow-neutral-900/60 overflow-hidden py-1.5">
                <p className="px-4 pt-2 pb-1.5 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
                  게시판
                </p>
                {communityBoards.map((board) => (
                  <Link
                    key={board.href}
                    href={board.href}
                    onClick={() => setCommunityOpen(false)}
                    className="flex flex-col px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                      {board.label}
                    </span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {board.desc}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="메뉴"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="4" y1="4" x2="16" y2="16" />
                <line x1="16" y1="4" x2="4" y2="16" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="17" y2="6" />
                <line x1="3" y1="10" x2="17" y2="10" />
                <line x1="3" y1="14" x2="17" y2="14" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 px-4 py-3 flex flex-col gap-1">
          {navCategories.map((cat) => (
            <Link
              key={cat.label}
              href={cat.soon ? "#" : cat.href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                cat.soon
                  ? "text-neutral-400 dark:text-neutral-600"
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              }`}
            >
              {cat.label}
              {cat.soon && (
                <span className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-full">
                  준비중
                </span>
              )}
            </Link>
          ))}
          <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
          <p className="px-3 py-1 text-[10px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            커뮤니티
          </p>
          {communityBoards.map((board) => (
            <Link
              key={board.href}
              href={board.href}
              onClick={() => setMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {board.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
