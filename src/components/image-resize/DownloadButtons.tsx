"use client";

interface DownloadButtonsProps {
  onDownload: (format: "png" | "jpg" | "webp") => void;
  disabled?: boolean;
}

const formats = [
  { label: "PNG 저장", format: "png" as const, color: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900" },
  { label: "JPG 저장", format: "jpg" as const, color: "bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900" },
  { label: "WEBP 저장", format: "webp" as const, color: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900" },
];

export default function DownloadButtons({ onDownload, disabled }: DownloadButtonsProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
        저장
      </p>
      <div className="flex flex-col gap-2">
        {formats.map(({ label, format, color }) => (
          <button
            key={format}
            onClick={() => onDownload(format)}
            disabled={disabled}
            className={`px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${color}`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
