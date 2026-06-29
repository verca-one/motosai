import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "문의하기 | JpgMono",
  description: "JpgMono 서비스 이용 중 문의사항을 남겨주세요.",
  alternates: { canonical: "https://jpgmono.com/contact/" },
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-16">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-10">
          <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</Link>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">문의하기</span>
        </nav>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-3">문의하기</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-10 leading-relaxed">
          서비스 이용 중 불편한 점, 버그 신고, 개선 제안 등을 아래 이메일로 보내주세요.
          최대한 빠르게 답변 드리겠습니다.
        </p>

        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">이메일 문의</p>
            <a
              href="mailto:goes630@gmail.com"
              className="text-lg font-semibold text-neutral-900 dark:text-white hover:underline"
            >
              goes630@gmail.com
            </a>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              영업일 기준 1~3일 내 답변 드립니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800">
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">문의 전 확인해 주세요</p>
            <ul className="space-y-2">
              {[
                "버그 신고 시 사용 중인 브라우저와 운영체제를 함께 알려주시면 빠른 해결에 도움이 됩니다.",
                "이미지·오디오 등 파일 처리 관련 문의 시 파일 형식과 크기를 함께 알려주세요.",
                "개인정보 관련 문의는 개인정보처리방침을 먼저 확인해 주세요.",
              ].map((item, i) => (
                <li key={i} className="flex gap-2.5 text-sm text-neutral-500 dark:text-neutral-400">
                  <span className="shrink-0 text-neutral-300 dark:text-neutral-600">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3">
            <Link href="/privacy/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 underline transition-colors">개인정보처리방침</Link>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <Link href="/terms/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 underline transition-colors">이용약관</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
