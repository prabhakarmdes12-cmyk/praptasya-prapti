import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as pdfjsLib from "pdfjs-dist";
import type { PDFDocumentProxy } from "pdfjs-dist";
import workerRaw from "pdfjs-dist/build/pdf.worker.min.js?raw";
import JSZip from "jszip";
import {
  ArrowUp, BookOpen, Check, ChevronLeft, ChevronRight, Download, Link2, List,
  Loader, Maximize, MessageCircle, Minus, Moon, Plus, RotateCcw, Send,
  Share, Sun, X, Zap,
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
/* ------------------------------------------------------------------ */
/*  Virtualized PDF page — rendered only when near the viewport        */
/* ------------------------------------------------------------------ */

function PdfPage({
  num,
  pdfDoc,
  zoom,
  rootRef,
  onActive,
}: {
  num: number;
  pdfDoc: PDFDocumentProxy;
  zoom: number;
  rootRef: RefObject<HTMLDivElement | null>;
  onActive: (n: number) => void;
}) {
  const slotRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const taskRef = useRef<{ cancel: () => void } | null>(null);
  const tokenRef = useRef(0);
  const [near, setNear] = useState(false);
  const [drawing, setDrawing] = useState(false);
  const [ready, setReady] = useState(false);
  const onActiveRef = useRef(onActive);
  onActiveRef.current = onActive;

  /* proximity observer (render window) + center-band observer (active page) */
  useEffect(() => {
    const el = slotRef.current;
    const root = rootRef.current;
    if (!el || !root) return;
    const nearObs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) setNear(en.isIntersecting);
      },
      { root, rootMargin: "1500px 0px" },
    );
    const actObs = new IntersectionObserver(
      (entries) => {
        for (const en of entries) if (en.isIntersecting) onActiveRef.current(num);
      },
      { root, rootMargin: "-40% 0px -40% 0px" },
    );
    nearObs.observe(el);
    actObs.observe(el);
    return () => {
      nearObs.disconnect();
      actObs.disconnect();
    };
  }, [num, pdfDoc]); // eslint-disable-line react-hooks/exhaustive-deps

  /* render (and re-render on zoom) while near */
  useEffect(() => {
    if (!near) return;
    const token = ++tokenRef.current;
    (async () => {
      try {
        const p = await pdfDoc.getPage(num);
        if (token !== tokenRef.current || !canvasRef.current || !slotRef.current) {
          p.cleanup();
          return;
        }
        const canvas = canvasRef.current;
        const slot = slotRef.current;
        const base = p.getViewport({ scale: 1 });
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
        const scale = Math.max(0.2, (slot.clientWidth * dpr) / base.width);
        const vp = p.getViewport({ scale });
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          p.cleanup();
          return;
        }
        setDrawing(true);
        setReady(false);
        const task = p.render({ canvasContext: ctx, viewport: vp });
        taskRef.current = task;
        await task.promise;
        taskRef.current = null;
        p.cleanup();
        if (token === tokenRef.current) setReady(true);
      } catch {
        /* render cancelled or page failed; keep placeholder */
      } finally {
        if (token === tokenRef.current) setDrawing(false);
      }
    })();
    return () => {
      tokenRef.current++;
      taskRef.current?.cancel();
      taskRef.current = null;
    };
  }, [near, num, pdfDoc, zoom]);

  /* free bitmap memory once the page scrolls far out of the render window */
  useEffect(() => {
    if (!near) {
      const c = canvasRef.current;
      if (c && c.width > 0) {
        c.width = 0;
        c.height = 0;
      }
    }
  }, [near]);

  return (
    <div className={`reader-page-slot${ready ? " render-ready" : ""}`} ref={slotRef} data-page={num}>
      <canvas ref={canvasRef} className="reader-canvas" aria-label={`पृष्ठ ${num} / page ${num}`} />
      {near && drawing && !ready && (
        <span className="reader-page-loader" aria-hidden="true">
          <Loader className="w-4 h-4 animate-spin" />
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  The PDF Reader — continuous scroll, doc-level prev/next nav        */
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
  const [ratios, setRatios] = useState<number[] | null>(null);
  const [loadPct, setLoadPct] = useState<number | null>(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [theme, setTheme] = useState<ReaderSettings["theme"]>(() => readSettings().theme);
  const [zoom, setZoom] = useState<ReaderSettings["zoom"]>(() => readSettings().zoom);
  const [tocOpen, setTocOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const shellRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pageElsRef = useRef<Record<number, HTMLDivElement | null>>({});
  const pageInputRef = useRef<HTMLInputElement>(null);
  const scrollRafRef = useRef(0);
  const lastSavedRef = useRef(0);
  const lastExternalPageRef = useRef<number | undefined>(undefined);
  const [readPct, setReadPct] = useState(0);

  /* works that can be opened in this reader (PDFs only; manuscripts/videos excluded) */
  const readerDocs = useMemo(
    () => (docs ?? []).filter((d) => /\.pdf$/i.test(d.filePath)),
    [docs],
  );
  const docIndex = readerDocs.findIndex((d) => d.id === doc.id);
  const prevDoc = docIndex > 0 ? readerDocs[docIndex - 1] : null;
  const nextDoc = docIndex >= 0 && docIndex < readerDocs.length - 1 ? readerDocs[docIndex + 1] : null;

  const saveToStorage = useCallback(
    (n: number) => {
      if (total > 0) {
        storePage(doc.id, n);
        onPageChange?.(n);
      }
    },
    [doc.id, total, onPageChange],
  );

  const scrollToPage = useCallback((n: number, smooth = true) => {
    const el = pageElsRef.current[n];
    const sc = scrollRef.current;
    if (!el || !sc) return;
    sc.scrollTo({
      top: el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 14,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const goTo = useCallback(
    (n: number, smooth = true) => {
      if (!total) return;
      const next = Math.min(Math.max(1, Math.floor(n)), total);
      setPage(next);
      scrollToPage(next, smooth);
    },
    [total, scrollToPage],
  );

  /* reading progress of the scroll window (throttled to one update per frame) */
  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = requestAnimationFrame(() => {
      scrollRafRef.current = 0;
      const el = scrollRef.current;
      if (!el) return;
      const max = el.scrollHeight - el.clientHeight;
      setReadPct(max > 0 ? Math.min(100, Math.round((el.scrollTop / max) * 100)) : 0);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(scrollRafRef.current), []);

  /* current page indicator (from the page crossing the reading band) */
  const handleActive = useCallback(
    (n: number) => {
      setPage(n);
      if (lastSavedRef.current !== n && total > 0) {
        lastSavedRef.current = n;
        saveToStorage(n);
      }
    },
    [total, saveToStorage],
  );

  const switchDoc = useCallback(
    (target: PdfDocument) => {
      if (target.id === doc.id) return;
      lastSavedRef.current = 0;
      onSwitchDoc?.(target);
    },
    [doc.id, onSwitchDoc],
  );

  /* Load document */
  useEffect(() => {
    let cancelled = false;
    configurePdfWorker();
    setPdfDoc(null);
    setRatios(null);
    setLoadError(null);
    setLoadPct(0);
    setTotal(0);
    setPage(1);
    lastSavedRef.current = 0;
    const task = pdfjsLib.getDocument({
      url: doc.filePath,
      isEvalSupported: false,
      rangeChunkSize: 262144,
    });
    task.onProgress = (p: { loaded: number; total: number }) => {
      if (!cancelled) setLoadPct(p.total ? Math.round((p.loaded / p.total) * 100) : null);
    };
    task.promise
      .then((loaded) => {
        if (cancelled) {
          void loaded.destroy();
          return;
        }
        setPdfDoc(loaded);
        setTotal(loaded.numPages);
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

  /* read page geometries (kept so placeholders reserve correct height) */
  useEffect(() => {
    if (!pdfDoc) return;
    let cancelled = false;
    setRatios(null);
    (async () => {
      const rs: number[] = [];
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        if (cancelled) return;
        try {
          const p = await pdfDoc.getPage(i);
          const vp = p.getViewport({ scale: 1 });
          rs.push(vp.width / vp.height);
          p.cleanup();
        } catch {
          rs.push(0.72);
        }
      }
      if (!cancelled) setRatios(rs);
    })();
    return () => {
      cancelled = true;
    };
  }, [pdfDoc]);

  /* resume reading position once the page layout is known */
  useEffect(() => {
    if (!ratios || !pdfDoc) return;
    const start = initialPage && initialPage > 1 ? initialPage : readStoredPage(doc.id, pdfDoc.numPages);
    if (start > 1) {
      window.setTimeout(() => scrollToPage(start, false), 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ratios, pdfDoc, doc.id]);

  /* follow external page changes (browser back/forward with deep links) */
  useEffect(() => {
    if (!ratios) return;
    if (!initialPage || initialPage < 1) return;
    if (initialPage === lastExternalPageRef.current) return;
    lastExternalPageRef.current = initialPage;
    scrollToPage(Math.min(initialPage, ratios.length), false);
  }, [initialPage, ratios, scrollToPage]);

  /* persist settings */
  useEffect(() => {
    saveSettings({ theme, zoom });
  }, [theme, zoom]);

  /* keyboard: Escape closes overlays; scrolling stays native */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTocOpen(false);
        setShareOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const zoomIn = () => setZoom((z) => Math.min(2.5, Math.round((z + 0.25) * 100) / 100));
  const zoomOut = () => setZoom((z) => Math.max(0.6, Math.round((z - 0.25) * 100) / 100));
  const zoomReset = () => setZoom(1);

  const progress = total > 0 ? Math.round((page / total) * 100) : 0;

  const chapterEstimate = (index: number) =>
    total > 0 ? Math.min(total, Math.max(1, Math.floor(((index + 0.5) * total) / chapters.length))) : 1;

  const goToInput = () => {
    const n = Number(pageInputRef.current?.value);
    if (Number.isFinite(n) && n > 0) goTo(n, false);
  };

  const title = hi ? doc.titleHi : doc.titleEn;
  const pagesLabel =
    typeof doc.pages === "number" ? `${doc.pages} ${hi ? "पृष्ठ" : "pages"}` : doc.pages;

  return (
    <div ref={shellRef} className={`pdf-reader-shell ${theme === "dark" ? "reader-dark" : "reader-paper"}`}>
      {/* Toolbar — title + reading tools */}
      <div className="reader-toolbar">
        <div className="reader-toolbar-left">
          {onClose && (
            <button
              type="button"
              className="reader-icon-btn"
              onClick={onClose}
              title={hi ? "बंद करें और सभी रचनाएँ देखें" : "Close and view all writings"}
              aria-label={hi ? "रीडर बंद करें" : "Close reader"}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="reader-doc-icon"><BookOpen className="w-4 h-4" /></span>
          <div className="min-w-0">
            <h3 className="reader-title">{title}</h3>
            <p className="reader-meta">
              {hi ? doc.categoryHi : doc.categoryEn} · {pagesLabel} · {doc.fileSize} ·{" "}
              {hi ? "निःशुल्क पठन" : "Free to read"}
            </p>
          </div>
        </div>
        <div className="reader-toolbar-actions">
          <div className="reader-zoom-group" role="group" aria-label={hi ? "आकार" : "Zoom"}>
            <button
              type="button"
              className="reader-icon-btn"
              onClick={zoomOut}
              title={hi ? "छोटा करें" : "Zoom out"}
              aria-label={hi ? "छोटा करें" : "Zoom out"}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="reader-zoom-value">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              className="reader-icon-btn"
              onClick={zoomIn}
              title={hi ? "बड़ा करें" : "Zoom in"}
              aria-label={hi ? "बड़ा करें" : "Zoom in"}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="reader-icon-btn"
              onClick={zoomReset}
              title={hi ? "मूल आकार" : "Fit width"}
              aria-label={hi ? "मूल आकार" : "Fit width"}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            className="reader-icon-btn"
            onClick={() => setTocOpen(true)}
            title={hi ? "विषय-सूची एवं अन्य रचनाएँ" : "Contents & other works"}
            aria-label={hi ? "विषय-सूची" : "Contents"}
          >
            <List className="w-4 h-4" />
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
            className="reader-icon-btn"
            onClick={() => shellRef.current?.requestFullscreen?.()}
            title={hi ? "पूर्ण स्क्रीन" : "Fullscreen"}
            aria-label={hi ? "पूर्ण स्क्रीन" : "Fullscreen"}
          >
            <Maximize className="w-3.5 h-3.5" />
          </button>
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
          <a
            href={doc.filePath}
            download
            className="reader-icon-btn"
            title={hi ? "PDF डाउनलोड" : "Download PDF"}
            aria-label={hi ? "PDF डाउनलोड" : "Download PDF"}
          >
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
                    <button
                      key={c.num}
                      type="button"
                      className={`reader-toc-item ${page === chapterEstimate(i) ? "active" : ""}`}
                      onClick={() => { goTo(chapterEstimate(i)); setTocOpen(false); }}
                    >
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
              <div className="reader-toc-divider" />
              <p className="reader-toc-note">{hi ? "रचनाओं में जाएँ" : "Browse works"}</p>
              {readerDocs.length > 0 ? (
                readerDocs
                  .filter((d) => d.id !== doc.id)
                  .map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      className="reader-toc-item"
                      onClick={() => { switchDoc(d); setTocOpen(false); }}
                    >
                      <span className="reader-toc-num"><BookOpen className="w-3.5 h-3.5" /></span>
                      <span className="flex-1 text-left min-w-0">
                        <strong className="!text-sm">{hi ? d.titleHi : d.titleEn}</strong>
                        <small>{hi ? d.categoryHi : d.categoryEn}</small>
                      </span>
                      <span className="reader-toc-page"><ChevronRight className="w-3.5 h-3.5" /></span>
                    </button>
                  ))
              ) : (
                <p className="reader-toc-note">{hi ? "कोई अन्य रचना उपलब्ध नहीं है।" : "No other works available."}</p>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Continuous scrollable document — fixed-height reading window */}
      <div className="reader-scroll-wrap">
        <div className="reader-readprogress" aria-hidden="true">
          <span style={{ width: `${readPct}%` }} />
        </div>
        <div
          ref={scrollRef}
          className="reader-scroll"
          role="region"
          tabIndex={0}
          onScroll={handleScroll}
          aria-label={hi ? `${title} — पठन` : `${title} — reading`}
        >
          <div className="reader-page-pill" aria-hidden="true">
            <span key={page}>{hi ? `पृष्ठ ${page} / ${total || "—"}` : `Page ${page} / ${total || "—"}`}</span>
          </div>
          {loadError && (
          <div className="reader-empty">
            <p className="font-body text-ink-soft">
              {hi
                ? "रचना लोड नहीं हो पाई। कृपया PDF डाउनलोड करें या फिर से कोशिश करें।"
                : "This work could not be loaded. Please download the PDF or try again."}
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
                <p className="font-body text-ink-soft">{hi ? `रचना तैयार हो रही है… ${loadPct}%` : `Preparing… ${loadPct}%`}</p>
                <div className="reader-progress-track w-full max-w-xs">
                  <div className="reader-progress-bar" style={{ width: `${loadPct}%` }} />
                </div>
              </>
            ) : (
              <Loader className="w-8 h-8 text-saffron animate-spin" />
            )}
          </div>
        )}
        {pdfDoc && !ratios && !loadError && (
          <div className="reader-empty">
            <Loader className="w-8 h-8 text-saffron animate-spin" />
            <p className="font-body text-ink-soft">{hi ? "पृष्ठ तैयार हो रहे हैं…" : "Preparing pages…"}</p>
          </div>
        )}
        {pdfDoc && ratios && (
          <div className="reader-doc" style={{ width: `calc(min(100%, 760px) * ${zoom})` }}>
            {/* In-document opening page — title first, focused */}
            <header className="reader-cover">
              <p className="reader-cover-kicker">
                {hi ? doc.categoryHi : doc.categoryEn}
                {(hi ? doc.tagHi : doc.tagEn) ? ` · ${hi ? doc.tagHi : doc.tagEn}` : ""}
              </p>
              <h2 className="reader-cover-title">{title}</h2>
              <p className="reader-cover-sub">
                <span>{hi ? "अनन्तानन्द मानव" : "Anantanand Manav"}</span>
                <span className="reader-cover-dot" aria-hidden="true" />
                <span>{pagesLabel}</span>
                <span className="reader-cover-dot" aria-hidden="true" />
                <span>{doc.fileSize}</span>
              </p>
              <p className="reader-cover-desc">{hi ? doc.descriptionHi : doc.descriptionEn}</p>
            </header>

            {/* Pages — continuous flow */}
            <div className="reader-pages">
              {ratios.map((ratio, i) => (
                <div className="reader-page-unit" key={i + 1}>
                  <div
                    className="reader-page-frame"
                    ref={(el) => {
                      pageElsRef.current[i + 1] = el;
                    }}
                    style={{ aspectRatio: `${ratio}` }}
                  >
                    <PdfPage
                      num={i + 1}
                      pdfDoc={pdfDoc}
                      zoom={zoom}
                      rootRef={scrollRef}
                      onActive={handleActive}
                    />
                  </div>
                  <p className="reader-page-label">{hi ? `पृष्ठ ${i + 1}` : `Page ${i + 1}`}</p>
                </div>
              ))}
            </div>

            {/* End of work — natural next step */}
            <footer className="reader-end">
              <span className="reader-end-icon"><Check className="w-5 h-5" /></span>
              <h3>{hi ? "इस रचना के सभी पृष्ठ देख लिए गए" : "You have reached the end"}</h3>
              <p>
                {nextDoc
                  ? hi
                    ? `अगली रचना: ${nextDoc.titleHi}`
                    : `Next work: ${nextDoc.titleEn}`
                  : hi
                    ? "यह अंतिम रचना थी। सभी रचनाएँ पढ़ने के लिए धन्यवाद।"
                    : "This was the last work. Thank you for reading."}
              </p>
              <div className="reader-end-actions">
                {nextDoc ? (
                  <button type="button" className="btn-primary" onClick={() => switchDoc(nextDoc)}>
                    {hi ? "अगली रचना पढ़ें" : "Read next work"} <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  onClose && (
                    <button type="button" className="btn-primary" onClick={onClose}>
                      {hi ? "सभी रचनाएँ देखें" : "View all writings"}
                    </button>
                  )
                )}
                {onClose && (
                  <button type="button" className="btn-ghost" onClick={onClose}>
                    {hi ? "सभी रचनाएँ" : "All writings"}
                  </button>
                )}
              </div>
              <ShareButtons doc={doc} page={page} compact />
            </footer>
          </div>
        )}
        </div>
        {readPct > 6 && (
          <button
            type="button"
            className="reader-top-btn"
            onClick={() => scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
            title={hi ? "ऊपर जाएँ" : "Back to top"}
            aria-label={hi ? "ऊपर जाएँ" : "Back to top"}
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dock — prev/next switches between works; page slider inside */}
      <div className="reader-dock">
        <button
          type="button"
          className="reader-dock-btn"
          onClick={() => prevDoc && switchDoc(prevDoc)}
          disabled={!prevDoc}
          title={prevDoc ? (hi ? `पिछली रचना: ${prevDoc.titleHi}` : `Previous: ${prevDoc.titleEn}`) : hi ? "यह पहली रचना है" : "This is the first work"}
          aria-label={prevDoc ? (hi ? `पिछली रचना: ${prevDoc.titleHi}` : `Previous work: ${prevDoc.titleEn}`) : hi ? "पिछली रचना" : "Previous work"}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{hi ? "पिछली रचना" : "Previous work"}</span>
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
            onChange={(e) => goTo(Number(e.target.value), false)}
            className="reader-range"
            aria-label={hi ? "पृष्ठ चुनें" : "Choose page"}
            style={{ ["--progress" as string]: `${progress}%` }}
          />
          <div className="reader-dock-jump">
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
        <button
          type="button"
          className="reader-dock-btn"
          onClick={() => nextDoc && switchDoc(nextDoc)}
          disabled={!nextDoc}
          title={nextDoc ? (hi ? `अगली रचना: ${nextDoc.titleHi}` : `Next: ${nextDoc.titleEn}`) : hi ? "यह अंतिम रचना है" : "This is the last work"}
          aria-label={nextDoc ? (hi ? `अगली रचना: ${nextDoc.titleHi}` : `Next work: ${nextDoc.titleEn}`) : hi ? "अगली रचना" : "Next work"}
        >
          <span>{hi ? "अगली रचना" : "Next work"}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
