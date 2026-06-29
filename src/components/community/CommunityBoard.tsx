"use client";

import { useEffect, useRef, useState } from "react";

interface Post {
  id: string;
  no: number;
  type: "공지" | "일반";
  title: string;
  content: string;
  author: string;
  userId: string;
  password: string;
  createdAt: string;
  updatedAt?: string;
  views: number;
  likes: number;
  comments: number;
}

interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  likes: number;
}

const POSTS_KEY = "JPGMONO_community_posts_v3";
const COMMENTS_KEY = "JPGMONO_community_comments_v1";

const INITIAL_POSTS: Post[] = [
  { id: "n1", no: 0, type: "공지", title: "JpgMono 서비스 오픈 안내", content: "JpgMono가 오픈했습니다. 많은 이용 부탁드립니다.", author: "익명", userId: "", password: "", createdAt: "2026-06-29", views: 1240, likes: 32, comments: 2 },
  { id: "2", no: 2, type: "일반", title: "이미지 사이즈 변경 기능 정말 편하네요", content: "브라우저에서 바로 되니까 너무 좋습니다. 서버 업로드 없이 처리되는 게 신기해요.", author: "익명", userId: "", password: "", createdAt: "2026-06-29", views: 89, likes: 4, comments: 1 },
  { id: "1", no: 1, type: "일반", title: "WEBP 변환 기능도 빨리 나왔으면 좋겠어요", content: "준비중이라고 되어있던데 언제 나오나요?", author: "익명", userId: "", password: "", createdAt: "2026-06-29", views: 43, likes: 1, comments: 0 },
];

const INITIAL_COMMENTS: Comment[] = [
  { id: "c1", postId: "n1", author: "익명", content: "오픈 축하드려요!", createdAt: "2026-06-29", likes: 0 },
  { id: "c2", postId: "n1", author: "익명", content: "앞으로 많은 기능 추가 기대합니다 :)", createdAt: "2026-06-29", likes: 1 },
  { id: "c3", postId: "2", author: "익명", content: "저도 써봤는데 진짜 빠르네요!", createdAt: "2026-06-29", likes: 0 },
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

function loadComments(): Comment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    if (!raw) return INITIAL_COMMENTS;
    const parsed = JSON.parse(raw);
    return parsed.length ? parsed : INITIAL_COMMENTS;
  } catch { return INITIAL_COMMENTS; }
}
function saveComments(c: Comment[]) { localStorage.setItem(COMMENTS_KEY, JSON.stringify(c)); }

function formatDate(d: string) { return d.slice(5); }

const PAGE_SIZE = 20;
type Tab = "전체" | "일반" | "공지";
type Modal = null | "auth-edit" | "auth-delete" | "editing";

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-white placeholder:text-neutral-300 dark:placeholder:text-neutral-600";

