import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AudioConverter from "@/components/audio/AudioConverter";
import AudioToolNav from "@/components/audio/AudioToolNav";
import RelatedTools from "@/components/RelatedTools";
import AdSlot from "@/components/AdSlot";

export const metadata: Metadata = {
  title: "MP3 변환 — 오디오·영상 파일을 MP3로 무료 변환 | 모토사이",
  description:
    "WAV, M4A, AAC, OGG, FLAC, MP4, MOV 파일을 MP3로 무료 변환합니다. 비트레이트·샘플레이트 선택 가능. 파일이 서버로 전송되지 않아 안전합니다.",
  keywords: ["MP3 변환", "오디오 변환", "WAV MP3 변환", "M4A MP3", "음악 변환", "무료 MP3 변환"],
  openGraph: {
    title: "MP3 변환 | 모토사이",
    description: "WAV, M4A, AAC 등 오디오·영상 파일을 MP3로 무료 변환. 브라우저에서 바로 사용.",
    type: "website",
    url: "https://motosai.com/audio/convert/",
  },
  alternates: { canonical: "https://motosai.com/audio/convert/" },
};

const FAQ = [
  { q: "어떤 파일을 MP3로 변환할 수 있나요?", a: "MP3, WAV, M4A, AAC, OGG, FLAC, WMA 오디오 파일과 MP4, MOV 영상 파일의 오디오를 추출하여 MP3로 변환할 수 있습니다." },
  { q: "파일이 서버에 저장되나요?", a: "아닙니다. FFmpeg.wasm 기술을 사용하여 모든 변환이 브라우저 안에서 처리되며, 파일이 외부 서버로 전송되지 않습니다." },
  { q: "비트레이트는 어떤 것을 선택해야 하나요?", a: "음질을 중시한다면 320kbps, 용량과 음질의 균형이라면 192kbps, 파일 크기를 줄이고 싶다면 128kbps를 선택하세요." },
  { q: "변환 시간이 왜 오래 걸리나요?", a: "브라우저에서 직접 변환하기 때문에 파일 크기와 기기 성능에 따라 시간이 달라질 수 있습니다. 대용량 파일은 수 분이 걸릴 수 있습니다." },
  { q: "모바일에서도 사용할 수 있나요?", a: "네, 모바일 브라우저에서도 사용 가능합니다. 단, 대용량 파일은 기기 메모리 한계로 실패할 수 있습니다." },
];

export default function AudioConvertPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <AudioToolNav />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          <a href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</a>
          <span>/</span>
          <a href="/audio/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">오디오</a>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">MP3 변환</span>
        </nav>

        <AudioConverter />

        {/* Ad slot */}
        <AdSlot className="my-10" />

        {/* 기능 설명 */}
        <section className="mt-4 space-y-10">
          <div className="grid grid-cols-1 gap-8">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">MP3 변환이란?</h2>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
                MP3 변환은 다양한 오디오·영상 파일을 MP3 형식으로 바꾸는 작업입니다.
                MP3는 가장 널리 지원되는 오디오 포맷으로, 스마트폰·MP3 플레이어·차량 오디오 등에서 호환성이 뛰어납니다.
                모토사이의 MP3 변환 도구는 브라우저에서 직접 변환하여 파일이 외부 서버로 전송되지 않습니다.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">사용 방법</h2>
              <ol className="space-y-2">
                {[
                  "오디오 또는 영상 파일을 드래그하거나 클릭하여 업로드합니다.",
                  "비트레이트(128/192/256/320kbps)와 샘플레이트를 선택합니다.",
                  "'MP3 변환 시작' 버튼을 클릭합니다.",
                  "변환이 완료되면 미리 듣기 후 다운로드합니다.",
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
            <div className="space-y-2">
              <div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">입력 (변환 전)</p>
                <div className="flex flex-wrap gap-2">
                  {["MP3", "WAV", "M4A", "AAC", "OGG", "FLAC", "WMA", "MP4", "MOV"].map((f) => (
                    <span key={f} className="px-3 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-xs font-semibold text-neutral-600 dark:text-neutral-300">{f}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-2">출력 (변환 후)</p>
                <span className="px-3 py-1 rounded-lg bg-neutral-900 dark:bg-white text-xs font-semibold text-white dark:text-neutral-900">MP3</span>
              </div>
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
          { href: "/document/counter/", label: "글자수 / 맞춤법", desc: "글자수를 세고 한국어 맞춤법을 검사합니다." },
        ]} />
      </main>
      <Footer />
    </div>
  );
}
