"use client";

import { useState, useCallback, useRef } from "react";
import {
  blobToImageData, imageDataToBlob, detectBgColor, applyPipeline,
  AUTO_DEFAULTS, type MatteType,
} from "./edgeUtils";

type Stage = "idle" | "preview" | "processing" | "done";
type BgOption = "transparent" | "white" | "black" | "custom";

export default function BackgroundRemover() {
  const [stage, setStage] = useState<Stage>("idle");
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [resultSrc, setResultSrc] = useState<string | null>(null);
  const [processedSrc, setProcessedSrc] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState<BgOption>("transparent");
  const [customColor, setCustomColor] = useState("#ffffff");
  const [showOriginal, setShowOriginal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refineError, setRefineError] = useState<string | null>(null);

  // Advanced edge settings
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [shrink, setShrink] = useState(1);
  const [feather, setFeather] = useState(0);
  const [defringeRadius, setDefringeRadius] = useState(2);
  const [matteType, setMatteType] = useState<MatteType | null>(null);

  const fileNameRef = useRef("");
  const fileRef = useRef<File | null>(null);
  const resultBlobRef = useRef<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    fileNameRef.current = file.name;
    fileRef.current = file;
    const url = URL.createObjectURL(file);
    setOriginalSrc(url);
    setResultSrc(null);
    setProcessedSrc(null);
    setStage("preview");
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) handleFile(file);
  }, [handleFile]);

  const runNukki = useCallback(async () => {
    if (!fileRef.current) return;
    setStage("processing");
    setProgress(0);
    setProgressLabel("모델 로딩 중...");
    setErrorMsg(null);
    setProcessedSrc(null);

    try {
      const { removeBackground } = await import("@imgly/background-removal");
      const blob = await removeBackground(fileRef.current, {
        progress: (key: string, current: number, total: number) => {
          if (key.includes("fetch")) setProgressLabel("모델 다운로드 중...");
          else if (key.includes("run")) setProgressLabel("배경 분석 중...");
          else if (key.includes("postprocess")) setProgressLabel("결과 처리 중...");
          if (total > 0) setProgress(Math.round((current / total) * 100));
        },
      });
      resultBlobRef.current = blob;
      setResultSrc(URL.createObjectURL(blob));
      setStage("done");
    } catch (e) {
      console.error(e);
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setStage("preview");
    }
  }, []);

  // Run the edge refinement pipeline on the original nukki result blob
  const runRefine = useCallback(async (opts: typeof AUTO_DEFAULTS) => {
    const blob = resultBlobRef.current;
    const file = fileRef.current;
    if (!blob || !file) return;

    setIsRefining(true);
    setRefineError(null);

    try {
      const { data, w, h } = await blobToImageData(blob);

      let matteColor: [number, number, number] | undefined;
      if (opts.matte === "auto") {
        matteColor = await detectBgColor(file, data, w, h);
      } else if (opts.matte === "white") {
        matteColor = [255, 255, 255];
      } else if (opts.matte === "black") {
        matteColor = [0, 0, 0];
      }

      const processed = applyPipeline(data, w, h, { ...opts, matteColor });
      const outBlob = await imageDataToBlob(processed, w, h);
      setProcessedSrc(URL.createObjectURL(outBlob));
    } catch (e) {
      console.error(e);
      setRefineError(e instanceof Error ? e.message : String(e));
    } finally {
      setIsRefining(false);
    }
  }, []);

  const autoRefine = useCallback(() => {
    runRefine(AUTO_DEFAULTS);
  }, [runRefine]);

  const manualRefine = useCallback(() => {
    runRefine({
      defringe: true,
      defringeRadius,
      cleanAlpha: true,
      shrink,
      feather,
      matte: matteType,
    });
  }, [runRefine, defringeRadius, shrink, feather, matteType]);

  const getComposited = useCallback(async (bg: BgOption, custom: string): Promise<string> => {
    const src = processedSrc ?? resultSrc;
    if (!src) return "";
    if (bg === "transparent") return src;

    const img = new Image();
    await new Promise<void>((res) => { img.onload = () => res(); img.src = src; });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bg === "custom" ? custom : bg === "white" ? "#ffffff" : "#000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  }, [processedSrc, resultSrc]);

  const download = useCallback(async () => {
    const src = await getComposited(bgColor, customColor);
    const a = document.createElement("a");
    a.href = src;
    a.download = `${fileNameRef.current.replace(/\.[^.]+$/, "")}_nukki.png`;
    a.click();
  }, [getComposited, bgColor, customColor]);

  const reset = useCallback(() => {
    setStage("idle");
    setOriginalSrc(null);
    setResultSrc(null);
    setProcessedSrc(null);
    setProgress(0);
    resultBlobRef.current = null;
  }, []);

  const checkerStyle = {
    backgroundImage:
      "linear-gradient(45deg,#ccc 25%,transparent 25%)," +
      "linear-gradient(-45deg,#ccc 25%,transparent 25%)," +
      "linear-gradient(45deg,transparent 75%,#ccc 75%)," +
      "linear-gradient(-45deg,transparent 75%,#ccc 75%)",
    backgroundSize: "16px 16px",
    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
  };

  const displaySrc = processedSrc ?? resultSrc;

  return (
    <div className="space-y-6">
      {/* Upload zone */}
      {stage === "idle" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-16 cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
        >
          <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">이미지를 드래그하거나 클릭해서 업로드</p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500">JPG, PNG, WEBP 지원</p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </div>
      )}

      {/* Preview stage */}
      {stage === "preview" && originalSrc && (
        <div className="space-y-4">
          <div className="rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <img src={originalSrc} alt="원본" className="w-full h-auto block max-h-[480px] object-contain" />
          </div>
          {errorMsg && (
            <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300 break-all">
              <span className="font-semibold">오류: </span>{errorMsg}
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={runNukki}
              className="flex-1 py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
              누끼따기 시작
            </button>
            <button onClick={reset}
              className="py-2.5 px-4 text-sm text-neutral-500 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              다시 선택
            </button>
          </div>
        </div>
      )}

      {/* Processing stage */}
      {stage === "processing" && (
        <div className="flex flex-col items-center gap-6 py-16">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 text-neutral-200 dark:text-neutral-700" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" />
            </svg>
            <svg className="absolute inset-0 animate-spin w-16 h-16 text-neutral-900 dark:text-white" viewBox="0 0 64 64" fill="none" style={{ animationDuration: "1s" }}>
              <path d="M32 4a28 28 0 0 1 28 28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{progressLabel}</p>
            {progress > 0 && <p className="text-xs text-neutral-400 mt-1">{progress}%</p>}
          </div>
          <div className="w-48 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 text-center max-w-xs">
            첫 실행 시 AI 모델을 다운로드합니다. 잠시 기다려 주세요.
          </p>
        </div>
      )}

      {/* Done stage */}
      {stage === "done" && displaySrc && originalSrc && (
        <div className="space-y-5">
          {/* View toggle */}
          <div className="flex justify-center">
            <div className="flex bg-neutral-100 dark:bg-neutral-800 rounded-xl p-1 gap-1">
              <button onClick={() => setShowOriginal(false)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${!showOriginal ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400"}`}>
                {processedSrc ? "정리 결과" : "누끼 결과"}
              </button>
              <button onClick={() => setShowOriginal(true)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${showOriginal ? "bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-500 dark:text-neutral-400"}`}>
                원본
              </button>
            </div>
          </div>

          {/* Image display */}
          <div className="rounded-2xl overflow-hidden" style={!showOriginal ? checkerStyle : { background: "#f5f5f5" }}>
            <img
              src={showOriginal ? originalSrc : displaySrc}
              alt={showOriginal ? "원본" : "결과"}
              className="w-full h-auto block max-h-[480px] object-contain"
            />
          </div>

          {/* ─── 테두리 정리 ─── */}
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="px-4 pt-4 pb-3 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">테두리 정리</p>
                  <p className="text-xs text-neutral-400 mt-0.5">Defringe · Alpha Clean · Shrink 1px 자동 적용</p>
                </div>
                {processedSrc && (
                  <button onClick={() => setProcessedSrc(null)}
                    className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                    원래대로
                  </button>
                )}
              </div>
              {refineError && (
                <p className="text-xs text-red-500 break-all">{refineError}</p>
              )}
              <button onClick={autoRefine} disabled={isRefining}
                className="w-full py-2 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
                {isRefining ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    처리 중...
                  </>
                ) : "테두리 정리 자동 적용"}
              </button>
            </div>

            {/* Advanced settings toggle */}
            <button onClick={() => setShowAdvanced(v => !v)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
              <span>세부 설정</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                className={`transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}>
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>

            {showAdvanced && (
              <div className="px-4 pb-4 pt-3 space-y-4 border-t border-neutral-100 dark:border-neutral-800">
                {/* Shrink */}
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Shrink Edge <span className="font-normal text-neutral-400">(가장자리 안쪽 축소)</span></p>
                  <div className="flex gap-1.5">
                    {([0, 0.5, 1, 2, 3] as number[]).map((v) => (
                      <button key={v} onClick={() => setShrink(v)}
                        className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${shrink === v ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white" : "border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400"}`}>
                        {v === 0 ? "없음" : `${v}px`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Feather */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Feather <span className="font-normal text-neutral-400">(가장자리 부드럽게)</span></p>
                    <span className="text-xs text-neutral-400">{feather}px</span>
                  </div>
                  <input type="range" min={0} max={2} step={0.5} value={feather}
                    onChange={(e) => setFeather(Number(e.target.value))}
                    className="w-full accent-neutral-900 dark:accent-white" />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                    <span>0 (픽셀아트)</span><span>2px</span>
                  </div>
                </div>

                {/* Defringe radius */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Defringe <span className="font-normal text-neutral-400">(테두리 색 제거)</span></p>
                    <span className="text-xs text-neutral-400">{defringeRadius}px</span>
                  </div>
                  <input type="range" min={1} max={5} step={1} value={defringeRadius}
                    onChange={(e) => setDefringeRadius(Number(e.target.value))}
                    className="w-full accent-neutral-900 dark:accent-white" />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-0.5">
                    <span>1px</span><span>5px</span>
                  </div>
                </div>

                {/* Matte removal */}
                <div>
                  <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">Matte 제거 <span className="font-normal text-neutral-400">(배경색 흔적 제거)</span></p>
                  <div className="flex gap-1.5">
                    {([null, "auto", "white", "black"] as (MatteType | null)[]).map((m) => (
                      <button key={String(m)} onClick={() => setMatteType(m)}
                        className={`flex-1 py-1.5 text-xs rounded-lg border transition-colors ${matteType === m ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white" : "border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-400"}`}>
                        {m === null ? "없음" : m === "auto" ? "자동" : m === "white" ? "흰색" : "검정"}
                      </button>
                    ))}
                  </div>
                </div>

                <button onClick={manualRefine} disabled={isRefining}
                  className="w-full py-2 px-4 text-sm font-medium rounded-xl border border-neutral-900 dark:border-white text-neutral-900 dark:text-white hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-900 disabled:opacity-50 transition-colors">
                  {isRefining ? "처리 중..." : "수동 적용"}
                </button>
              </div>
            )}
          </div>

          {/* Background color */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">배경색 넣기</p>
            <div className="flex flex-wrap gap-2">
              {(["transparent", "white", "black", "custom"] as BgOption[]).map((opt) => (
                <button key={opt} onClick={() => setBgColor(opt)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${bgColor === opt ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400"}`}>
                  {opt === "transparent" && <span className="w-3 h-3 rounded-sm border border-neutral-300" style={checkerStyle} />}
                  {opt === "white" && <span className="w-3 h-3 rounded-sm bg-white border border-neutral-300" />}
                  {opt === "black" && <span className="w-3 h-3 rounded-sm bg-black border border-neutral-300" />}
                  {opt === "custom" && <span className="w-3 h-3 rounded-sm border border-neutral-300" style={{ background: customColor }} />}
                  {opt === "transparent" ? "투명" : opt === "white" ? "흰색" : opt === "black" ? "검정" : "직접 선택"}
                </button>
              ))}
              {bgColor === "custom" && (
                <input type="color" value={customColor} onChange={(e) => setCustomColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-neutral-200 dark:border-neutral-700 cursor-pointer p-0.5" />
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-2">
            <button onClick={download}
              className="py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
              PNG 저장
            </button>
            <button onClick={runNukki}
              className="py-2.5 px-4 text-sm text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              다시 누끼따기
            </button>
            <button onClick={reset}
              className="py-2.5 px-4 text-sm text-neutral-500 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              되돌리기 (새 이미지)
            </button>
            <p className="text-xs text-amber-600 dark:text-amber-400 text-center pt-1">
              💾 저장 후에는 반드시 기기에 백업해 주세요. 웹 환경에서는 예기치 않은 오류로 작업 내용이 손실될 수 있습니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