export default function CommunityBoard({ fullPage = false }: { fullPage?: boolean }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [tab, setTab] = useState<Tab>("전체");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<"list" | "read" | "write">("list");
  const [selected, setSelected] = useState<Post | null>(null);
  const [form, setForm] = useState({ title: "", content: "", userId: "", password: "", passwordConfirm: "" });
  const [editForm, setEditForm] = useState({ title: "", content: "" });
  const [commentForm, setCommentForm] = useState({ content: "" });
  const [commentError, setCommentError] = useState("");
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Modal>(null);
  const [authInput, setAuthInput] = useState({ userId: "", password: "" });
  const [authError, setAuthError] = useState("");
  const commentInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setPosts(loadPosts()); setComments(loadComments()); }, []);

  const notices = posts.filter((p) => p.type === "공지");
  const normals = posts.filter((p) => p.type === "일반");
  const filtered = tab === "공지" ? notices : normals;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pagePosts = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const postComments = selected ? comments.filter((c) => c.postId === selected.id) : [];

  function openPost(post: Post) {
    const updated = posts.map((p) => p.id === post.id ? { ...p, views: p.views + 1 } : p);
    setPosts(updated); savePosts(updated);
    setSelected({ ...post, views: post.views + 1 });
    setCommentForm({ content: "" }); setCommentError(""); setView("read");
  }

  function likePost() {
    if (!selected) return;
    const updated = posts.map((p) => p.id === selected.id ? { ...p, likes: p.likes + 1 } : p);
    setPosts(updated); savePosts(updated);
    setSelected((s) => s ? { ...s, likes: s.likes + 1 } : s);
  }

  function likeComment(cid: string) {
    const updated = comments.map((c) => c.id === cid ? { ...c, likes: c.likes + 1 } : c);
    setComments(updated); saveComments(updated);
  }

  function submitComment() {
    if (!commentForm.content.trim()) { setCommentError("댓글 내용을 입력해주세요."); return; }
    if (!selected) return;
    const newComment: Comment = { id: Date.now().toString(), postId: selected.id, author: "익명", content: commentForm.content.trim(), createdAt: new Date().toISOString().split("T")[0], likes: 0 };
    const updatedC = [...comments, newComment]; setComments(updatedC); saveComments(updatedC);
    const updatedP = posts.map((p) => p.id === selected.id ? { ...p, comments: p.comments + 1 } : p);
    setPosts(updatedP); savePosts(updatedP);
    setSelected((s) => s ? { ...s, comments: s.comments + 1 } : s);
    setCommentForm({ content: "" }); setCommentError("");
  }

  function submitPost() {
    if (!form.userId.trim()) { setError("아이디를 입력해주세요."); return; }
    if (!form.password.trim()) { setError("비밀번호를 입력해주세요."); return; }
    if (form.password !== form.passwordConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    if (!form.title.trim()) { setError("제목을 입력해주세요."); return; }
    if (!form.content.trim()) { setError("내용을 입력해주세요."); return; }
    const maxNo = posts.filter((p) => p.type === "일반").reduce((m, p) => Math.max(m, p.no), 0);
    const newPost: Post = { id: Date.now().toString(), no: maxNo + 1, type: "일반", title: form.title.trim(), content: form.content.trim(), author: "익명", userId: form.userId.trim(), password: form.password, createdAt: new Date().toISOString().split("T")[0], views: 0, likes: 0, comments: 0 };
    const updated = [newPost, ...posts]; setPosts(updated); savePosts(updated);
    setForm({ title: "", content: "", userId: "", password: "", passwordConfirm: "" });
    setError(""); setView("list"); setPage(1);
  }

  function verifyAuth(): boolean {
    if (!selected) return false;
    if (!selected.userId && !selected.password) { setAuthError("이 글은 수정/삭제 권한이 없습니다."); return false; }
    if (authInput.userId !== selected.userId || authInput.password !== selected.password) {
      setAuthError("아이디 또는 비밀번호가 일치하지 않습니다."); return false;
    }
    return true;
  }

  function openAuthModal(type: "auth-edit" | "auth-delete") {
    setAuthInput({ userId: "", password: "" }); setAuthError(""); setModal(type);
  }

  function confirmAuth() {
    if (!verifyAuth()) return;
    if (modal === "auth-edit") {
      setEditForm({ title: selected!.title, content: selected!.content });
      setModal("editing");
    } else if (modal === "auth-delete") {
      const updatedP = posts.filter((p) => p.id !== selected!.id); setPosts(updatedP); savePosts(updatedP);
      const updatedC = comments.filter((c) => c.postId !== selected!.id); setComments(updatedC); saveComments(updatedC);
      setModal(null); setSelected(null); setView("list");
    }
  }

  function saveEdit() {
    if (!editForm.title.trim() || !editForm.content.trim() || !selected) return;
    const now = new Date().toISOString().split("T")[0];
    const updated = posts.map((p) => p.id === selected.id ? { ...p, title: editForm.title.trim(), content: editForm.content.trim(), updatedAt: now } : p);
    setPosts(updated); savePosts(updated);
    setSelected((s) => s ? { ...s, title: editForm.title.trim(), content: editForm.content.trim(), updatedAt: now } : s);
    setModal(null);
  }

  /* ─── Write ─── */
  if (view === "write") return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-3 border-b border-neutral-200 dark:border-neutral-700 pb-4 mb-5">
        <button onClick={() => { setView("list"); setError(""); }} className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4L6 9L11 14" /></svg>
        </button>
        <h2 className="font-bold text-base text-neutral-900 dark:text-white">글쓰기</h2>
      </div>
      <div className="flex flex-col gap-3">
        {/* ID / PW */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">아이디 <span className="text-red-400">*</span></label>
            <input type="text" placeholder="나중에 수정 시 사용" value={form.userId}
              onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))} maxLength={20}
              className={inputCls} />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">비밀번호 <span className="text-red-400">*</span></label>
            <input type="password" placeholder="수정·삭제에 사용" value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} maxLength={30}
              className={inputCls} />
          </div>
          <div className="flex-1">
            <label className="block text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1">비밀번호 확인 <span className="text-red-400">*</span></label>
            <input type="password" placeholder="다시 입력" value={form.passwordConfirm}
              onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))} maxLength={30}
              className={inputCls} />
          </div>
        </div>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 -mt-1">
          아이디·비밀번호는 이 기기에만 저장되며 개인정보를 수집하지 않습니다.
        </p>

        <div className="border-t border-neutral-100 dark:border-neutral-800 pt-3">
          <input type="text" placeholder="제목 *" value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} maxLength={100}
            className={inputCls} />
        </div>
        <textarea placeholder="내용을 입력하세요 *" value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))} maxLength={5000} rows={10}
          className={`${inputCls} resize-none`} />
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex gap-2 justify-end">
          <button onClick={() => { setView("list"); setError(""); }}
            className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">취소</button>
          <button onClick={submitPost}
            className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">등록</button>
        </div>
      </div>
    </div>
  );

  /* ─── Read ─── */
  if (view === "read" && selected) return (
    <div className="flex flex-col">
      {/* Modal overlay */}
      {(modal === "auth-edit" || modal === "auth-delete") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setModal(null)}>
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 w-80 flex flex-col gap-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">
              {modal === "auth-edit" ? "글 수정" : "글 삭제"} — 본인 확인
            </h3>
            <div className="flex flex-col gap-2">
              <input type="text" placeholder="아이디" value={authInput.userId}
                onChange={(e) => setAuthInput((a) => ({ ...a, userId: e.target.value }))}
                className={inputCls} />
              <input type="password" placeholder="비밀번호" value={authInput.password}
                onChange={(e) => setAuthInput((a) => ({ ...a, password: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && confirmAuth()}
                className={inputCls} />
              {authError && <p className="text-xs text-red-500">{authError}</p>}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setModal(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">취소</button>
              <button onClick={confirmAuth}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors ${modal === "auth-delete" ? "bg-red-500 hover:bg-red-600 text-white" : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-700 dark:hover:bg-neutral-200"}`}>
                {modal === "auth-edit" ? "수정하기" : "삭제하기"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit modal */}
      {modal === "editing" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl p-6 w-full max-w-lg flex flex-col gap-4 mx-4">
            <h3 className="font-bold text-base text-neutral-900 dark:text-white">글 수정</h3>
            <input type="text" value={editForm.title}
              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))} maxLength={100}
              className={inputCls} />
            <textarea value={editForm.content}
              onChange={(e) => setEditForm((f) => ({ ...f, content: e.target.value }))} maxLength={5000} rows={10}
              className={`${inputCls} resize-none`} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setModal(null)}
                className="px-5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">취소</button>
              <button onClick={saveEdit}
                className="px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">저장</button>
            </div>
          </div>
        </div>
      )}

      {/* Post header */}
      <div className="border-b border-neutral-200 dark:border-neutral-700 pb-4">
        <div className="flex items-start gap-3 mb-3">
          <button onClick={() => { setView("list"); setSelected(null); }}
            className="mt-0.5 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M11 4L6 9L11 14" /></svg>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-1">
              {selected.type === "공지" && <span className="text-red-500 font-semibold mr-1.5">공지</span>}자유 게시판
            </p>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white leading-snug">{selected.title}</h2>
          </div>
          {/* Edit / Delete buttons */}
          {selected.userId && (
            <div className="flex gap-1 shrink-0">
              <button onClick={() => openAuthModal("auth-edit")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">수정</button>
              <button onClick={() => openAuthModal("auth-delete")}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">삭제</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500 pl-10 flex-wrap">
          <span className="font-medium text-neutral-600 dark:text-neutral-400">익명</span>
          {selected.userId && <span className="text-neutral-300 dark:text-neutral-600">({selected.userId})</span>}
          <span>·</span><span>{selected.createdAt}</span>
          {selected.updatedAt && <><span>·</span><span className="text-blue-400">수정됨 {selected.updatedAt}</span></>}
          <span>·</span><span>조회 {selected.views}</span>
          <span>·</span><span>추천 {selected.likes}</span>
          <span>·</span><span>댓글 {selected.comments}</span>
        </div>
      </div>

      {/* Content */}
      <div className="py-8 px-2 min-h-40 border-b border-neutral-100 dark:border-neutral-800">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
      </div>

      {/* Like */}
      <div className="flex justify-center py-5 border-b border-neutral-100 dark:border-neutral-800">
        <button onClick={likePost}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.5 13s-5.5-4-5.5-7.5a3.5 3.5 0 0 1 5.5-2.9A3.5 3.5 0 0 1 13 5.5C13 9 7.5 13 7.5 13z" />
          </svg>
          추천 {selected.likes}
        </button>
      </div>

      {/* Comments */}
      <div className="pt-4">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 mb-3">
          댓글 <span className="text-neutral-400 dark:text-neutral-500 font-normal">{postComments.length}</span>
        </h3>
        {postComments.length === 0 ? (
          <div className="text-center py-8 text-sm text-neutral-300 dark:text-neutral-600 border-y border-neutral-100 dark:border-neutral-800">
            첫 번째 댓글을 남겨보세요
          </div>
        ) : (
          <div className="border-t border-neutral-100 dark:border-neutral-800">
            {postComments.map((c, i) => (
              <div key={c.id} className={`flex gap-3 py-4 ${i < postComments.length - 1 ? "border-b border-neutral-100 dark:border-neutral-800" : ""}`}>
                <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-neutral-400 dark:text-neutral-500">
                    <circle cx="7" cy="5" r="2.5"/><path d="M2 12c0-2.8 2.2-5 5-5s5 2.2 5 5"/>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">익명</span>
                    <span className="text-xs text-neutral-400 dark:text-neutral-500">{c.createdAt}</span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-wrap">{c.content}</p>
                  <button onClick={() => likeComment(c.id)}
                    className="mt-2 flex items-center gap-1 text-xs text-neutral-400 dark:text-neutral-500 hover:text-red-400 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 10.5s-4.5-3-4.5-6a2.5 2.5 0 0 1 4.5-1.7A2.5 2.5 0 0 1 10.5 4.5C10.5 7.5 6 10.5 6 10.5z" />
                    </svg>
                    {c.likes > 0 ? <span className="text-red-400 font-semibold">{c.likes}</span> : "좋아요"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Comment form */}
        <div className="mt-4 border border-neutral-200 dark:border-neutral-700 rounded-2xl overflow-hidden">
          <div className="relative">
            <textarea ref={commentInputRef} placeholder="댓글을 남겨보세요"
              value={commentForm.content}
              onChange={(e) => setCommentForm((f) => ({ ...f, content: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) submitComment(); }}
              maxLength={1000} rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-neutral-950 text-sm text-neutral-700 dark:text-neutral-300 focus:outline-none resize-none placeholder:text-neutral-300 dark:placeholder:text-neutral-600" />
            <div className="flex items-center justify-between px-4 pb-3">
              {commentError
                ? <p className="text-xs text-red-500">{commentError}</p>
                : <p className="text-xs text-neutral-300 dark:text-neutral-600">Ctrl+Enter로 등록</p>}
              <button onClick={submitComment}
                className="px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">등록</button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6 mt-2 border-t border-neutral-100 dark:border-neutral-800">
        <button onClick={() => { setView("list"); setSelected(null); }}
          className="text-sm text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">← 목록으로</button>
      </div>
    </div>
  );

  /* ─── List ─── */
  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700">
        <div className="flex">
          {(["전체", "일반", "공지"] as Tab[]).map((t) => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }}
              className={`px-4 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${tab === t ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white" : "border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}>
              {t}글
            </button>
          ))}
        </div>
        <button onClick={() => setView("write")}
          className="flex items-center gap-1.5 px-3.5 py-2 mb-1 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <line x1="6" y1="1" x2="6" y2="11" /><line x1="1" y1="6" x2="11" y2="6" />
          </svg>
          글쓰기
        </button>
      </div>

      <div className="hidden sm:grid grid-cols-[3rem_3.5rem_1fr_5rem_4.5rem_3rem_3rem] text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 tracking-wider border-b border-neutral-100 dark:border-neutral-800 py-2 px-2">
        <span className="text-center">번호</span><span className="text-center">말머리</span>
        <span className="pl-2">제목</span><span className="text-center">글쓴이</span>
        <span className="text-center">작성일</span><span className="text-center">조회</span><span className="text-center">추천</span>
      </div>

      {(tab === "전체" || tab === "공지") && notices.map((post) => (
        <PostRow key={post.id} post={post} onClick={() => openPost(post)} isNotice />
      ))}

      {tab !== "공지" && (pagePosts.length === 0 ? (
        <div className="text-center py-16 text-sm text-neutral-400 dark:text-neutral-500">게시글이 없습니다. 첫 번째 글을 작성해보세요!</div>
      ) : pagePosts.map((post) => (
        <PostRow key={post.id} post={post} onClick={() => openPost(post)} />
      )))}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-1 pt-5 mt-2 border-t border-neutral-100 dark:border-neutral-800">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 transition-colors">‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${p === page ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900" : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}>{p}</button>
          ))}
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 transition-colors">›</button>
        </div>
      )}
    </div>
  );
}

function PostRow({ post, onClick, isNotice = false }: { post: Post; onClick: () => void; isNotice?: boolean }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/60 transition-colors group ${isNotice ? "bg-neutral-50/70 dark:bg-neutral-900/50" : ""}`}>
      <div className="hidden sm:grid grid-cols-[3rem_3.5rem_1fr_5rem_4.5rem_3rem_3rem] items-center py-2.5 px-2 text-sm">
        <span className={`text-center text-xs ${isNotice ? "text-red-500 font-semibold" : "text-neutral-400 dark:text-neutral-500"}`}>{isNotice ? "공지" : post.no}</span>
        <span className={`text-center text-xs font-medium ${isNotice ? "text-red-500" : "text-neutral-400 dark:text-neutral-500"}`}>{post.type}</span>
        <span className="pl-2 flex items-center gap-1.5 min-w-0">
          <span className={`truncate font-medium group-hover:text-neutral-900 dark:group-hover:text-white transition-colors ${isNotice ? "text-neutral-700 dark:text-neutral-200" : "text-neutral-800 dark:text-neutral-200"}`}>{post.title}</span>
          {post.comments > 0 && <span className="shrink-0 text-xs text-blue-500 font-semibold">[{post.comments}]</span>}
          {post.updatedAt && <span className="shrink-0 text-[10px] text-blue-400">수정</span>}
        </span>
        <span className="text-center text-xs text-neutral-500 dark:text-neutral-400 truncate px-1">익명</span>
        <span className="text-center text-xs text-neutral-400 dark:text-neutral-500">{formatDate(post.createdAt)}</span>
        <span className="text-center text-xs text-neutral-400 dark:text-neutral-500">{post.views}</span>
        <span className={`text-center text-xs font-semibold ${post.likes > 0 ? "text-red-400" : "text-neutral-300 dark:text-neutral-600"}`}>{post.likes}</span>
      </div>
      <div className="sm:hidden px-3 py-3 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          {isNotice && <span className="text-[10px] font-semibold text-red-500 border border-red-200 rounded px-1">공지</span>}
          <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 truncate">{post.title}</span>
          {post.comments > 0 && <span className="text-xs text-blue-500 font-semibold shrink-0">[{post.comments}]</span>}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 dark:text-neutral-500">
          <span>익명</span><span>·</span><span>{formatDate(post.createdAt)}</span><span>·</span>
          <span>조회 {post.views}</span>
          {post.likes > 0 && <><span>·</span><span className="text-red-400 font-semibold">추천 {post.likes}</span></>}
        </div>
      </div>
    </button>
  );
}
