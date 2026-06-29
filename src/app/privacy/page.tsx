import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "개인정보처리방침 | JpgMono",
  description: "JpgMono 서비스의 개인정보처리방침입니다.",
  alternates: { canonical: "https://jpgmono.com/privacy/" },
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-16">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-10">
          <Link href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</Link>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">개인정보처리방침</span>
        </nav>

        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">개인정보처리방침</h1>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-10">최종 업데이트: 2026년 6월 30일</p>

        <div className="space-y-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">1. 수집하는 개인정보</h2>
            <p>
              JpgMono는 회원가입, 로그인, 결제 등의 기능을 제공하지 않으며,
              이용자의 이름, 이메일, 연락처 등 개인 식별 정보를 직접 수집하지 않습니다.
            </p>
            <p className="mt-2">
              서비스 이용 과정에서 업로드한 파일(이미지, 오디오, 문서 등)은 모두 브라우저(기기) 안에서만 처리되며,
              외부 서버로 전송·저장되지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">2. 자동 수집 정보</h2>
            <p>서비스 품질 개선 및 통계 분석을 위해 아래와 같은 정보가 자동으로 수집될 수 있습니다.</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>접속 IP 주소</li>
              <li>브라우저 종류 및 버전</li>
              <li>방문 페이지 및 이용 시간 (Google Analytics 등 분석 도구 사용 시)</li>
              <li>광고 관련 쿠키 (Google AdSense 사용 시)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">3. 쿠키(Cookie) 사용</h2>
            <p>
              JpgMono는 서비스 편의 개선을 위해 쿠키를 사용할 수 있습니다.
              쿠키는 개인을 식별하는 정보를 포함하지 않으며, 브라우저 설정에서 거부할 수 있습니다.
              단, 쿠키를 거부하면 일부 기능이 정상 동작하지 않을 수 있습니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">4. 제3자 서비스</h2>
            <p>JpgMono는 아래와 같은 제3자 서비스를 사용할 수 있으며, 해당 서비스의 개인정보처리방침이 적용됩니다.</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>Google Analytics (방문자 통계 분석)</li>
              <li>Google AdSense (광고 서비스)</li>
              <li>Cloudflare Pages (정적 사이트 호스팅)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">5. 개인정보의 보유 및 이용 기간</h2>
            <p>
              JpgMono는 이용자의 개인정보를 별도로 보유하지 않습니다.
              자동 수집 정보(접속 로그 등)는 분석 서비스 제공 업체의 정책에 따라 관리됩니다.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">6. 개인정보보호 책임자</h2>
            <p>개인정보 관련 문의는 <Link href="/contact/" className="text-neutral-800 dark:text-neutral-200 underline hover:no-underline">문의하기</Link> 페이지를 통해 연락해 주세요.</p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">7. 방침 변경</h2>
            <p>본 개인정보처리방침은 관련 법령 변경 또는 서비스 정책 변경에 따라 수정될 수 있으며, 변경 시 본 페이지에 공지합니다.</p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
