"use client";

import { useEffect, useRef, useState } from "react";

interface Post {
  id: string;
  no: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  views: number;
}

const POSTS_KEY = "JPGMONO_notice_posts_v1";
const ADMIN_PW = "admin@2018!";

const INITIAL_POSTS: Post[] = [
  { id: "n1", no: 1, title: "JpgMono 서비스 오픈 안내", content: "JpgMono가 오픈했습니다. 이미지 편집, 오디오 변환, 문서 분석 등 다양한 도구를 무료로 이용하실 수 있습니다.\n\n앞으로도 더 많은 기능을 추가해 나가겠습니다. 많은 이용 부탁드립니다.", createdAt: "2026-06-30", views: 0 },
];

function loadPosts(): Post[] {
  try {
    const raw = localStorage.getItem(POSTS_KEY);
    if (!raw) return INITIAL_POSTS;
    const parsed = JSON.parse(raw);
    return parsed.length ? parsed : INITIAL_POSTS;
  } catch { return INITIAL_POSTS; }
}
function savePosts(posts: Post[]) { localStorage.setItem(POSTS_KEY, JSON.stringify(posts)); }
function formatDate(d: string) { return d.slice(5); }

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600";

type View = "list" | "read" | "write";
type Modal = null | "admin-write" | "admin-edit" | "admin-delete";

