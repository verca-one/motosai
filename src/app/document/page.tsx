import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const documentTools = [
  {
    href: "/document/counter/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "글자수 / 맞춤법",
    description: "글자수·단어수·문장수를 실시간으로 세고, 한국어 맞춤법을 검사합니다.",
    badge: null,
  },
];

export default function DocumentPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">문서 도구</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          브라우저에서 바로 사용 · 파일이 서버로 전송되지 않습니다
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {documentTools.map((item) => (
            <Link key={item.title} href={item.href}
              className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-900 transition-colors">
                {item.icon}
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{item.title}</p>
                <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
