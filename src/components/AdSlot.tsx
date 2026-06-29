export default function AdSlot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`w-full min-h-[90px] flex items-center justify-center rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-dashed border-neutral-200 dark:border-neutral-700 text-xs text-neutral-300 dark:text-neutral-600 ${className}`}
      aria-hidden="true"
    >
      {/* 광고 영역 */}
    </div>
  );
}
