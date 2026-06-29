"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { runSpellCheck, type SpellError } from "./spellRules";

// ─── Stats ───────────────────────────────────────────────
function computeStats(text: string) {
  const withSpaces = text.length;
  const withoutSpaces = text.replace(/\s/g, "").length;
  const trimmed = text.trim();
  const words = trimmed === "" ? 0 : trimmed.split(/\s+/).filter(Boolean).length;
  const sentenceMatches = trimmed.match(/[^.!?。！？\n]+[.!?。！？]+/g) || [];
  const sentences = trimmed === "" ? 0 : (sentenceMatches.length || (trimmed.length > 0 ? 1 : 0));
  const lines = text === "" ? 1 : text.split("\n").length;
  const paragraphs = trimmed === "" ? 0 : (trimmed.split(/\n\s*\n/).filter(p => p.trim()).length || 1);

  const readSec = Math.round((withoutSpaces / 1000) * 60);
  const speakSec = Math.round((withoutSpaces / 350) * 60);

  const fmt = (s: number) => {
    if (s < 60) return `약 ${s}초`;
    const m = Math.floor(s / 60), r = s % 60;
    return r > 0 ? `약 ${m}분 ${r}초` : `약 ${m}분`;
  };

  const sentList = trimmed.split(/[.!?。！？]+/).map(s => s.trim()).filter(s => s.replace(/\s/g, "").length > 0);
  const avgSentLen = sentList.length > 0
    ? Math.round(sentList.reduce((a, s) => a + s.replace(/\s/g, "").length, 0) / sentList.length)
    : 0;
  const longSentences = sentList.filter(s => s.replace(/\s/g, "").length > 50).length;

  const wordMatches = text.match(/[가-힣]{2,}/g) || [];
  const freq: Record<string, number> = {};
  wordMatches.forEach(w => { freq[w] = (freq[w] || 0) + 1; });
  const repeated = Object.entries(freq).filter(([, n]) => n >= 3).sort((a, b) => b[1] - a[1]).slice(0, 3);

  return { withSpaces, withoutSpaces, words, sentences, lines, paragraphs, readingTime: fmt(readSec), speakingTime: fmt(speakSec), avgSentLen, longSentences, repeated };
}

// ─── Highlighted text renderer ───────────────────────────
function HighlightedText({
  text, errors, selected, onSelect,
}: { text: string; errors: SpellError[]; selected: string | null; onSelect: (e: SpellError, rect: DOMRect) => void }) {
  const active = errors.filter(e => !e.ignored).sort((a, b) => a.start - b.start);
  const segments: React.ReactNode[] = [];
  let pos = 0;
  active.forEach((err, i) => {
    if (err.start > pos) segments.push(<span key={`t${i}`}>{text.slice(pos, err.start)}</span>);
    const isSelected = selected === err.id;
    segments.push(
      <span key={err.id}
        onClick={(e) => { e.stopPropagation(); onSelect(err, (e.target as HTMLElement).getBoundingClientRect()); }}
        className={`cursor-pointer underline decoration-2 rounded-sm px-0.5 transition-colors ${
          err.type === "맞춤법"
            ? isSelected ? "decoration-red-500 bg-red-50 dark:bg-red-900/30" : "decoration-red-400"
            : err.type === "띄어쓰기"
            ? isSelected ? "decoration-yellow-500 bg-yellow-50 dark:bg-yellow-900/30" : "decoration-yellow-400"
            : isSelected ? "decoration-blue-500 bg-blue-50 dark:bg-blue-900/30" : "decoration-blue-400"
        }`}>
        {text.slice(err.start, err.end)}
      </span>
    );
    pos = err.end;
  });
  if (pos < text.length) segments.push(<span key="tail">{text.slice(pos)}</span>);
  return <div className="whitespace-pre-wrap leading-relaxed text-sm text-neutral-800 dark:text-neutral-200 min-h-[240px]">{segments}</div>;
}

// ─── Main component ───────────────────────────────────────
type CheckStage = "idle" | "checking" | "done";

