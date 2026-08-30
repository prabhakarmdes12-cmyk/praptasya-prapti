import { useCallback, useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import workerRaw from "pdfjs-dist/build/pdf.worker.min.js?raw";
import JSZip from "jszip";
import {
  BookOpen, Check, ChevronDown, ChevronUp, Download, FileText,
  Link2, List, Loader, Maximize, MessageCircle, Minus, Moon, Plus,
  RotateCcw, Send, Share, Sun, X, Zap,
} from "lucide-react";
import type { PdfDocument } from "./data";
import { chapters } from "./data";
import { useLanguage } from "./i18n";

/* ------------------------------------------------------------------ */
/*  pdf.js worker bootstrap (works with vite-plugin-singlefile)        */
/* ------------------------------------------------------------------ */

let workerReady = false;

function configurePdfWorker() {
  if (workerReady) return;
  if (typeof window !== "undefined" && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    // Inline the worker as a blob URL so it survives single-file bundling
    // and works on every browser (including iOS, where <object> PDF embeds fail).
    const blob = new Blob([workerRaw], { type: "text/javascript" });
    pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
  }
  workerReady = true;
}

/* ------------------------------------------------------------------ */
/*  Storage helpers                                                    */
/* ------------------------------------------------------------------ */

const pageKey = (id: string) => `praptasya:reader:page:${id}`;
const settingsKey = "praptasya:reader:settings";

export function readStoredPage(docId: string, total: number): number {
  try {
    const n = Number(localStorage.getItem(pageKey(docId)));
    if (Number.isFinite(n) && n > 0) return Math.min(Math.floor(n), total);
  } catch {
    /* ignore */
  }
  return 1;
}

export function storePage(docId: string, page: number) {
  try {
    localStorage.setItem(pageKey(docId), String(page));
  } catch {
    /* ignore */
  }
}

type ReaderSettings = { theme: "paper" | "dark"; zoom: number };

function readSettings(): ReaderSettings {
  try {
    const raw = localStorage.getItem(settingsKey);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<ReaderSettings>;
      return {
        theme: parsed.theme === "dark" ? "dark" : "paper",
        zoom: typeof parsed.zoom === "number" && parsed.zoom >= 0.6 && parsed.zoom <= 2.5 ? parsed.zoom : 1,
      };
    }
  } catch {
    /* ignore */
  }
  return { theme: "paper", zoom: 1 };
}

