"use client";

import { useRef, useState } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
}

export default function DropZone({ onFile }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) return;
    onFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  function loadSample() {
    const canvas = document.createElement("canvas");
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 800, 600);
    grad.addColorStop(0, "#6366f1");
    grad.addColorStop(0.5, "#8b5cf6");
    grad.addColorStop(1, "#ec4899");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = "rgba(255,255,255,0.15)";
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      ctx.arc(100 + i * 120, 300 + Math.sin(i) * 80, 60 + i * 8, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "white";
    ctx.font = "bold 48px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Sample Image", 400, 310);
    ctx.font = "20px sans-serif";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("800 × 600", 400, 350);
    canvas.toBlob((blob) => {
      if (blob) onFile(new File([blob], "sample.png", { type: "image/png" }));
    }, "image/png");
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full max-w-lg border-2 border-dashed rounded-2xl p-12 flex flex-col items-center gap-4 cursor-pointer transition-all duration-200 ${
          dragging
            ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-900 scale-[1.01]"
            : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900"
        }`}
      >
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="text-neutral-400 dark:text-neutral-500">
            <path d="M6 22L11 16L15 20L20 13L26 22H6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="11" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
            <rect x="3" y="3" width="26" height="26" rx="3" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </div>
        <div className="text-center">
          <p className="font-semibold text-neutral-800 dark:text-neutral-200">
            이미지를 드래그하거나 클릭하여 선택
          </p>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
            JPG, PNG, WEBP 지원
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <button
        onClick={() => inputRef.current?.click()}
        className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        이미지 선택
      </button>
    </div>
  );
}
