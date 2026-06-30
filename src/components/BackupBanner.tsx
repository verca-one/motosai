"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "JPGMONO_backup_banner_dismissed";

export default function BackupBanner() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!sessionStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem(STORAGE_KEY, "1");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-start gap-3">
          <span className="text-amber-500 text-lg shrink-0 mt-0.5">⚠️</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                JpgMono는 웹 기반 서비스입니다.
              </p>
              <button
                onClick={() => setCollapsed(v => !v)}
                className="text-xs text-amber-600 dark:text-amber-400 hover:underline shrink-0"
              >
                {collapsed ? "자세히 보기" : "접기"}
              </button>
            </div>
            {!collapsed && (
              <p className="mt-1 text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                손실될 수 있습니다.
                <strong className="font-semibold"> 중요한 작업물은 반드시 백업 후에 이용해 주세요.</strong>
              </p>
            )}
          </div>
          <button
            onClick={dismiss}
            aria-label="닫기"
            className="shrink-0 text-amber-400 hover:text-amber-600 dark:text-amber-500 dark:hover:text-amber-300 transition-colors mt-0.5"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M3 3l10 10M13 3L3 13" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
