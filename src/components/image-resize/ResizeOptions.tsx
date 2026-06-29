"use client";

export type BgColor = "white" | "black" | "transparent";

interface ResizeOptionsProps {
  keepRatio: boolean;
  centerAlign: boolean;
  bgColor: BgColor;
  onKeepRatio: (v: boolean) => void;
  onCenterAlign: (v: boolean) => void;
  onBgColor: (v: BgColor) => void;
}

export default function ResizeOptions({
  keepRatio,
  centerAlign,
  bgColor,
  onKeepRatio,
  onCenterAlign,
  onBgColor,
}: ResizeOptionsProps) {
  return (
    <div className="space-y-4">
      {/* Checkboxes */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          옵션
        </p>
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            checked={keepRatio}
            onChange={(e) => onKeepRatio(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-white cursor-pointer"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">비율 유지</span>
        </label>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={centerAlign}
            onChange={(e) => onCenterAlign(e.target.checked)}
            className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-600 accent-neutral-900 dark:accent-white cursor-pointer"
          />
          <span className="text-sm text-neutral-700 dark:text-neutral-300">가운데 정렬</span>
        </label>
      </div>

      {/* Background color */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          배경색
        </p>
        <div className="flex gap-2">
          {(
            [
              { value: "white", label: "흰색", bg: "bg-white border-neutral-200", dot: "bg-white border border-neutral-300" },
              { value: "black", label: "검정", bg: "bg-neutral-900", dot: "bg-neutral-900" },
              { value: "transparent", label: "투명 (PNG)", bg: "bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%228%22 height=%228%22%3E%3Crect width=%224%22 height=%224%22 fill=%22%23ccc%22/%3E%3Crect x=%224%22 y=%224%22 width=%224%22 height=%224%22 fill=%22%23ccc%22/%3E%3C/svg%3E')]", dot: "" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.value}
              onClick={() => onBgColor(opt.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${
                bgColor === opt.value
                  ? "border-neutral-900 dark:border-white bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500"
              }`}
            >
              <span
                className={`w-4 h-4 rounded-sm border border-neutral-200 ${
                  opt.value === "transparent"
                    ? "bg-[repeating-conic-gradient(#e5e5e5_0%_25%,white_0%_50%)] bg-[length:8px_8px]"
                    : opt.value === "white"
                    ? "bg-white"
                    : "bg-neutral-900"
                }`}
              />
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
