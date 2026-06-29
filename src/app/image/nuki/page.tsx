import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackgroundRemover from "@/components/image-nuki/BackgroundRemover";
import ImageToolNav from "@/components/image-nuki/ImageToolNav";
import RelatedTools from "@/components/RelatedTools";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "누끼따기 / 배경 제거 — AI 자동 배경 제거 무료 | 모토사이",
  description:
    "AI가 자동으로 이미지 배경을 제거합니다. 투명 PNG로 저장하거나 원하는 배경색을 적용할 수 있습니다. 브라우저에서 처리되어 파일이 서버로 전송되지 않습니다.",
  keywords: ["누끼따기", "배경 제거", "배경 없애기", "투명 배경", "PNG 배경 제거", "AI 배경 제거"],
  openGraph: {
    title: "누끼따기 / 배경 제거 | 모토사이",
    description: "AI가 자동으로 이미지 배경을 제거합니다. 투명 PNG 저장 지원. 브라우저에서 바로 사용.",
    type: "website",
    url: "https://motosai.com/image/nuki/",
  },
  alternates: { canonical: "https://motosai.com/image/nuki/" },
};

const FAQ = [
  { q: "어떤 이미지에서 잘 동작하나요?", a: "인물 사진, 상품 사진, 동물 사진 등 피사체와 배경의 대비가 뚜렷한 이미지에서 가장 잘 동작합니다." },
  { q: "파일이 서버에 저장되나요?", a: "아닙니다. AI 모델이 브라우저 내에서 직접 실행되어, 파일이 외부 서버로 전송되지 않습니다." },
  { q: "처음 실행 시 왜 느린가요?", a: "첫 실행 시 AI 모델 파일을 다운로드합니다. 이후에는 캐시되어 빠르게 동작합니다." },
  { q: "테두리가 깔끔하지 않을 때 어떻게 하나요?", a: "결과 화면에서 '테두리 정리' 버튼을 눌러 가장자리를 자동으로 다듬거나, 세부 설정을 통해 수동으로 조절할 수 있습니다." },
  { q: "어떤 형식으로 저장되나요?", a: "투명 배경이 지원되는 PNG 형식으로 저장됩니다. 배경색을 지정한 경우에도 PNG로 저장됩니다." },
];

export default function NukkiPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ImageToolNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          <a href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</a>
          <span>/</span>
          <a href="/image/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">이미지</a>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">누끼따기</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">누끼따기 / 배경 제거</h1>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
            AI가 자동으로 배경을 제거합니다. 브라우저에서 처리되며 파일이 서버로 전송되지 않습니다.
          </p>
        </div>

        <BackgroundRemover />

        {/* Ad slot */}
        <AdSlot className="my-10" />

        {/* 기능 설명 */}
        <section className="mt-4 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">누끼따기란?</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                누끼따기(배경 제거)는 이미지에서 피사체만 남기고 배경을 제거하는 작업입니다.
                상품 사진 편집, 증명사진 배경 변경, 합성 이미지 제작 등에 활용됩니다.
                모토사이는 딥러닝 AI 모델을 사용하여 클릭 한 번으로 자동 배경 제거를 지원하며,
                테두리 품질 개선 기능도 제공합니다.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">사용 방법</h2>
              <ol className="space-y-2">
                {[
                  "이미지 파일을 드래그하거나 클릭하여 업로드합니다.",
                  "'누끼따기 시작' 버튼을 클릭합니다. (첫 실행 시 AI 모델 로딩 필요)",
                  "결과를 확인하고 필요하면 '테두리 정리'로 품질을 개선합니다.",
                  "배경색을 선택하거나 투명 PNG로 다운로드합니다.",
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
              {["JPG", "JPEG", "PNG", "WEBP", "BMP"].map((f) => (
                <span key={f} className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300">{f}</span>
              ))}
            </div>
            <p className="mt-2 text-xs text-neutral-400 dark:text-neutral-500">출력 형식: PNG (투명 배경 지원)</p>
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
          { href: "/audio/convert/", label: "MP3 변환", desc: "오디오·영상 파일을 MP3로 변환합니다." },
          { href: "/document/counter/", label: "글자수 / 맞춤법", desc: "글자수를 세고 한국어 맞춤법을 검사합니다." },
        ]} />
      </main>
      <Footer />
    </div>
  );
}
