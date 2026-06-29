"use client";

interface Preset {
  label: string;
  width: number;
  height: number;
}

const PRESETS: Preset[] = [
  { label: "512 × 512", width: 512, height: 512 },
  { label: "1024 × 500", width: 1024, height: 500 },
  { label: "1200 × 628", width: 1200, height: 628 },
  { label: "1080 × 1080", width: 1080, height: 1080 },
  { label: "1920 × 1080", width: 1920, height: 1080 },
];

interface SizePresetsProps {
  width: number;
  height: number;
  customMode: boolean;
  onPreset: (w: number, h: number) => void;
  onCustomMode: () => void;
  onWidthChange: (v: number) => void;
  onHeightChange: (v: number) => void;
}

export default function SizePresets({
  width,
  height,
  customMode,
  onPreset,
  onCustomMode,
  onWidthChange,
  onHeightChange,
}: SizePresetsProps) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
        사이즈 선택
      </p>
      <div className="flex gap-4">
        {/* 입력창 */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 dark:text-neutral-500">가로 (px)</label>
            <input
              type="number"
              min={1}
              max={8000}
              value={width}
              onChange={(e) => { onCustomMode(); onWidthChange(Number(e.target.value)); }}
              className="w-28 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
            />
          </div>
          <span className="text-neutral-300 dark:text-neutral-600 mt-5">×</span>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 dark:text-neutral-500">세로 (px)</label>
            <input
              type="number"
              min={1}
              max={8000}
              value={height}
              onChange={(e) => { onCustomMode(); onHeightChange(Number(e.target.value)); }}
              className="w-28 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white"
            />
          </div>
        </div>

      </div>
    </div>
  );
}
