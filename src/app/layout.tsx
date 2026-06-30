import type { Metadata } from "next";
import "./globals.css";
import BackupBanner from "@/components/BackupBanner";

const BASE_URL = "https://jpgmono.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "JpgMono — 무료 온라인 이미지·오디오·문서 도구",
    template: "%s | JpgMono",
  },
  description:
    "이미지 사이즈 변경, 배경 제거(누끼따기), MP3 변환, 글자수 세기, 맞춤법 검사. 설치 없이 브라우저에서 바로 사용하는 무료 웹툴 모음입니다.",
  keywords: ["이미지 사이즈 변경", "누끼따기", "배경 제거", "MP3 변환", "글자수 세기", "맞춤법 검사", "무료 온라인 도구", "jpgmono"],
  authors: [{ name: "JpgMono" }],
  creator: "JpgMono",
  publisher: "JpgMono",
  openGraph: {
    siteName: "JpgMono",
    type: "website",
    locale: "ko_KR",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "JpgMono — 무료 온라인 이미지·오디오·문서 도구",
    description: "이미지 사이즈 변경, 배경 제거, MP3 변환, 글자수·맞춤법 검사. 브라우저에서 바로 사용하는 무료 웹툴.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" },
  },
  alternates: {
    canonical: BASE_URL,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.json",
  verification: {
    google: "",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "JpgMono",
  url: BASE_URL,
  description: "이미지 사이즈 변경, 배경 제거, MP3 변환, 글자수·맞춤법 검사. 브라우저에서 바로 사용하는 무료 웹툴.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${BASE_URL}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Google AdSense — 정적 HTML에 직접 삽입하여 크롤러가 인식하도록 */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8658921182810502"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-full flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
        <BackupBanner />
        {children}
      </body>
    </html>
  );
}
