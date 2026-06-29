import type { Metadata } from "next";
import "./globals.css";
import BackupBanner from "@/components/BackupBanner";

export const metadata: Metadata = {
  title: {
    default: "모토사이 — 무료 온라인 이미지·오디오·문서 도구",
    template: "%s | 모토사이",
  },
  description:
    "이미지 사이즈 변경, 배경 제거(누끼따기), MP3 변환, 글자수 세기, 맞춤법 검사. 설치 없이 브라우저에서 바로 사용하는 무료 웹툴 모음입니다.",
  keywords: ["이미지 사이즈 변경", "누끼따기", "MP3 변환", "글자수 세기", "맞춤법 검사", "무료 온라인 도구"],
  authors: [{ name: "모토사이" }],
  openGraph: {
    siteName: "모토사이",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <BackupBanner />
        {children}
      </body>
    </html>
  );
}
