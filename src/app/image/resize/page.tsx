import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageResizer from "@/components/image-resize/ImageResizer";
import ImageToolNav from "@/components/image-nuki/ImageToolNav";
import RelatedTools from "@/components/RelatedTools";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "이미지 사이즈 변경 — 무료 온라인 이미지 리사이즈 | JpgMono",
  description:
    "JPG, PNG, WEBP 이미지를 원하는 크기(픽셀·퍼센트)로 무료 변경하세요. 설치 없이 브라우저에서 바로 사용 가능하며 파일이 서버로 전송되지 않습니다.",
  keywords: ["이미지 사이즈 변경", "이미지 리사이즈", "JPG 크기 변경", "PNG 크기 변경", "무료 이미지 편집"],
  openGraph: {
    title: "이미지 사이즈 변경 | JpgMono",
    description: "JPG, PNG, WEBP 이미지를 원하는 크기로 무료 변경. 브라우저에서 바로 사용 가능합니다.",
    type: "website",
    url: "https://jpgmono.com/image/resize/",
  },
  alternates: { canonical: "https://jpgmono.com/image/resize/" },
};

const FAQ = [
  { q: "화질이 떨어지나요?", a: "리사이즈 시 원본 품질을 최대한 유지합니다. 다만 이미지를 원본보다 크게 확대하면 계단 현상이 생길 수 있습니다." },
  { q: "파일이 서버에 저장되나요?", a: "아닙니다. 모든 처리는 브라우저 안에서만 이루어지며, 파일은 외부 서버로 전송되지 않습니다." },
  { q: "최대 파일 크기 제한이 있나요?", a: "브라우저 메모리에 따라 다르지만, 일반적으로 50MB 이하의 파일에서 원활하게 동작합니다." },
  { q: "모바일에서도 사용할 수 있나요?", a: "네, 스마트폰과 태블릿 브라우저에서도 동일하게 사용할 수 있습니다." },
  { q: "어떤 파일 형식을 지원하나요?", a: "JPG, JPEG, PNG, WEBP, BMP, GIF 형식을 지원합니다. 출력은 JPG 또는 PNG로 저장됩니다." },
];

export default function ResizePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ImageToolNav />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          <a href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</a>
          <span>/</span>
          <a href="/image/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">이미지</a>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">이미지 사이즈 변경</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-700 dark:text-neutral-300">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
              이미지 사이즈 변경
            </h1>
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            JPG, PNG, WEBP 이미지를 원하는 크기로 변경합니다. 파일이 서버로 전송되지 않습니다.
          </p>
        </div>

        <ImageResizer />

        {/* Ad slot */}
        <AdSlot className="my-10" />

        {/* 기능 설명 */}
        <section className="mt-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">이미지 사이즈 변경이란?</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                이미지 사이즈 변경(리사이즈)은 이미지의 가로·세로 픽셀 수를 조절하는 작업입니다.
                SNS 프로필 사진, 블로그 썸네일, 이메일 첨부 등 다양한 상황에서 적절한 크기의 이미지가 필요합니다.
                JpgMono에서는 픽셀 또는 퍼센트 단위로 자유롭게 크기를 지정할 수 있으며,
                가로세로 비율 유지 옵션도 제공합니다.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">사용 방법</h2>
              <ol className="space-y-2">
                {[
                  "이미지 파일을 드래그하거나 클릭하여 업로드합니다.",
                  "가로·세로 크기를 픽셀 또는 퍼센트로 입력합니다.",
                  "비율 유지 여부를 선택합니다.",
                  "변경하기 버튼을 누른 후 결과 이미지를 다운로드합니다.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-600 dark:text-neutral-300">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* 지원 형식 */}
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">지원 파일 형식</h2>
            <div className="flex flex-wrap gap-2">
              {["JPG", "JPEG", "PNG", "WEBP", "BMP", "GIF"].map((f) => (
                <span key={f} className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300">{f}</span>
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
          { href: "/image/nuki/", label: "누끼따기 / 배경 제거", desc: "AI로 배경을 자동 제거하여 투명 PNG로 저장합니다." },
          { href: "/audio/convert/", label: "MP3 변환", desc: "오디오·영상 파일을 MP3로 변환합니다." },
          { href: "/document/counter/", label: "글자수 / 맞춤법", desc: "글자수를 세고 한국어 맞춤법을 검사합니다." },
        ]} />
      </main>
      <Footer />
    </div>
  );
}
