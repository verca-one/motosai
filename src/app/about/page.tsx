import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "사이트 소개 | JpgMono",
  description: "JpgMono는 이미지 편집, 오디오 변환, 문서 분석 등을 브라우저에서 바로 사용할 수 있는 무료 웹툴 사이트입니다.",
  alternates: { canonical: "https://jpgmono.com/about/" },
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-16">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-10">
          <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</Link>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">사이트 소개</span>
        </nav>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-6">JpgMono 소개</h1>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">서비스 소개</h2>
            <p>
              JpgMono(JPGMONO)는 이미지 편집, 오디오 변환, 문서 분석 등 일상에서 자주 필요한 작업을
              브라우저에서 바로 사용할 수 있는 무료 웹툴 플랫폼입니다.
            </p>
            <p className="mt-2">
              별도의 프로그램 설치 없이 웹 브라우저만 있으면 누구나 무료로 사용할 수 있으며,
              모든 파일 처리가 사용자의 기기(브라우저) 안에서 이루어져 파일이 외부 서버로 전송되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">핵심 원칙</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: "프라이버시 우선", desc: "파일이 서버로 전송되지 않습니다. 모든 처리는 사용자의 기기 내에서만 이루어집니다." },
                { title: "설치 불필요", desc: "웹 브라우저만 있으면 PC·Mac·iOS·Android 모두에서 바로 사용 가능합니다." },
                { title: "완전 무료", desc: "로그인·결제 없이 모든 기능을 무료로 이용할 수 있습니다." },
              ].map((item) => (
                <div key={item.title} className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                  <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">{item.title}</p>
                  <p className="text-xs">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제공 서비스</h2>
            <ul className="space-y-2">
              {[
                { href: "/image/resize/", label: "이미지 사이즈 변경", desc: "JPG, PNG, WEBP 이미지를 원하는 크기로 변경" },
                { href: "/image/nuki/", label: "누끼따기 / 배경 제거", desc: "AI 기반 자동 배경 제거, 투명 PNG 저장" },
                { href: "/audio/convert/", label: "MP3 변환", desc: "오디오·영상 파일을 MP3로 변환, 비트레이트 선택 가능" },
                { href: "/document/counter/", label: "글자수 / 맞춤법 검사", desc: "실시간 글자수 카운트 및 한국어 맞춤법 교정" },
              ].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group">
                    <span className="font-medium text-neutral-800 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white">{item.label}</span>
                    <span className="text-xs text-neutral-400">— {item.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">문의</h2>
            <p>서비스 이용 중 문의사항이 있으시면 <Link href="/contact/" className="text-neutral-800 dark:text-neutral-200 underline hover:no-underline">문의하기</Link> 페이지를 이용해 주세요.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
