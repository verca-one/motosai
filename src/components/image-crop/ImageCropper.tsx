"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DropZone from "@/components/image-resize/DropZone";

type Stage = "idle" | "preview" | "cropping" | "cropped" | "save-area";
interface ImgInfo { src: string; width: number; height: number; name: string; }
interface CropBox { x: number; y: number; w: number; h: number; }
type Handle = "nw"|"n"|"ne"|"e"|"se"|"s"|"sw"|"w"|"move"|"new";

const HS = 8;
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

const inputCls = "w-24 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white text-center";

export default function ImageCropper() {
  const [stage, setStage] = useState<Stage>("idle");
  const [original, setOriginal] = useState<ImgInfo | null>(null);
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, w: 0, h: 0 });
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);
  const [croppedSize, setCroppedSize] = useState({ w: 0, h: 0 });
  const [saveW, setSaveW] = useState(0);
  const [saveH, setSaveH] = useState(0);

  const displayImgRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const cropBoxRef = useRef(cropBox);
  const dragRef = useRef<{ type: Handle; sx: number; sy: number; orig: CropBox } | null>(null);

  useEffect(() => { cropBoxRef.current = cropBox; }, [cropBox]);

  const getScale = useCallback(() => {
    const img = displayImgRef.current;
    if (!img) return { sx: 1, sy: 1 };
    return { sx: img.clientWidth / img.naturalWidth, sy: img.clientHeight / img.naturalHeight };
  }, []);

  const syncOverlaySize = useCallback(() => {
    const img = displayImgRef.current;
    const canvas = overlayRef.current;
    if (!img || !canvas) return false;
    if (canvas.width !== img.clientWidth || canvas.height !== img.clientHeight) {
      canvas.width = img.clientWidth;
      canvas.height = img.clientHeight;
    }
    return true;
  }, []);

  const draw = useCallback((box?: CropBox) => {
    const canvas = overlayRef.current;
    if (!syncOverlaySize() || !canvas) return;
    const b = box ?? cropBoxRef.current;
    const ctx = canvas.getContext("2d")!;
    const { sx, sy } = getScale();
    const cw = canvas.width, ch = canvas.height;
    const bx = b.x * sx, by = b.y * sy, bw = b.w * sx, bh = b.h * sy;

    ctx.clearRect(0, 0, cw, ch);
    ctx.fillStyle = "rgba(0,0,0,0.48)";
    ctx.fillRect(0, 0, cw, by);
    ctx.fillRect(0, by + bh, cw, ch - by - bh);
    ctx.fillRect(0, by, bx, bh);
    ctx.fillRect(bx + bw, by, cw - bx - bw, bh);

    ctx.strokeStyle = "white"; ctx.lineWidth = 1.5;
    ctx.strokeRect(bx, by, bw, bh);

    ctx.strokeStyle = "rgba(255,255,255,0.22)"; ctx.lineWidth = 0.7;
    ctx.beginPath();
    for (let i = 1; i < 3; i++) {
      ctx.moveTo(bx + bw * i / 3, by); ctx.lineTo(bx + bw * i / 3, by + bh);
      ctx.moveTo(bx, by + bh * i / 3); ctx.lineTo(bx + bw, by + bh * i / 3);
    }
    ctx.stroke();

    const pts = [
      [bx, by], [bx + bw/2, by], [bx + bw, by],
      [bx + bw, by + bh/2], [bx + bw, by + bh],
      [bx + bw/2, by + bh], [bx, by + bh], [bx, by + bh/2],
    ];
    ctx.fillStyle = "white"; ctx.strokeStyle = "rgba(0,0,0,0.25)"; ctx.lineWidth = 1;
    pts.forEach(([hx, hy]) => {
      ctx.fillRect(hx - HS/2, hy - HS/2, HS, HS);
      ctx.strokeRect(hx - HS/2, hy - HS/2, HS, HS);
    });
  }, [getScale, syncOverlaySize]);

  // Redraw on cropBox change while cropping
  useEffect(() => { if (stage === "cropping") draw(); }, [cropBox, stage, draw]);

  // Sync overlay canvas size when window resizes
  useEffect(() => {
    if (stage !== "cropping") return;
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [stage, draw]);

  const handleFile = useCallback((file: File) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setOriginal({ src: url, width: img.naturalWidth, height: img.naturalHeight, name: file.name });
      setStage("preview");
      setCroppedSrc(null);
    };
    img.src = url;
  }, []);

  function startCrop() {
    const box = { x: 0, y: 0, w: original!.width, h: original!.height };
    cropBoxRef.current = box;
    setCropBox(box);
    setStage("cropping");
    // Draw after image renders in cropping stage
    setTimeout(() => draw(box), 50);
  }

  function getHandle(cx: number, cy: number, box: CropBox): Handle {
    const { sx, sy } = getScale();
    const bx = box.x * sx, by = box.y * sy, bw = box.w * sx, bh = box.h * sy;
    const t = HS + 4;
    const nL = Math.abs(cx - bx) < t, nR = Math.abs(cx - bx - bw) < t;
    const nT = Math.abs(cy - by) < t, nB = Math.abs(cy - by - bh) < t;
    const mH = Math.abs(cx - bx - bw/2) < t, mV = Math.abs(cy - by - bh/2) < t;
    if (nL && nT) return "nw"; if (mH && nT) return "n"; if (nR && nT) return "ne";
    if (nR && mV) return "e"; if (nR && nB) return "se"; if (mH && nB) return "s";
    if (nL && nB) return "sw"; if (nL && mV) return "w";
    if (cx > bx && cx < bx + bw && cy > by && cy < by + bh) return "move";
    return "new";
  }

  function getXY(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = overlayRef.current!.getBoundingClientRect();
    return { cx: e.clientX - r.left, cy: e.clientY - r.top };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    const { cx, cy } = getXY(e);
    dragRef.current = { type: getHandle(cx, cy, cropBoxRef.current), sx: cx, sy: cy, orig: { ...cropBoxRef.current } };
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const { cx, cy } = getXY(e);
    if (!dragRef.current) {
      const m: Record<string, string> = { nw:"nw-resize",n:"n-resize",ne:"ne-resize",e:"e-resize",se:"se-resize",s:"s-resize",sw:"sw-resize",w:"w-resize",move:"move",new:"crosshair" };
      overlayRef.current!.style.cursor = m[getHandle(cx, cy, cropBoxRef.current)];
      return;
    }
    const { type, sx, sy, orig } = dragRef.current;
    const { sx: scX, sy: scY } = getScale();
    const dx = (cx - sx) / scX, dy = (cy - sy) / scY;
    const iw = original!.width, ih = original!.height;
    let { x, y, w, h } = orig;

    if (type === "new") {
      x = clamp(Math.min(sx, cx) / scX, 0, iw); y = clamp(Math.min(sy, cy) / scY, 0, ih);
      w = clamp(Math.abs(cx - sx) / scX, 1, iw - x); h = clamp(Math.abs(cy - sy) / scY, 1, ih - y);
    } else if (type === "move") {
      x = clamp(orig.x + dx, 0, iw - orig.w); y = clamp(orig.y + dy, 0, ih - orig.h);
    } else {
      if (type.includes("e")) w = clamp(orig.w + dx, 10, iw - orig.x);
      if (type.includes("s")) h = clamp(orig.h + dy, 10, ih - orig.y);
      if (type.includes("w")) { const nx = clamp(orig.x + dx, 0, orig.x + orig.w - 10); w = orig.w + orig.x - nx; x = nx; }
      if (type.includes("n")) { const ny = clamp(orig.y + dy, 0, orig.y + orig.h - 10); h = orig.h + orig.y - ny; y = ny; }
    }
    const nb = { x, y, w, h };
    cropBoxRef.current = nb;
    draw(nb);
  }

  function onMouseUp() {
    if (!dragRef.current) return;
    setCropBox({ ...cropBoxRef.current });
    dragRef.current = null;
  }

  function applyCrop() {
    const img = new Image();
    img.onload = () => {
      const { x, y, w, h } = cropBoxRef.current;
      const rw = Math.round(w), rh = Math.round(h);
      const out = document.createElement("canvas");
      out.width = rw; out.height = rh;
      const ctx = out.getContext("2d")!;
      ctx.clearRect(0, 0, rw, rh);
      ctx.drawImage(img, Math.round(x), Math.round(y), rw, rh, 0, 0, rw, rh);
      setCroppedSrc(out.toDataURL("image/png"));
      setCroppedSize({ w: rw, h: rh });
      setSaveW(rw); setSaveH(rh);
      setStage("cropped");
    };
    img.src = original!.src;
  }

  function autoSave() {
    const a = document.createElement("a");
    a.href = croppedSrc!;
    a.download = `${original!.name.replace(/\.[^.]+$/, "")}_crop.png`;
    a.click();
  }

  function savePNG() {
    const img = new Image();
    img.onload = () => {
      const out = document.createElement("canvas");
      out.width = saveW; out.height = saveH;
      const ctx = out.getContext("2d")!;
      ctx.clearRect(0, 0, saveW, saveH);
      const ox = Math.round((saveW - img.naturalWidth) / 2);
      const oy = Math.round((saveH - img.naturalHeight) / 2);
      ctx.drawImage(img, ox, oy);
      const a = document.createElement("a");
      a.href = out.toDataURL("image/png");
      a.download = `${original!.name.replace(/\.[^.]+$/, "")}_crop.png`;
      a.click();
    };
    img.src = croppedSrc!;
  }

  /* ── idle ── */
  if (stage === "idle") return <DropZone onFile={handleFile} />;

  /* ── preview ── */
  if (stage === "preview" && original) return (
    <div className="space-y-4">
      <div className="relative inline-block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={displayImgRef} src={original.src} alt="원본" className="w-full h-auto block rounded-2xl border border-neutral-100 dark:border-neutral-800" />
        <button onClick={startCrop}
          title="크롭 시작"
          className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-sm hover:bg-white dark:hover:bg-neutral-800 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M5 1v12h12"/><path d="M1 5h12v12"/>
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-neutral-500">
        <span className="font-mono">{original.width} × {original.height} px</span>
        <span>·</span>
        <span>크롭 아이콘을 눌러 영역을 선택하세요</span>
      </div>
      <button onClick={() => { setOriginal(null); setStage("idle"); }}
        className="text-sm text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
        ← 다른 이미지 선택
      </button>
    </div>
  );

  /* ── cropping ── */
  if (stage === "cropping" && original) return (
    <div className="space-y-4">
      <div className="relative inline-block w-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={displayImgRef} src={original.src} alt="원본" className="w-full h-auto block rounded-2xl border border-neutral-100 dark:border-neutral-800" onLoad={() => draw()} />
        <canvas ref={overlayRef}
          onMouseDown={onMouseDown} onMouseMove={onMouseMove}
          onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
          className="absolute inset-0 w-full h-full rounded-2xl"
          style={{ touchAction: "none" }} />
      </div>

      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 flex items-center gap-3 flex-wrap">
        <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500 mr-auto">
          선택: {Math.round(cropBox.w)} × {Math.round(cropBox.h)} px
          &nbsp;·&nbsp; 위치: ({Math.round(cropBox.x)}, {Math.round(cropBox.y)})
        </span>
        <button onClick={() => setStage("preview")}
          className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          취소
        </button>
        <button onClick={applyCrop}
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
          크롭 적용
        </button>
      </div>
    </div>
  );

  /* ── cropped ── */
  if (stage === "cropped" && croppedSrc) return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={croppedSrc} alt="크롭 결과" className="block w-full h-auto" />
      </div>
      <p className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
        크롭 크기: {croppedSize.w} × {croppedSize.h} px
      </p>

      <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 flex items-center gap-3 flex-wrap">
        <button onClick={() => setStage("cropping")}
          className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          ↩ 다시 크롭
        </button>
        <div className="flex-1" />
        <button onClick={autoSave}
          className="px-4 py-2 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
          PNG 저장
        </button>
      </div>
    </div>
  );

  /* ── save-area ── */
  if (stage === "save-area" && croppedSrc) {
    const offX = Math.round((saveW - croppedSize.w) / 2);
    const offY = Math.round((saveH - croppedSize.h) / 2);
    return (
      <div className="space-y-5">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          최종 PNG 캔버스 크기를 지정하세요. 크롭 이미지는 가운데 배치되고, 빈 공간은 투명으로 저장됩니다.
        </p>

        {/* Size inputs */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 dark:text-neutral-500">가로 (px)</label>
            <input type="number" min={1} max={8000} value={saveW}
              onChange={(e) => setSaveW(Math.max(1, Number(e.target.value)))}
              className={inputCls} />
          </div>
          <span className="text-neutral-300 dark:text-neutral-600 mt-4">×</span>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-neutral-400 dark:text-neutral-500">세로 (px)</label>
            <input type="number" min={1} max={8000} value={saveH}
              onChange={(e) => setSaveH(Math.max(1, Number(e.target.value)))}
              className={inputCls} />
          </div>
          <button onClick={() => { setSaveW(croppedSize.w); setSaveH(croppedSize.h); }}
            className="mt-4 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            원본 크롭 크기로
          </button>
          <span className="mt-4 text-xs text-neutral-400 dark:text-neutral-500">
            이미지 위치: ({offX}, {offY})
          </span>
        </div>

        {/* Preview */}
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden"
          style={{ background: "repeating-conic-gradient(#e5e5e5 0% 25%, #fff 0% 50%) 0 0 / 14px 14px" }}>
          <div className="relative" style={{ paddingBottom: `${(saveH / saveW) * 100}%` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={croppedSrc} alt="배치 미리보기"
              style={{
                position: "absolute",
                left: `${(offX / saveW) * 100}%`,
                top: `${(offY / saveH) * 100}%`,
                width: `${(croppedSize.w / saveW) * 100}%`,
                height: `${(croppedSize.h / saveH) * 100}%`,
              }} />
          </div>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500">
          캔버스: {saveW} × {saveH} px &nbsp;·&nbsp; 크롭 이미지: {croppedSize.w} × {croppedSize.h} px
        </p>

        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4 flex items-center gap-3 flex-wrap">
          <button onClick={() => setStage("cropped")}
            className="px-4 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            ← 뒤로
          </button>
          <div className="flex-1" />
          <button onClick={savePNG}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors">
            PNG 저장
          </button>
        </div>
      </div>
    );
  }

  return null;
}
