import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "이미지 도구 — 무료 온라인 이미지 편집",
  description: "이미지 사이즈 변경, 누끼따기(배경 제거), 이미지 크롭 등 다양한 이미지 편집 도구를 브라우저에서 바로 사용하세요.",
  alternates: { canonical: "https://jpgmono.com/image/" },
};

const tools = [
  {
    href: "/image/resize/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 21V9" />
      </svg>
    ),
    title: "이미지 사이즈 변경",
    description: "JPG, PNG, WEBP 이미지를 원하는 크기로 조절합니다.",
    badge: null,
  },
  {
    href: "/image/nuki/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
        <path d="M8 12h8M12 8v8" />
      </svg>
    ),
    title: "누끼따기 / 배경 제거",
    description: "AI가 자동으로 배경을 제거합니다. 투명 PNG로 저장 가능합니다.",
    badge: null,
  },
  {
    href: "/image/crop/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M18 22V8a2 2 0 0 0-2-2H2" />
      </svg>
    ),
    title: "이미지 크롭",
    description: "원하는 영역으로 이미지를 잘라냅니다.",
    badge: null,
  },
];

export default function ImagePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</Link>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">이미지</span>
        </nav>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">이미지 도구</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          브라우저에서 바로 사용 · 파일이 서버로 전송되지 않습니다
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((item) =>
            item.badge ? (
              <div key={item.title} className="relative flex flex-col gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 opacity-60">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">{item.icon}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-500 dark:text-neutral-400 text-sm">{item.title}</p>
                    <span className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-full">{item.badge}</span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ) : (
              <Link key={item.title} href={item.href}
                className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
                <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-900 transition-colors">{item.icon}</div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{item.title}</p>
                  <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">{item.description}</p>
                </div>
              </Link>
            )
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
