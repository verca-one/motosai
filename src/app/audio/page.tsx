import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const audioTools = [
  {
    href: "/audio/convert/",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    title: "MP3 변환",
    description: "오디오·동영상 파일을 MP3로 변환합니다. 비트레이트와 샘플레이트를 선택할 수 있습니다.",
    badge: null,
  },
];

export default function AudioPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">오디오 도구</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          브라우저에서 바로 사용 · 파일이 서버로 전송되지 않습니다
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {audioTools.map((item) => (
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
