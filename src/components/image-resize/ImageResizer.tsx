"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DropZone from "./DropZone";
import SizePresets from "./SizePresets";
import ResizeOptions, { BgColor } from "./ResizeOptions";
import ImagePreview from "./ImagePreview";
import DownloadButtons from "./DownloadButtons";

interface ImageInfo {
  src: string;
  width: number;
  height: number;
  size: number;
  name: string;
}

export default function ImageResizer() {
  const [original, setOriginal] = useState<ImageInfo | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewSize, setPreviewSize] = useState<number>(0);
  const [outputWidth, setOutputWidth] = useState(0);
  const [outputHeight, setOutputHeight] = useState(0);

  const [targetWidth, setTargetWidth] = useState(512);
  const [targetHeight, setTargetHeight] = useState(512);
  const [customMode, setCustomMode] = useState(false);
  const [keepRatio, setKeepRatio] = useState(true);
  const [centerAlign, setCenterAlign] = useState(true);
  const [bgColor, setBgColor] = useState<BgColor>("white");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalRatioRef = useRef(1);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      originalRatioRef.current = img.naturalWidth / img.naturalHeight;
      setOriginal({ src: url, width: img.naturalWidth, height: img.naturalHeight, size: file.size, name: file.name });
      setTargetWidth(img.naturalWidth);
      setTargetHeight(img.naturalHeight);
      setCustomMode(false);
    };
    img.src = url;
  }, []);

  const handlePreset = useCallback((w: number, h: number) => {
    setTargetWidth(w);
    setTargetHeight(h);
    setCustomMode(false);
  }, []);

  const handleWidthChange = useCallback((w: number) => {
    setTargetWidth(w);
    if (keepRatio && w > 0) {
      setTargetHeight(Math.round(w / originalRatioRef.current));
    }
  }, [keepRatio]);

  const handleHeightChange = useCallback((h: number) => {
    setTargetHeight(h);
    if (keepRatio && h > 0) {
      setTargetWidth(Math.round(h * originalRatioRef.current));
    }
  }, [keepRatio]);

  // Render preview whenever settings change
  useEffect(() => {
    if (!original || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    const w = Math.max(1, targetWidth);
    const h = Math.max(1, targetHeight);

    const img = new Image();
    img.onload = () => {
      canvas.width = w;
      canvas.height = h;

      if (bgColor === "transparent") {
        ctx.clearRect(0, 0, w, h);
      } else {
        ctx.fillStyle = bgColor === "white" ? "#ffffff" : "#000000";
        ctx.fillRect(0, 0, w, h);
      }

      let drawW = w;
      let drawH = h;
      let drawX = 0;
      let drawY = 0;

      if (keepRatio) {
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = w / h;
        if (imgRatio > canvasRatio) {
          drawW = w;
          drawH = Math.round(w / imgRatio);
        } else {
          drawH = h;
          drawW = Math.round(h * imgRatio);
        }
        if (centerAlign) {
          drawX = Math.round((w - drawW) / 2);
          drawY = Math.round((h - drawH) / 2);
        }
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const dataUrl = canvas.toDataURL("image/png");
      setPreview(dataUrl);
      setOutputWidth(w);
      setOutputHeight(h);
      const byteStr = atob(dataUrl.split(",")[1]);
      setPreviewSize(byteStr.length);
    };
    img.src = original.src;
  }, [original, targetWidth, targetHeight, keepRatio, centerAlign, bgColor]);

  const handleDownload = useCallback(
    (format: "png" | "jpg" | "webp") => {
      if (!canvasRef.current) return;
      const mimeMap = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" };
      const quality = format === "jpg" ? 0.92 : undefined;
      const dataUrl = canvasRef.current.toDataURL(mimeMap[format], quality);
      const a = document.createElement("a");
      const baseName = (original?.name ?? "image").replace(/\.[^.]+$/, "");
      a.href = dataUrl;
      a.download = `${baseName}_${outputWidth}x${outputHeight}.${format}`;
      a.click();
    },
    [original, outputWidth, outputHeight]
  );

  return (
    <div className="w-full">
      <canvas ref={canvasRef} className="hidden" />

      {!original ? (
        <DropZone onFile={handleFile} />
      ) : (
        <div className="space-y-8">
          {/* Preview grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImagePreview
              label="원본"
              src={original.src}
              width={original.width}
              height={original.height}
              size={original.size}
            />
            {preview && (
              <ImagePreview
                label="변환 결과"
                src={preview}
                width={outputWidth}
                height={outputHeight}
                size={previewSize}
              />
            )}
          </div>

          {/* Controls card */}
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-6 space-y-6">
            <SizePresets
              width={targetWidth}
              height={targetHeight}
              customMode={customMode}
              onPreset={handlePreset}
              onCustomMode={() => setCustomMode(true)}
              onWidthChange={handleWidthChange}
              onHeightChange={handleHeightChange}
            />

            <div className="border-t border-neutral-200 dark:border-neutral-700" />

            <ResizeOptions
              keepRatio={keepRatio}
              centerAlign={centerAlign}
              bgColor={bgColor}
              onKeepRatio={setKeepRatio}
              onCenterAlign={setCenterAlign}
              onBgColor={setBgColor}
            />

            <div className="border-t border-neutral-200 dark:border-neutral-700" />

            <DownloadButtons onDownload={handleDownload} disabled={!preview} />
          </div>

          {/* Change image */}
          <div className="flex justify-center">
            <button
              onClick={() => setOriginal(null)}
              className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors underline underline-offset-2"
            >
              다른 이미지 선택
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
