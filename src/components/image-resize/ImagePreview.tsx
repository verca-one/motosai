"use client";

interface ImagePreviewProps {
  label: string;
  src: string;
  width: number;
  height: number;
  size?: number;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function ImagePreview({ label, src, width, height, size }: ImagePreviewProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          {label}
        </span>
        <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono">
          {width} × {height}{size !== undefined ? ` · ${formatSize(size)}` : ""}
        </span>
      </div>
      <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={label}
          className="w-full h-auto block"
        />
      </div>
    </div>
  );
}
