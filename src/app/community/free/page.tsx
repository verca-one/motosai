import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommunityBoard from "@/components/community/CommunityBoard";

export const metadata: Metadata = {
  title: "자유 게시판 | JpgMono",
  description: "JpgMono 자유 게시판입니다.",
};

export default function FreeBoardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        <nav className="flex items-center gap-2 text-sm text-neutral-400 dark:text-neutral-500 mb-8">
          <a href="/" className="hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">홈</a>
          <span>/</span>
          <span className="text-neutral-700 dark:text-neutral-300">자유 게시판</span>
        </nav>
        <div className="bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-6 min-h-[600px] flex flex-col">
          <CommunityBoard fullPage />
        </div>
      </main>
      <Footer />
    </div>
  );
}
