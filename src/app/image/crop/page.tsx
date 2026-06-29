import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ImageCropper from "@/components/image-crop/ImageCropper";
import ImageToolNav from "@/components/image-nuki/ImageToolNav";

export const metadata = { title: "이미지 크롭 | JpgMono" };

export default function ImageCropPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <ImageToolNav />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">이미지 크롭</h1>
          <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
            원하는 영역을 선택해 잘라내고, 저장 캔버스 크기를 직접 지정할 수 있습니다.
          </p>
        </div>
        <ImageCropper />
      </main>
      <Footer />
    </div>
  );
}
