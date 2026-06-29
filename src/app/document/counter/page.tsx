import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DocumentTool from "@/components/document/DocumentTool";
import RelatedTools from "@/components/RelatedTools";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "글자수 세기 / 맞춤법 검사 — 한국어 무료 온라인 도구 | JpgMono",
  description:
    "한국어 글자수·단어수·문장수를 실시간으로 세고, 맞춤법·띄어쓰기를 검사합니다. TXT·DOCX 파일 열기 및 저장 지원. 브라우저에서 바로 사용.",
  keywords: ["글자수 세기", "맞춤법 검사", "한국어 맞춤법", "띄어쓰기 검사", "단어수 세기", "글자수 카운터"],
  openGraph: {
    title: "글자수 세기 / 맞춤법 검사 | JpgMono",
    description: "한국어 글자수·단어수·맞춤법·띄어쓰기를 실시간으로 검사. 브라우저에서 바로 사용.",
    type: "website",
    url: "https://jpgmono.com/document/counter/",
  },
  alternates: { canonical: "https://jpgmono.com/document/counter/" },
};

const FAQ = [
  { q: "글자수는 어떤 기준으로 세나요?", a: "공백 포함·공백 제외 두 가지 기준으로 모두 표시합니다. 원고지 분량 계산 시 공백 제외 기준을 사용하세요." },
  { q: "맞춤법 검사는 얼마나 정확한가요?", a: "자주 틀리는 30여 가지 한국어 맞춤법과 띄어쓰기 규칙을 검사합니다. 완벽하지 않을 수 있으므로 중요한 문서는 전문 교정을 받으세요." },
  { q: "파일을 직접 열 수 있나요?", a: "네, TXT와 DOCX 파일을 직접 열어 글자수를 확인하고 맞춤법을 검사할 수 있습니다." },
  { q: "검사 결과를 저장할 수 있나요?", a: "수정된 텍스트를 TXT 또는 DOCX 파일로 저장할 수 있습니다." },
  { q: "인터넷 연결 없이 사용할 수 있나요?", a: "네, 모든 기능이 브라우저 안에서 처리되므로 인터넷 연결 없이도 사용 가능합니다." },
];

export default function DocumentCounterPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          <a href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</a>
          <span>/</span>
          <a href="/document/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">문서</a>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">글자수 / 맞춤법</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">글자수 / 맞춤법</h1>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
            글자수·단어수를 실시간으로 세고, 한국어 맞춤법·띄어쓰기를 검사합니다.
          </p>
        </div>

        <DocumentTool />

        {/* Ad slot */}
        <AdSlot className="my-10" />

        {/* 기능 설명 */}
        <section className="mt-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">이 도구로 할 수 있는 것</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                글자수 세기 도구는 블로그 포스팅, 리포트 작성, SNS 게시물, 공모전 원고 등
                글자 수 제한이 있는 글을 작성할 때 유용합니다.
                맞춤법 검사 기능은 됐/됬, 몇일/며칠, 왠지/웬지 등
                자주 혼동하는 한국어 표현을 자동으로 교정합니다.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">사용 방법</h2>
              <ol className="space-y-2">
                {[
                  "텍스트를 직접 입력하거나 TXT·DOCX 파일을 엽니다.",
                  "실시간으로 글자수·단어수·문장수를 확인합니다.",
                  "'맞춤법 검사' 버튼으로 오류를 찾습니다.",
                  "각 오류를 클릭하여 수정하거나 '모두 수정'을 사용합니다.",
                  "TXT 또는 DOCX 파일로 저장합니다.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-600 dark:text-neutral-300">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 검사 항목 */}
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">맞춤법 검사 항목 예시</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { wrong: "됬다", right: "됐다" },
                { wrong: "몇일", right: "며칠" },
                { wrong: "웬지", right: "왠지" },
                { wrong: "금새", right: "금세" },
                { wrong: "오랫만에", right: "오랜만에" },
                { wrong: "설레임", right: "설렘" },
                { wrong: "할수있", right: "할 수 있" },
                { wrong: "것같", right: "것 같" },
              ].map((item) => (
                <div key={item.wrong} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
                  <span className="text-sm text-red-400 line-through">{item.wrong}</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-300 shrink-0"><path d="M3 7h8M8 4l3 3-3 3"/></svg>
                  <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{item.right}</span>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">자주 묻는 질문</h2>
            <div className="space-y-4">
              {FAQ.map((item) => (
                <div key={item.q} className="border border-neutral-100 dark:border-neutral-800 rounded-xl p-4">
                  <p className="font-semibold text-sm text-neutral-800 dark:text-neutral-200 mb-1">Q. {item.q}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RelatedTools tools={[
          { href: "/image/resize/", label: "이미지 사이즈 변경", desc: "이미지를 원하는 픽셀 크기로 변경합니다." },
          { href: "/image/nuki/", label: "누끼따기 / 배경 제거", desc: "AI로 배경을 자동 제거합니다." },
          { href: "/audio/convert/", label: "MP3 변환", desc: "오디오·영상 파일을 MP3로 변환합니다." },
        ]} />
      </main>
      <Footer />
    </div>
  );
}
