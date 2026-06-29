import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-neutral-100 dark:border-neutral-800 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">이미지 도구</p>
            <ul className="space-y-2">
              <li><Link href="/image/resize/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">이미지 사이즈 변경</Link></li>
              <li><Link href="/image/nuki/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">누끼따기 / 배경 제거</Link></li>
              <li><Link href="/image/crop/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">이미지 크롭</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">오디오 도구</p>
            <ul className="space-y-2">
              <li><Link href="/audio/convert/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">MP3 변환</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">문서 도구</p>
            <ul className="space-y-2">
              <li><Link href="/document/counter/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">글자수 / 맞춤법</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">서비스 안내</p>
            <ul className="space-y-2">
              <li><Link href="/about/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">사이트 소개</Link></li>
              <li><Link href="/contact/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">문의하기</Link></li>
              <li><Link href="/privacy/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">개인정보처리방침</Link></li>
              <li><Link href="/terms/" className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">이용약관</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400 dark:text-neutral-600">
          <span>© 2026 JpgMono. 무료로 제공됩니다.</span>
          <span>브라우저에서 바로 사용 · 파일이 서버로 전송되지 않습니다</span>
        </div>
      </div>
    </footer>
  );
}
