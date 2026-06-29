import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <p className="text-6xl font-bold text-neutral-200 dark:text-neutral-800 mb-4">404</p>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">페이지를 찾을 수 없습니다</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 max-w-sm">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-90 transition-opacity"
        >
          홈으로 돌아가기
        </Link>
        <div className="mt-10 flex flex-wrap justify-center gap-3 text-sm">
          {[
            { href: "/image/resize/", label: "이미지 사이즈 변경" },
            { href: "/image/nuki/", label: "누끼따기" },
            { href: "/image/crop/", label: "이미지 크롭" },
            { href: "/audio/convert/", label: "MP3 변환" },
            { href: "/document/counter/", label: "글자수 검사" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
            >
              {t.label}
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
