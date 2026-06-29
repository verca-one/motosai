import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "이용약관 | JpgMono",
  description: "JpgMono 서비스 이용약관입니다.",
  alternates: { canonical: "https://jpgmono.com/terms/" },
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-16">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-10">
          <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</Link>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">이용약관</span>
        </nav>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">이용약관</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-10">최종 업데이트: 2026년 6월 30일</p>

        <div className="space-y-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제1조 (목적)</h2>
            <p>
              본 약관은 JpgMono(이하 "서비스")가 제공하는 온라인 도구 서비스의 이용 조건 및 절차,
              이용자와 서비스 간의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제2조 (서비스 이용)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>서비스는 회원가입 없이 무료로 이용할 수 있습니다.</li>
              <li>서비스는 브라우저 기반으로 제공되며, 별도의 설치가 필요하지 않습니다.</li>
              <li>서비스 이용에 필요한 인터넷 연결 비용은 이용자가 부담합니다.</li>
              <li>이용자는 서비스를 합법적인 목적으로만 사용해야 합니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제3조 (금지 행위)</h2>
            <p>이용자는 다음 행위를 해서는 안 됩니다.</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>타인의 저작권, 초상권 등 지적재산권을 침해하는 파일 처리</li>
              <li>불법 콘텐츠(음란물, 폭력물 등)를 포함한 파일 처리</li>
              <li>서비스의 정상적인 운영을 방해하는 행위</li>
              <li>서비스를 이용하여 영리 목적의 무단 복제, 재판매 행위</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제4조 (서비스 변경 및 중단)</h2>
            <p>
              서비스는 사전 고지 없이 서비스 내용을 변경하거나, 일시적으로 또는 영구적으로 서비스를 중단할 수 있습니다.
              서비스 변경 또는 중단으로 인한 손해에 대해 서비스는 책임지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제5조 (면책 사항)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>서비스는 처리 결과물의 정확성·완전성을 보장하지 않습니다.</li>
              <li>브라우저 오류, 인터넷 연결 문제 등으로 인한 작업 데이터 손실에 대해 서비스는 책임지지 않습니다.</li>
              <li>이용자가 서비스를 통해 처리한 파일의 저작권 침해 등 법적 문제는 이용자 본인에게 있습니다.</li>
              <li>서비스는 광고(Google AdSense 등)를 포함할 수 있으며, 광고 내용에 대한 책임은 광고주에게 있습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제6조 (준거법 및 분쟁 해결)</h2>
            <p>본 약관은 대한민국 법률에 따라 해석되며, 분쟁 발생 시 관할 법원은 서비스 운영자의 소재지 법원으로 합니다.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">제7조 (문의)</h2>
            <p>약관에 관한 문의는 <Link href="/contact/" className="text-neutral-800 dark:text-neutral-200 underline hover:no-underline">문의하기</Link> 페이지를 이용해 주세요.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
