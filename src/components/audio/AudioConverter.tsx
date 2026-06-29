"use client";

import { useState, useCallback, useRef } from "react";

type Stage = "idle" | "loaded" | "converting" | "done";

const VALID_EXTS = ["mp3", "wav", "m4a", "aac", "ogg", "flac", "wma", "mp4", "mov"];
const BITRATES = [128, 192, 256, 320];
const SAMPLERATES: { label: string; value: number | null }[] = [
  { label: "자동", value: null },
  { label: "44.1kHz", value: 44100 },
  { label: "48kHz", value: 48000 },
];

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function AudioConverter() {
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [bitrate, setBitrate] = useState(320);
  const [samplerate, setSamplerate] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [outputURL, setOutputURL] = useState<string | null>(null);
  const [outputName, setOutputName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [duration, setDuration] = useState<string | null>(null);

  const ffmpegRef = useRef<import("@ffmpeg/ffmpeg").FFmpeg | null>(null);
  const startTimeRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!VALID_EXTS.includes(ext)) {
      setError("지원하지 않는 파일 형식입니다. (MP3, WAV, M4A, AAC, OGG, FLAC, WMA, MP4, MOV)");
      return;
    }
    setFile(f);
    setError(null);
    setOutputURL(null);
    setDuration(null);
    setStage("loaded");

    // Detect duration via HTMLMediaElement
    const url = URL.createObjectURL(f);
    const el = document.createElement(["mp4", "mov"].includes(ext) ? "video" : "audio");
    el.preload = "metadata";
    el.onloadedmetadata = () => {
      const s = Math.round(el.duration);
      if (isFinite(s)) {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        setDuration(h > 0 ? `${h}:${String(m).padStart(2,"0")}:${String(sec).padStart(2,"0")}` : `${m}:${String(sec).padStart(2,"0")}`);
      }
      URL.revokeObjectURL(url);
    };
    el.onerror = () => URL.revokeObjectURL(url);
    el.src = url;
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const getFFmpeg = useCallback(async () => {
    if (ffmpegRef.current) return ffmpegRef.current;

    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpeg();
    const base = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";

    setProgressLabel("FFmpeg 로딩 중...");
    await ffmpeg.load({
      coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegRef.current = ffmpeg;
    return ffmpeg;
  }, []);

  const convert = useCallback(async () => {
    if (!file) return;
    setStage("converting");
    setProgress(0);
    setProgressLabel("FFmpeg 로딩 중...");
    setTimeLeft(null);
    setError(null);
    startTimeRef.current = Date.now();

    try {
      const ffmpeg = await getFFmpeg();
      const { fetchFile } = await import("@ffmpeg/util");

      ffmpeg.on("progress", ({ progress: p }: { progress: number }) => {
        const pct = Math.min(99, Math.round(p * 100));
        setProgress(pct);
        setProgressLabel("변환 중...");

        if (p > 0.02) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          const total = elapsed / p;
          const rem = Math.max(0, total - elapsed);
          setTimeLeft(rem > 1 ? `약 ${Math.round(rem)}초 남음` : null);
        }
      });

      const ext = file.name.split(".").pop() ?? "mp3";
      const inputName = `input.${ext}`;
      setProgressLabel("파일 읽는 중...");
      await ffmpeg.writeFile(inputName, await fetchFile(file));

      const args = ["-i", inputName, "-ab", `${bitrate}k`, "-codec:a", "libmp3lame"];
      if (samplerate) args.push("-ar", String(samplerate));
      args.push("-vn", "output.mp3");

      setProgressLabel("변환 중...");
      await ffmpeg.exec(args);

      setProgress(100);
      setProgressLabel("완료!");
      setTimeLeft(null);

      const data = await ffmpeg.readFile("output.mp3") as Uint8Array;
      const blob = new Blob([data.buffer as ArrayBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);

      setOutputURL(url);
      setOutputName(file.name.replace(/\.[^.]+$/, "") + ".mp3");
      setStage("done");

      await ffmpeg.deleteFile(inputName).catch(() => {});
      await ffmpeg.deleteFile("output.mp3").catch(() => {});
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "변환 중 오류가 발생했습니다.");
      setStage("loaded");
    }
  }, [file, bitrate, samplerate, getFFmpeg]);

  const download = useCallback(() => {
    if (!outputURL) return;
    const a = document.createElement("a");
    a.href = outputURL;
    a.download = outputName;
    a.click();
  }, [outputURL, outputName]);

  const reset = useCallback(() => {
    setFile(null);
    setOutputURL(null);
    setStage("idle");
    setError(null);
    setProgress(0);
    setProgressLabel("");
    setDuration(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">MP3 변환</h1>
        <p className="mt-1 text-sm text-neutral-400 dark:text-neutral-500">
          오디오·동영상 파일을 MP3로 변환합니다. 파일이 서버로 전송되지 않습니다.
        </p>
        {file && stage !== "idle" && (
          <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">
            <span className="font-medium truncate">{file.name}</span>
            <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
            <span className="text-neutral-500">{file.name.split(".").pop()?.toUpperCase()}</span>
          </p>
        )}
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => stage === "idle" && inputRef.current?.click()}
        className={`flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-12 transition-colors ${
          isDragging
            ? "border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-800/50"
            : "border-neutral-200 dark:border-neutral-700"
        } ${stage === "idle" ? "cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-500" : ""}`}
      >
        {stage === "idle" ? (
          <>
            <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">파일을 드래그하거나 클릭해서 업로드</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">MP3 · WAV · M4A · AAC · OGG · FLAC · WMA · MP4 · MOV</p>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full max-w-sm">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18V5l12-2v13" />
                <circle cx="6" cy="18" r="3" />
                <circle cx="18" cy="16" r="3" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{file?.name}</p>
              <p className="text-xs text-neutral-400">{file ? formatSize(file.size) : ""}</p>
            </div>
            {stage !== "converting" && (
              <button onClick={(e) => { e.stopPropagation(); reset(); }}
                className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 shrink-0 transition-colors">
                변경
              </button>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" accept=".mp3,.wav,.m4a,.aac,.ogg,.flac,.wma,.mp4,.mov,audio/*,video/mp4,video/quicktime"
          className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
      </div>

      {/* File info */}
      {file && stage !== "idle" && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "형식", value: file.name.split(".").pop()?.toUpperCase() ?? "-" },
            { label: "용량", value: formatSize(file.size) },
            { label: "길이", value: duration ?? "측정 중..." },
          ].map((item) => (
            <div key={item.label} className="rounded-xl bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5">
              <p className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">{item.label}</p>
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Options */}
      {(stage === "loaded" || stage === "done") && (
        <div className="grid grid-cols-2 gap-4">
          {/* Bitrate */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">비트레이트</p>
            <div className="flex flex-col gap-1.5">
              {BITRATES.map((b) => (
                <button key={b} onClick={() => setBitrate(b)} disabled={(stage as string) === "converting"}
                  className={`px-3 py-2 text-sm rounded-xl border text-left transition-colors ${bitrate === b ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white" : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400"}`}>
                  {b} kbps{b === 320 ? " (최고)" : b === 128 ? " (최소)" : ""}
                </button>
              ))}
            </div>
          </div>

          {/* Samplerate */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">샘플레이트</p>
            <div className="flex flex-col gap-1.5">
              {SAMPLERATES.map((s) => (
                <button key={String(s.value)} onClick={() => setSamplerate(s.value)} disabled={(stage as string) === "converting"}
                  className={`px-3 py-2 text-sm rounded-xl border text-left transition-colors ${samplerate === s.value ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white" : "border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-neutral-400"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Convert button */}
      {stage === "loaded" && (
        <button onClick={convert}
          className="w-full py-3 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity">
          MP3 변환
        </button>
      )}

      {/* Progress */}
      {stage === "converting" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">{progressLabel}</span>
            <span className="font-semibold text-neutral-900 dark:text-white">{progress}%</span>
          </div>
          <div className="h-2 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full bg-neutral-900 dark:bg-white rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          {timeLeft && <p className="text-xs text-neutral-400 text-center">{timeLeft}</p>}
        </div>
      )}

      {/* Done */}
      {stage === "done" && outputURL && (
        <div className="space-y-3">
          {/* Audio preview */}
          <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4">
            <p className="text-xs text-neutral-400 mb-2">{outputName}</p>
            <audio controls src={outputURL} className="w-full" />
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={download}
              className="w-full py-2.5 px-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 2v8M5 7l3 3 3-3" />
                <path d="M2 12h12" />
              </svg>
              {outputName} 다운로드
            </button>
            <button onClick={() => { setStage("loaded"); setOutputURL(null); }}
              className="w-full py-2.5 px-4 text-sm text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              다시 변환 (옵션 변경)
            </button>
            <button onClick={reset}
              className="w-full py-2 text-sm text-neutral-400 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
              다른 파일 변환
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
