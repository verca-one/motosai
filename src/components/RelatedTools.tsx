import Link from "next/link";

type Tool = {
  href: string;
  label: string;
  desc: string;
};

export default function RelatedTools({ tools }: { tools: Tool[] }) {
  return (
    <section className="mt-14 pt-8 border-t border-neutral-100 dark:border-neutral-800">
      <h2 className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-4">
        관련 기능
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {tools.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="group flex flex-col gap-1 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm transition-all duration-200"
          >
            <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
              {t.label}
            </span>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
              {t.desc}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