function saveSettings(s: ReaderSettings) {
  try {
    localStorage.setItem(settingsKey, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function shareUrl(docId: string, page?: number): string {
  const base = `${window.location.origin}/library?read=${encodeURIComponent(docId)}`;
  return page && page > 1 ? `${base}&page=${page}` : base;
}

/* ------------------------------------------------------------------ */
/*  Share buttons                                                      */
/* ------------------------------------------------------------------ */

export function ShareButtons({
  doc,
  page,
  compact = false,
  onCopied,
}: {
  doc: PdfDocument;
  page?: number;
  compact?: boolean;
  onCopied?: () => void;
}) {
  const language = useLanguage();
  const hi = language !== "en";
  const [copied, setCopied] = useState(false);
  const url = shareUrl(doc.id, page);
  const text = hi ? doc.titleHi : doc.titleEn;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    setCopied(true);
    onCopied?.();
    window.setTimeout(() => setCopied(false), 1800);
  };

  const links = [
    {
      label: "WhatsApp",
      icon: MessageCircle,
      href: `https://wa.me/?text=${encodeURIComponent(`${text} — ${url}`)}`,
    },
    {
      label: "Telegram",
      icon: Send,
      href: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
    {
      label: "Facebook",
      icon: Share,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: "X",
      icon: Zap,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    },
  ];

  return (
    <div className={`share-buttons ${compact ? "share-buttons-compact" : ""}`} role="group" aria-label={hi ? "साझा करें" : "Share"}>
      {!compact && <span className="share-label"><Share className="w-3.5 h-3.5" /> {hi ? "साझा करें" : "Share"}</span>}
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noreferrer"
          className="share-btn"
          title={`Share on ${l.label}`}
          aria-label={`Share on ${l.label}`}
        >
          <l.icon className="w-3.5 h-3.5" />
          {!compact && <span>{l.label}</span>}
        </a>
      ))}
      <button type="button" className="share-btn" onClick={copy} title={hi ? "लिंक कॉपी करें" : "Copy link"} aria-label={hi ? "लिंक कॉपी करें" : "Copy link"}>
        {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
        {!compact && <span>{copied ? (hi ? "कॉपी हुआ" : "Copied") : (hi ? "लिंक कॉपी" : "Copy link")}</span>}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Download everything as ZIP                                         */
/* ------------------------------------------------------------------ */

export function DownloadAllZip({ docs }: { docs: PdfDocument[] }) {
  const language = useLanguage();
  const hi = language !== "en";
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const downloadAll = async () => {
    setBusy(true);
    setDone(false);
    try {
      const zip = new JSZip();
      const folder = zip.folder("anantanand-manav-lekhan")!;
      for (const doc of docs) {
        const res = await fetch(doc.filePath);
        if (!res.ok) continue;
        const blob = await res.blob();
        folder.file(`${doc.id} - ${doc.titleHi}.pdf`, blob);
      }
      folder.file(
        "README.txt",
        [
          "अनन्तानन्द मानव — लेखन संग्रह",
          "-----------------------------",
          "ये सभी रचनाएँ पूर्णतः निःशुल्क हैं। इन्हें पढ़ें, साझा करें और वितरित करें।",
          "",
          ...docs.map(
            (d) => `${d.titleHi} (${typeof d.pages === "number" ? `${d.pages} पृष्ठ` : d.pages}) — ${d.descriptionHi}`,
          ),
          "",
          "ऑनलाइन पढ़ने हेतु: इसी वेबसाइट का 'पढ़ें' पृष्ठ खोलें।",
        ].join("\n"),
      );
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "anantanand-manav-lekhan.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 4000);
      setDone(true);
      window.setTimeout(() => setDone(false), 4000);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button type="button" onClick={downloadAll} disabled={busy} className="btn-ghost py-2.5 px-5 text-sm disabled:opacity-60">
      {busy ? <Loader className="w-4 h-4 animate-spin" /> : done ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
      {busy
        ? hi
          ? "ZIP बन रहा है…"
          : "Creating ZIP…"
        : done
          ? hi
            ? "डाउनलोड शुरू"
            : "Download started"
          : hi
            ? "सभी रचनाएँ एक साथ (ZIP)"
            : "Download all (ZIP)"}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Reader signup / reach                                               */
/* ------------------------------------------------------------------ */

export function ReaderSignup() {
  const language = useLanguage();
  const hi = language !== "en";
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);

  const whatsappHref =
    "https://wa.me/?text=" +
    encodeURIComponent(
      hi
        ? "नमस्ते अनन्तानन्द मानव जी, मैं आपका लेखन पढ़ता/पढ़ती हूँ। नई रचनाओं की सूचना पाना चाहूँगा/चाहूँगी।"
        : "Hello, I read your writings and would like to be notified about new works.",
    );

  const subscribe = () => {
    if (email.trim()) {
      try {
        const list = JSON.parse(localStorage.getItem("praptasya:readers") || "[]") as string[];
        if (!list.includes(email.trim())) list.push(email.trim());
        localStorage.setItem("praptasya:readers", JSON.stringify(list));
      } catch {
        /* ignore */
      }
      setSaved(true);
    }
    const body = encodeURIComponent(
      hi
        ? `नमस्ते, मैं ${email || "पाठक"} आपकी नई रचनाओं की सूचना पाना चाहता/चाहती हूँ।`
        : `Hello, I would like to be notified about your new writings.`,
    );
    window.location.href = `mailto:sampark@praptasya.example?subject=${encodeURIComponent(
      hi ? "नई रचनाओं की सूचना" : "Notify me about new writings",
    )}&body=${body}`;
    window.setTimeout(() => setSaved(false), 6000);
  };

  return (
    <div className="signup-card">
      <div className="flex items-center gap-3 mb-3">
        <span className="w-10 h-10 rounded-sm bg-saffron/10 border border-saffron/30 flex items-center justify-center shrink-0">
          <BookOpen className="w-5 h-5 text-saffron-deep" />
        </span>
        <div>
          <h3 className="text-xl md:text-2xl text-maroon">{hi ? "नए लेखन की सूचना पाएँ" : "Get notified about new writings"}</h3>
          <p className="font-body text-sm text-ink-soft">
            {hi
              ? "हर नई कृति मुफ़्त पढ़ने के लिए आप तक पहुँचे — बिना किसी शुल्क के।"
              : "Every new work reaches you free — no fees, ever."}
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={hi ? "अपना ईमेल दर्ज करें" : "Enter your email"}
            className="w-full font-body bg-paper border border-gold/30 rounded-sm px-4 py-3 text-ink placeholder-ink-soft/60 focus:outline-none focus:border-saffron"
          />
        </div>
        <button type="button" onClick={subscribe} className="btn-primary py-3 px-5 text-sm justify-center">
          {saved ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          {saved ? (hi ? "सहेजा गया" : "Saved") : hi ? "सूचना पाएँ" : "Notify me"}
        </button>
        <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-ghost py-3 px-5 text-sm justify-center">
          <MessageCircle className="w-4 h-4 text-saffron-deep" />
          WhatsApp
        </a>
      </div>
      <p className="font-body text-xs text-ink-soft mt-3">
        {hi
          ? "यह एक सीधा संपर्क-माध्यम है: आपका संदेश लेखक की ईमेल/व्हाट्सऐप पर पहुँचता है। कोई शुल्क नहीं, कोई स्पैम नहीं।"
          : "This opens a direct channel to the writer — no fees, no spam."}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The PDF Reader                                                     */
/* ------------------------------------------------------------------ */

export function PdfReader({
  doc,
  initialPage,
  onClose,
  onPageChange,
  onSwitchDoc,
  docs,
}: {
  doc: PdfDocument;
  initialPage?: number;
  onClose?: () => void;
  onPageChange?: (page: number) => void;
  onSwitchDoc?: (doc: PdfDocument) => void;
  docs?: PdfDocument[];
}) {
  const language = useLanguage();
  const hi = language !== "en";

  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loadPct, setLoadPct] = useState<number | null>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [theme, setTheme] = useState<ReaderSettings["theme"]>(() => readSettings().theme);
  const [zoom, setZoom] = useState<ReaderSettings["zoom"]>(() => readSettings().zoom);
  const [tocOpen, setTocOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);
  const touchStartX = useRef<number | null>(null);
  const pageInputRef = useRef<HTMLInputElement>(null);
  const lastExternalPageRef = useRef<number | undefined>(undefined);

  const saveToStorage = useCallback(
    (n: number) => {
      if (total > 0) {
        storePage(doc.id, n);
        onPageChange?.(n);
      }
    },
    [doc.id, total, onPageChange],
  );

  const goTo = useCallback(
    (n: number) => {
      if (!total) return;
      const next = Math.min(Math.max(1, Math.floor(n)), total);
      setPage(next);
      saveToStorage(next);
    },
    [total, saveToStorage],
  );

  /* Load document */
  useEffect(() => {
    let cancelled = false;
    configurePdfWorker();
    setPdfDoc(null);
    setLoadError(null);
    setLoadPct(0);
    setTotal(0);
    setPage(1);
    const task = pdfjsLib.getDocument({
      url: doc.filePath,
      rangeChunkSize: 262144,
      onProgress: (p: { loaded: number; total: number }) => {
        if (!cancelled) setLoadPct(p.total ? Math.round((p.loaded / p.total) * 100) : null);
      },
    } as Parameters<typeof pdfjsLib.getDocument>[0]);
    task.promise
      .then((loaded) => {
        if (cancelled) {
          void loaded.destroy();
          return;
        }
        setPdfDoc(loaded);
        setTotal(loaded.numPages);
        const start = initialPage && initialPage > 1 ? initialPage : readStoredPage(doc.id, loaded.numPages);
        const n = Math.min(Math.max(1, start), loaded.numPages);
        setPage(n);
        setLoadPct(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
      void task.destroy();
    };
  }, [doc.id, doc.filePath]); // eslint-disable-line react-hooks/exhaustive-deps

  /* Render current page */
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !stageRef.current) return;
    let cancelled = false;
    (async () => {
      const p = await pdfDoc.getPage(page);
      if (cancelled) {
        p.cleanup();
        return;
      }
      const baseVp = p.getViewport({ scale: 1 });
      const width = stageRef.current?.clientWidth || 640;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const scale = Math.max(0.2, (width / baseVp.width) * zoom * dpr);
      const vp = p.getViewport({ scale });
      const canvas = canvasRef.current;
      if (!canvas) {
        p.cleanup();
        return;
      }
      canvas.width = Math.floor(vp.width);
      canvas.height = Math.floor(vp.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        p.cleanup();
        return;
      }
      setRendering(true);
      try {
        const task = p.render({ canvasContext: ctx, viewport: vp });
        renderTaskRef.current = task;
        await task.promise;
      } catch {
        /* render cancelled */
      } finally {
        p.cleanup();
        renderTaskRef.current = null;
        if (!cancelled) setRendering(false);
      }
    })();
    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
    };
  }, [pdfDoc, page, zoom, theme]);

  /* follow external page changes (e.g. browser back/forward with deep links) */
  useEffect(() => {
    if (!pdfDoc) return;
    if (!initialPage || initialPage < 1) return;
    if (initialPage === lastExternalPageRef.current) return;
    lastExternalPageRef.current = initialPage;
    if (initialPage !== page) goTo(initialPage);
  }, [initialPage, pdfDoc, page, goTo]);

  /* persist settings */
  useEffect(() => {
    saveSettings({ theme, zoom });
  }, [theme, zoom]);

  /* keyboard navigation */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(page + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(page - 1);
      } else if (e.key === "Escape") {
        setTocOpen(false);
        setShareOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, goTo]);

  const zoomIn = () => setZoom((z) => Math.min(2.5, Math.round((z + 0.25) * 100) / 100));
  const zoomOut = () => setZoom((z) => Math.max(0.6, Math.round((z - 0.25) * 100) / 100));
  const zoomReset = () => setZoom(1);

  const progress = total > 0 ? Math.round((page / total) * 100) : 0;

  const chapterEstimate = (index: number) => (total > 0 ? Math.min(total, Math.max(1, Math.floor(((index + 0.5) * total) / chapters.length))) : 1);

  const goToInput = () => {
    const n = Number(pageInputRef.current?.value);
    if (Number.isFinite(n) && n > 0) goTo(n);
  };

  return (
    <div className={`pdf-reader-shell ${theme === "dark" ? "reader-dark" : "reader-paper"}`}>
      {/* Toolbar */}
      <div className="reader-toolbar">
        <div className="reader-toolbar-left">
          {onClose && (
            <button type="button" className="reader-icon-btn" onClick={onClose} title={hi ? "बंद करें" : "Close"} aria-label={hi ? "रीडर बंद करें" : "Close reader"}>
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="reader-doc-icon"><FileText className="w-4 h-4" /></span>
          <div className="min-w-0">
            <h3 className="reader-title">{hi ? doc.titleHi : doc.titleEn}</h3>
            <p className="reader-meta">
              {typeof doc.pages === "number" ? `${doc.pages} ${hi ? "पृष्ठ" : "pages"}` : doc.pages} · {doc.fileSize} ·{" "}
              <span className="text-gold">❖</span> {hi ? "सभी रचनाएँ निःशुल्क" : "All works free"}
            </p>
          </div>
        </div>
        <div className="reader-toolbar-actions">
          <div className="relative">
            <button
              type="button"
              className="reader-icon-btn"
              onClick={() => setShareOpen((s) => !s)}
              title={hi ? "साझा करें" : "Share"}
              aria-label={hi ? "साझा करें" : "Share"}
            >
              <Share className="w-4 h-4" />
            </button>
            {shareOpen && (
              <div className="reader-popover">
                <ShareButtons doc={doc} page={page} onCopied={() => setShareOpen(false)} />
              </div>
            )}
          </div>
          <a href={doc.filePath} download className="reader-icon-btn" title={hi ? "PDF डाउनलोड" : "Download PDF"} aria-label={hi ? "PDF डाउनलोड" : "Download PDF"}>
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* TOC drawer */}
      {tocOpen && (
        <div className="reader-toc-backdrop" onClick={() => setTocOpen(false)}>
          <aside className="reader-toc" onClick={(e) => e.stopPropagation()}>
            <div className="reader-toc-head">
              <span className="flex items-center gap-2"><List className="w-4 h-4" /> {hi ? "विषय-सूची" : "Contents"}</span>
              <button type="button" className="reader-icon-btn" onClick={() => setTocOpen(false)} aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="reader-toc-body">
              {total >= 20 && (
                <>
                  <p className="reader-toc-note">{hi ? "अध्याय (पृष्ठ संख्याएँ अनुमानित हैं)।" : "Chapters (page numbers are approximate)."}</p>
                  {chapters.map((c, i) => (
                    <button key={c.num} type="button" className={`reader-toc-item ${page === chapterEstimate(i) ? "active" : ""}`} onClick={() => { goTo(chapterEstimate(i)); setTocOpen(false); }}>
                      <span className="reader-toc-num">{c.num}</span>
                      <span className="flex-1 text-left min-w-0">
                        <strong>{c.title}</strong>
                        <small>{c.desc}</small>
                      </span>
                      <span className="reader-toc-page">{hi ? `पृष्ठ ${chapterEstimate(i)}` : `p. ${chapterEstimate(i)}`}</span>
                    </button>
                  ))}
                  <div className="reader-toc-divider" />
                </>
              )}
              {docs && docs.length > 0 && (
                <>
                  <div className="reader-toc-divider" />
                  <p className="reader-toc-note">{hi ? "अन्य रचनाएँ" : "Other works"}</p>
                  {docs
                    .filter((d) => d.id !== doc.id && d.category !== "manuscript")
                    .map((d) => (
                      <button key={d.id} type="button" className="reader-toc-item" onClick={() => { onSwitchDoc?.(d); setTocOpen(false); }}>
                        <span className="reader-toc-num"><BookOpen className="w-3.5 h-3.5" /></span>
                        <span className="flex-1 text-left min-w-0">
                          <strong className="!text-sm">{hi ? d.titleHi : d.titleEn}</strong>
                        </span>
                        <span className="reader-toc-page"><ChevronDown className="w-3.5 h-3.5 -rotate-90" /></span>
                      </button>
                    ))}
                </>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Stage */}
      <div
        ref={stageRef}
        className="reader-stage"
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(dx) > 48) goTo(page + (dx < 0 ? 1 : -1));
          touchStartX.current = null;
        }}
      >
        {loadError && (
          <div className="reader-empty">
            <p className="font-body text-ink-soft">
              {hi
                ? "पुस्तक लोड नहीं हो पाई। कृपया नीचे से PDF डाउनलोड करें या फिर से कोशिश करें।"
                : "The book could not be loaded. Please download the PDF below or try again."}
            </p>
            <a href={doc.filePath} download className="btn-primary">
              <Download className="w-4 h-4" /> {hi ? "PDF डाउनलोड करें" : "Download PDF"}
            </a>
          </div>
        )}
        {!pdfDoc && !loadError && (
          <div className="reader-empty">
            {loadPct !== null ? (
              <>
                <Loader className="w-8 h-8 text-saffron animate-spin" />
                <p className="font-body text-ink-soft">{hi ? `पुस्तक तैयार हो रही है… ${loadPct}%` : `Preparing your book… ${loadPct}%`}</p>
                <div className="reader-progress-track w-full max-w-xs">
                  <div className="reader-progress-bar" style={{ width: `${loadPct}%` }} />
                </div>
              </>
            ) : (
              <Loader className="w-8 h-8 text-saffron animate-spin" />
            )}
          </div>
        )}
        {pdfDoc && (
          <div className="reader-page">
            <canvas ref={canvasRef} className="reader-canvas" aria-label={hi ? `पृष्ठ ${page}` : `Page ${page}`} />
            {rendering && (
              <div className="reader-render-indicator">
                <Loader className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Dock */}
      <div className="reader-dock">
        <button type="button" className="reader-dock-btn" onClick={() => goTo(page - 1)} disabled={page <= 1} title={hi ? "पिछला पृष्ठ" : "Previous page"} aria-label={hi ? "पिछला पृष्ठ" : "Previous page"}>
          <ChevronUp className="w-5 h-5 -rotate-90" />
          <span>{hi ? "पिछला" : "Prev"}</span>
        </button>
        <div className="reader-dock-center">
          <div className="flex items-center justify-between text-xs font-body mb-1.5">
            <span className="text-ink-soft">
              {hi ? "पृष्ठ" : "Page"} <strong className="text-maroon">{page}</strong> / {total || "—"}
            </span>
            <span className="text-saffron-deep font-semibold">{progress}%</span>
          </div>
          <input
            type="range"
            min={1}
            max={Math.max(total, 1)}
            value={page}
            onChange={(e) => goTo(Number(e.target.value))}
            className="reader-range"
            aria-label={hi ? "पृष्ठ चुनें" : "Choose page"}
            style={{ ["--progress" as string]: `${progress}%` }}
          />
          <div className="reader-dock-zoom">
            <button type="button" className="reader-icon-btn" onClick={zoomOut} title={hi ? "छोटा करें" : "Zoom out"} aria-label={hi ? "छोटा करें" : "Zoom out"}>
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="reader-zoom-value">{Math.round(zoom * 100)}%</span>
            <button type="button" className="reader-icon-btn" onClick={zoomIn} title={hi ? "बड़ा करें" : "Zoom in"} aria-label={hi ? "बड़ा करें" : "Zoom in"}>
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="reader-icon-btn" onClick={zoomReset} title={hi ? "मूल आकार" : "Fit width"} aria-label={hi ? "मूल आकार" : "Fit width"}>
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button type="button" className="reader-icon-btn" onClick={() => setTocOpen((v) => !v)} title={hi ? "विषय-सूची" : "Contents"} aria-label={hi ? "विषय-सूची" : "Contents"}>
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="reader-icon-btn"
              onClick={() => setTheme((t) => (t === "paper" ? "dark" : "paper"))}
              title={theme === "paper" ? (hi ? "गहरा रीडर" : "Dark reader") : hi ? "कागज़ रीडर" : "Paper reader"}
              aria-label={theme === "paper" ? (hi ? "गहरा रीडर" : "Dark reader") : hi ? "कागज़ रीडर" : "Paper reader"}
            >
              {theme === "paper" ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              className="reader-icon-btn reader-fullscreen"
              onClick={() => stageRef.current?.requestFullscreen?.()}
              title={hi ? "पूर्ण स्क्रीन" : "Fullscreen"}
              aria-label={hi ? "पूर्ण स्क्रीन" : "Fullscreen"}
            >
              <Maximize className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <button type="button" className="reader-dock-btn" onClick={() => goTo(page + 1)} disabled={page >= total} title={hi ? "अगला पृष्ठ" : "Next page"} aria-label={hi ? "अगला पृष्ठ" : "Next page"}>
          <span>{hi ? "अगला" : "Next"}</span>
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Page jump */}
      <div className="reader-goto">
        <input
          ref={pageInputRef}
          type="number"
          min={1}
          max={total || undefined}
          placeholder={hi ? "पृष्ठ संख्या" : "Page #"}
          onKeyDown={(e) => { if (e.key === "Enter") goToInput(); }}
          aria-label={hi ? "पृष्ठ संख्या दर्ज करें" : "Jump to page"}
        />
        <button type="button" onClick={goToInput}>{hi ? "जाएँ" : "Go"}</button>
      </div>
    </div>
  );
}