export default function DocumentTool() {
  const [text, setText] = useState("");
  const [checkStage, setCheckStage] = useState<CheckStage>("idle");
  const [errors, setErrors] = useState<SpellError[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [popup, setPopup] = useState<{ error: SpellError; rect: DOMRect } | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const stats = useMemo(() => computeStats(text), [text]);

  // ── File open ──
  const openFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "txt") {
      const t = await file.text();
      setText(t);
    } else if (ext === "docx") {
      const mammoth = await import("mammoth");
      const ab = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer: ab });
      setText(result.value);
    }
    setCheckStage("idle");
    setErrors([]);
  }, []);

  // ── Spell check ──
  const doCheck = useCallback(() => {
    if (!text.trim()) return;
    setCheckStage("checking");
    setTimeout(() => {
      const found = runSpellCheck(text);
      setErrors(found);
      setCheckStage("done");
    }, 400);
  }, [text]);

  // ── Fix single error ──
  const fixError = useCallback((err: SpellError) => {
    const before = text.slice(0, err.start);
    const after = text.slice(err.end);
    const newText = before + err.suggestion + after;
    const diff = err.suggestion.length - err.original.length;
    setText(newText);
    setErrors(prev => prev
      .filter(e => e.id !== err.id)
      .map(e => e.start > err.start ? { ...e, start: e.start + diff, end: e.end + diff } : e)
    );
    setPopup(null);
    setSelectedId(null);
  }, [text]);

  // ── Ignore error ──
  const ignoreError = useCallback((id: string) => {
    setErrors(prev => prev.map(e => e.id === id ? { ...e, ignored: true } : e));
    setPopup(null);
    setSelectedId(null);
  }, []);

  // ── Fix all ──
  const fixAll = useCallback(() => {
    const active = errors.filter(e => !e.ignored).sort((a, b) => b.start - a.start);
    let t = text;
    active.forEach(err => {
      t = t.slice(0, err.start) + err.suggestion + t.slice(err.end);
    });
    setText(t);
    setErrors([]);
    setCheckStage("idle");
    setPopup(null);
  }, [text, errors]);

  // ── Copy ──
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [text]);

  // ── Save TXT ──
  const saveTxt = useCallback(() => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "document.txt"; a.click();
  }, [text]);

  // ── Save DOCX ──
  const saveDocx = useCallback(async () => {
    const { Document, Paragraph, TextRun, Packer } = await import("docx");
    const paragraphs = text.split("\n").map(line =>
      new Paragraph({ children: [new TextRun(line)] })
    );
    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "document.docx"; a.click();
  }, [text]);

  const activeErrors = errors.filter(e => !e.ignored);
  const errorsByType = {
    맞춤법: activeErrors.filter(e => e.type === "맞춤법").length,
    띄어쓰기: activeErrors.filter(e => e.type === "띄어쓰기").length,
    문장부호: activeErrors.filter(e => e.type === "문장부호").length,
  };

  return (
    <div className="space-y-5" onClick={() => { setPopup(null); setSelectedId(null); }}>

      {/* ── Text input area ── */}
      <div className="relative">
        {checkStage === "done" ? (
          <div
            className="w-full min-h-[260px] rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 cursor-text"
            onClick={(e) => { if ((e.target as HTMLElement).tagName === "DIV") { setCheckStage("idle"); setErrors([]); } }}
          >
            <HighlightedText text={text} errors={errors} selected={selectedId}
              onSelect={(err, rect) => { setSelectedId(err.id); setPopup({ error: err, rect }); }} />
            <p className="mt-2 text-xs text-neutral-400">텍스트를 클릭하면 편집 모드로 돌아갑니다</p>
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={e => { setText(e.target.value); setCheckStage("idle"); setErrors([]); }}
            placeholder="텍스트를 입력하거나 붙여넣기 하세요."
            className="w-full min-h-[260px] rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm text-neutral-800 dark:text-neutral-200 placeholder-neutral-300 dark:placeholder-neutral-600 resize-y focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 leading-relaxed"
          />
        )}

        {/* File open button */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <label className="cursor-pointer px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            TXT
            <input type="file" accept=".txt" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) openFile(f); e.target.value = ""; }} />
          </label>
          <label className="cursor-pointer px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
            DOCX
            <input type="file" accept=".docx" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) openFile(f); e.target.value = ""; }} />
          </label>
        </div>
      </div>

      {/* ── Popup ── */}
      {popup && (
        <div className="fixed z-50" style={{ top: popup.rect.bottom + window.scrollY + 8, left: Math.min(popup.rect.left, window.innerWidth - 260) }}
          onClick={e => e.stopPropagation()}>
          <div className="w-60 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl p-4 space-y-3">
            <div className="space-y-1">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${popup.error.type === "맞춤법" ? "bg-red-50 text-red-500" : popup.error.type === "띄어쓰기" ? "bg-yellow-50 text-yellow-600" : "bg-blue-50 text-blue-500"}`}>
                {popup.error.type} 오류
              </span>
              <p className="text-xs text-neutral-400 mt-1">{popup.error.help}</p>
            </div>
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-800 rounded-xl px-3 py-2">
              <span className="text-sm line-through text-red-400">{popup.error.original}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-neutral-400 shrink-0">
                <path d="M3 7h8M8 4l3 3-3 3" />
              </svg>
              <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{popup.error.suggestion}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => fixError(popup.error)}
                className="flex-1 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity">
                수정
              </button>
              <button onClick={() => ignoreError(popup.error.id)}
                className="flex-1 py-1.5 text-xs text-neutral-500 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                무시
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Real-time stats ── */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {[
          { label: "공백 포함", value: stats.withSpaces.toLocaleString() + "자" },
          { label: "공백 제외", value: stats.withoutSpaces.toLocaleString() + "자" },
          { label: "단어", value: stats.words.toLocaleString() + "개" },
          { label: "문장", value: stats.sentences.toLocaleString() + "개" },
          { label: "줄", value: stats.lines.toLocaleString() + "개" },
          { label: "문단", value: stats.paragraphs.toLocaleString() + "개" },
        ].map(item => (
          <div key={item.label} className="rounded-xl bg-neutral-50 dark:bg-neutral-800/60 px-3 py-2.5 text-center">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{item.label}</p>
            <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mt-0.5">{item.value}</p>
          </div>
        ))}
      </div>

      {/* ── Spell check result summary ── */}
      {checkStage === "done" && (
        <div className={`rounded-xl px-4 py-3 flex items-center justify-between ${activeErrors.length === 0 ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700"}`}>
          {activeErrors.length === 0 ? (
            <p className="text-sm font-medium text-green-700 dark:text-green-400">✓ 맞춤법 오류가 없습니다</p>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">오류 {activeErrors.length}개 발견</p>
              {errorsByType.맞춤법 > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-900/30 text-red-500">{errorsByType.맞춤법}개 맞춤법</span>}
              {errorsByType.띄어쓰기 > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600">{errorsByType.띄어쓰기}개 띄어쓰기</span>}
              {errorsByType.문장부호 > 0 && <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-500">{errorsByType.문장부호}개 문장부호</span>}
            </div>
          )}
          {activeErrors.length > 0 && (
            <button onClick={fixAll} className="shrink-0 px-3 py-1.5 text-xs font-semibold bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-90 transition-opacity">
              모두 수정
            </button>
          )}
        </div>
      )}

      {/* ── Action buttons ── */}
      <div className="flex flex-wrap gap-2">
        <button onClick={doCheck} disabled={!text.trim() || checkStage === "checking"}
          className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold rounded-xl hover:opacity-90 disabled:opacity-40 transition-opacity">
          {checkStage === "checking" ? (
            <><svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" opacity="0.3"/><path d="M7 2a5 5 0 0 1 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>검사 중...</>
          ) : "맞춤법 검사"}
        </button>
        {checkStage === "done" && activeErrors.length > 0 && (
          <button onClick={fixAll} className="px-4 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            모두 수정
          </button>
        )}
        <button onClick={copy} disabled={!text}
          className="px-4 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors">
          {copied ? "✓ 복사됨" : "복사"}
        </button>
        <button onClick={saveTxt} disabled={!text}
          className="px-4 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors">
          TXT 저장
        </button>
        <button onClick={saveDocx} disabled={!text}
          className="px-4 py-2 text-sm font-medium border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors">
          DOCX 저장
        </button>
      </div>
      {text && (
        <p className="text-xs text-amber-600 dark:text-amber-400">
          💾 저장 후에는 반드시 기기에 백업해 주세요. 웹 환경에서는 예기치 않은 오류로 작업 내용이 손실될 수 있습니다.
        </p>
      )}

      {/* ── Reading stats panel ── */}
      {text.trim() && (
        <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 p-4">
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-3">실시간 통계</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { label: "읽는 시간", value: stats.readingTime },
              { label: "예상 발표 시간", value: stats.speakingTime },
              { label: "평균 문장 길이", value: stats.avgSentLen > 0 ? `${stats.avgSentLen}자` : "-" },
              { label: "긴 문장 (50자↑)", value: `${stats.longSentences}개` },
            ].map(item => (
              <div key={item.label} className="space-y-0.5">
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500">{item.label}</p>
                <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">{item.value}</p>
              </div>
            ))}
            {stats.repeated.length > 0 && (
              <div className="space-y-0.5 col-span-2 sm:col-span-1">
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500">반복 단어</p>
                <div className="space-y-0.5">
                  {stats.repeated.map(([word, count]) => (
                    <p key={word} className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                      <span className="font-normal text-neutral-500">'{word}'</span> {count}회
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Error list ── */}
      {checkStage === "done" && activeErrors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">오류 목록</p>
          <div className="space-y-1.5">
            {activeErrors.map(err => (
              <div key={err.id}
                onClick={e => { e.stopPropagation(); setSelectedId(err.id); setPopup({ error: err, rect: (e.currentTarget as HTMLElement).getBoundingClientRect() }); }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border cursor-pointer transition-colors ${selectedId === err.id ? "border-neutral-400 dark:border-neutral-500 bg-neutral-50 dark:bg-neutral-800" : "border-neutral-100 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600"}`}>
                <span className={`shrink-0 w-1.5 h-1.5 rounded-full ${err.type === "맞춤법" ? "bg-red-400" : err.type === "띄어쓰기" ? "bg-yellow-400" : "bg-blue-400"}`} />
                <span className="text-sm text-neutral-500 line-through">{err.original}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-neutral-300 shrink-0">
                  <path d="M2 6h8M7 3l3 3-3 3" />
                </svg>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{err.suggestion}</span>
                <span className="ml-auto text-[10px] text-neutral-400">{err.type}</span>
                <button onClick={e => { e.stopPropagation(); fixError(err); }}
                  className="shrink-0 text-xs px-2 py-0.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-lg hover:opacity-80 transition-opacity">수정</button>
                <button onClick={e => { e.stopPropagation(); ignoreError(err.id); }}
                  className="shrink-0 text-xs px-2 py-0.5 text-neutral-400 hover:text-neutral-600 transition-colors">무시</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