export default function CommunityBoard({ fullPage = false }: { fullPage?: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [view, setView] = useState<View>("list");
  const [selected, setSelected] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [modal, setModal] = useState<Modal>(null);
  const [adminPw, setAdminPw] = useState("");
  const [adminErr, setAdminErr] = useState("");
  const [formErr, setFormErr] = useState("");
  const adminInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setPosts(loadPosts()); }, []);
  useEffect(() => { if (modal) { setAdminPw(""); setAdminErr(""); setTimeout(() => adminInputRef.current?.focus(), 50); } }, [modal]);

  function openPost(post: Post) {
    const updated = posts.map((p) => p.id === post.id ? { ...p, views: p.views + 1 } : p);
    setPosts(updated); savePosts(updated);
    setSelected({ ...post, views: post.views + 1 });
    setView("read");
  }

  function checkAdmin(): boolean {
    if (adminPw !== ADMIN_PW) { setAdminErr("암호가 올바르지 않습니다."); return false; }
    return true;
  }

  function confirmAdmin() {
    if (!checkAdmin()) return;
    if (modal === "admin-write") { setModal(null); setFormErr(""); setForm({ title: "", content: "" }); setView("write"); }
    else if (modal === "admin-edit") { setModal(null); setEditForm({ title: selected!.title, content: selected!.content }); }
    else if (modal === "admin-delete") {
      const updated = posts.filter((p) => p.id !== selected!.id);
      setPosts(updated); savePosts(updated);
      setModal(null); setSelected(null); setView("list");
    }
  }

  function submitPost() {
    if (!form.title.trim()) { setFormErr("제목을 입력해주세요."); return; }
    if (!form.content.trim()) { setFormErr("내용을 입력해주세요."); return; }
    const maxNo = posts.reduce((m, p) => Math.max(m, p.no), 0);
    const newPost: Post = { id: Date.now().toString(), no: maxNo + 1, title: form.title.trim(), content: form.content.trim(), createdAt: new Date().toISOString().split("T")[0], views: 0 };
    const updated = [newPost, ...posts]; setPosts(updated); savePosts(updated);
    setView("list");
  }

  function saveEdit() {
    if (!editForm.title.trim() || !editForm.content.trim() || !selected) return;
    const now = new Date().toISOString().split("T")[0];
    const updated = posts.map((p) => p.id === selected.id ? { ...p, title: editForm.title.trim(), content: editForm.content.trim(), updatedAt: now } : p);
    setPosts(updated); savePosts(updated);
    setSelected((s) => s ? { ...s, title: editForm.title.trim(), content: editForm.content.trim(), updatedAt: now } : s);
    setEditForm({ title: "", content: "" });
  }

  const isEditing = editForm.title !== "" || editForm.content !== "";

  /* ─── Admin Password Modal ─── */
  const adminModal = modal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-base text-neutral-900 dark:text-white">
          {modal === "admin-write" ? "글쓰기" : modal === "admin-edit" ? "글 수정" : "글 삭제"} — 관리자 확인
        </h3>
        <input
          ref={adminInputRef}
          type="password"
          placeholder="관리자 암호"
          value={adminPw}
          onChange={(e) => setAdminPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && confirmAdmin()}
          className={inputCls}
        />
        {adminErr && <p className="text-xs text-red-500 -mt-2">{adminErr}</p>}
        <div className="flex gap-2">
          <button onClick={() => setModal(null)} className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">취소</button>
          <button onClick={confirmAdmin} className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${modal === "admin-delete" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200"}`}>
            확인
          </button>
        </div>
      </div>
    </div>
  );

  /* ─── Write ─── */
  if (view === "write") return (
    <div className="flex flex-col gap-0">
      {adminModal}
      <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-5">
        <button onClick={() => setView("list")} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4L6 9L11 14" /></svg>
        </button>
        <h2 className="font-bold text-base text-neutral-900 dark:text-white">공지 작성</h2>
      </div>
      <div className="flex flex-col gap-3">
        <input type="text" placeholder="제목 *" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} maxLength={100} className={inputCls} />
        <textarea placeholder="내용을 입력하세요 *" value={form.content} onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} maxLength={5000} rows={12} className={`${inputCls} resize-none`} />
        {formErr && <p className="text-xs text-red-500">{formErr}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={() => setView("list")} className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">취소</button>
          <button onClick={submitPost} className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">등록</button>
        </div>
      </div>
    </div>
  );

  /* ─── Read ─── */
  if (view === "read" && selected) return (
    <div className="flex flex-col">
      {adminModal}

      {/* Edit inline */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 w-full max-w-lg flex flex-col gap-4 mx-4">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">공지 수정</h3>
            <input type="text" value={editForm.title} onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} maxLength={100} className={inputCls} />
            <textarea value={editForm.content} onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))} maxLength={5000} rows={10} className={`${inputCls} resize-none`} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setEditForm({ title: "", content: "" })} className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">취소</button>
              <button onClick={saveEdit} className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">저장</button>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
        <div className="flex items-start gap-3 mb-3">
          <button onClick={() => { setView("list"); setSelected(null); }} className="mt-0.5 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4L6 9L11 14" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1"><span className="text-red-500 font-semibold mr-1">공지</span>공지사항</p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">{selected.title}</h2>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={() => setModal("admin-edit")} className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">수정</button>
            <button onClick={() => setModal("admin-delete")} className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">삭제</button>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 pl-10 flex-wrap">
          <span className="font-medium text-neutral-600 dark:text-neutral-400">관리자</span>
          <span>·</span><span>{selected.createdAt}</span>
          {selected.updatedAt && <><span>·</span><span className="text-blue-400">수정됨 {selected.updatedAt}</span></>}
          <span>·</span><span>조회 {selected.views}</span>
        </div>
      </div>

      <div className="py-8 px-2 min-h-40">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
      </div>

      <div className="flex justify-center pt-6 mt-2 border-t border-neutral-100 dark:border-neutral-800">
        <button onClick={() => { setView("list"); setSelected(null); }} className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">← 목록으로</button>
      </div>
    </div>
  );

  /* ─── List ─── */
  return (
    <div className="flex flex-col gap-0">
      {adminModal}
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-3 mb-1">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white">공지사항</h2>
        <button onClick={() => setModal("admin-write")} className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
          </svg>
          글쓰기
        </button>
      </div>

      <div className="hidden sm:grid grid-cols-[3rem_1fr_5rem_4.5rem_3rem] text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 tracking-wider border-b border-neutral-100 dark:border-neutral-800 py-2 px-2">
        <span className="text-center">번호</span>
        <span className="pl-2">제목</span>
        <span className="text-center">글쓴이</span>
        <span className="text-center">작성일</span>
        <span className="text-center">조회</span>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-sm text-neutral-400 dark:text-neutral-500">공지사항이 없습니다.</div>
      ) : posts.map((post) => (
        <button key={post.id} onClick={() => openPost(post)} className="w-full text-left border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group bg-neutral-50/70 dark:bg-neutral-900/50">
          <div className="hidden sm:grid grid-cols-[3rem_1fr_5rem_4.5rem_3rem] items-center py-2.5 px-2 text-sm">
            <span className="text-center text-xs text-red-500 font-semibold">공지</span>
            <span className="pl-2 truncate font-medium text-neutral-700 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{post.title}</span>
            <span className="text-center text-xs text-neutral-500 dark:text-neutral-400">관리자</span>
            <span className="text-center text-xs text-neutral-400 dark:text-neutral-500">{formatDate(post.createdAt)}</span>
            <span className="text-center text-xs text-neutral-400 dark:text-neutral-500">{post.views}</span>
          </div>
          <div className="sm:hidden px-3 py-3 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-red-500 border border-red-200 rounded px-1 shrink-0">공지</span>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{post.title}</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
              <span>관리자</span><span>·</span><span>{formatDate(post.createdAt)}</span><span>·</span><span>조회 {post.views}</span>
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
