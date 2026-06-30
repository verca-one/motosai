import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "JpgMono — 무료 온라인 이미지·오디오·문서 도구",
  description:
    "이미지 사이즈 변경, 배경 제거(누끼따기), MP3 변환, 글자수 세기, 맞춤법 검사까지. 설치 없이 브라우저에서 바로 사용하는 무료 웹툴 모음입니다.",
  keywords: ["이미지 사이즈 변경", "누끼따기", "배경 제거", "MP3 변환", "글자수 세기", "맞춤법 검사", "무료 온라인 도구"],
  openGraph: {
    title: "JpgMono — 무료 온라인 이미지·오디오·문서 도구",
    description: "이미지 사이즈 변경, 배경 제거, MP3 변환, 글자수·맞춤법 검사. 브라우저에서 바로 사용하는 무료 웹툴.",
    type: "website",
    url: "https://jpgmono.com/",
  },
  alternates: { canonical: "https://jpgmono.com/" },
};

const categories = [
  {
    label: "이미지",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    tools: [
      { href: "/image/resize/", title: "이미지 사이즈 변경", desc: "JPG·PNG·WEBP를 원하는 크기로 조절합니다.", badge: null },
      { href: "/image/nuki/", title: "누끼따기 / 배경 제거", desc: "AI가 자동으로 배경을 제거합니다.", badge: null },
      { href: "/image/crop/", title: "이미지 크롭", desc: "원하는 영역으로 이미지를 잘라냅니다.", badge: null },
    ],
  },
  {
    label: "오디오",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
    tools: [
      { href: "/audio/convert/", title: "MP3 변환", desc: "WAV·M4A·AAC 등 오디오를 MP3로 변환합니다.", badge: null },
    ],
  },
  {
    label: "문서",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    tools: [
      { href: "/document/counter/", title: "글자수 / 맞춤법 검사", desc: "글자수·단어수를 세고 한국어 맞춤법을 검사합니다.", badge: null },
    ],
  },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            무료 · 브라우저에서 바로 · 서버 업로드 없음
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-white leading-tight">
            쉽고 빠른<br />온라인 도구 모음
          </h1>
          <p className="mt-6 text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed break-keep">
            이미지 편집, 오디오 변환, 문서 분석까지. 설치 없이 브라우저에서 바로 사용하세요. 파일이 서버로 전송되지 않아 안전합니다.
          </p>
          <p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
            ⚠️ 중요한 작업물의 원본은 작업 전에 미리 백업해 주세요.
          </p>
        </section>

        {/* Tool categories */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
          <div className="space-y-10">
            {categories.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-neutral-500 dark:text-neutral-400">{cat.icon}</span>
                  <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    {cat.label}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {cat.tools.map((tool) =>
                    tool.badge ? (
                      <div
                        key={tool.title}
                        className="relative flex flex-col gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 opacity-60 cursor-default"
                      >
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400" />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-neutral-500 dark:text-neutral-400 text-sm">{tool.title}</p>
                            <span className="text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded-full">{tool.badge}</span>
                          </div>
                          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">{tool.desc}</p>
                        </div>
                      </div>
                    ) : (
                      <Link
                        key={tool.title}
                        href={tool.href}
                        className="group relative flex flex-col gap-4 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
                      >
                        <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 group-hover:bg-neutral-900 dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-neutral-900 transition-colors">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">{tool.title}</p>
                          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">{tool.desc}</p>
                        </div>
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features summary */}
        <section className="bg-neutral-50 dark:bg-neutral-900/50 py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-8 text-center">왜 JpgMono인가요?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { title: "서버 업로드 없음", desc: "모든 작업이 브라우저 안에서 처리됩니다. 파일이 외부 서버로 전송되지 않아 개인정보가 안전합니다." },
                { title: "설치 불필요", desc: "별도 프로그램 설치 없이 웹 브라우저만 있으면 바로 사용할 수 있습니다. PC·모바일 모두 지원합니다." },
                { title: "완전 무료", desc: "로그인·결제 없이 모든 기능을 무료로 이용할 수 있습니다. 광고만 표시될 수 있습니다." },
              ].map((f) => (
                <div key={f.title} className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
