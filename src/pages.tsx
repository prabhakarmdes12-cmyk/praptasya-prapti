import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Feather, BookOpen, Sparkles, ArrowRight, ArrowLeft,
  Quote, Phone, Mail, MapPin, MessageCircle, Calendar, Clock,
  ScrollText, Palette, Play, ExternalLink, Download, FileText,
  Video, Film, Eye, X, CheckCircle2, User,
  Search, ZoomIn, ZoomOut, RotateCcw, ArrowUpRight,
} from "lucide-react";
import {
  quotes, philosophyPillars, chapters, articles, events, gallery,
  pdfDocuments, videoItems, manuscriptPages, COMPLETE_BOOK_ID,
  type Article, type PdfDocument, type VideoItem, type PdfCategory,
} from "./data";
import { PdfReader, ShareButtons, DownloadAllZip, ReaderSignup, readStoredPage } from "./reader";
import { useLanguage } from "./i18n";

export type Route =
  | { name: "home" }
  | { name: "about" }
  | { name: "book" }
  | { name: "philosophy" }
  | { name: "articles"; readId?: string; readPage?: number }
  | { name: "gallery" }
  | { name: "events" }
  | { name: "contact" }
  | { name: "culture" }
  | { name: "article"; slug: string };

export type Nav = (r: Route) => void;

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

/* ---------- Shared UI ---------- */

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="kicker block font-body text-xs md:text-sm tracking-[0.28em] uppercase text-saffron-deep mb-4">
      {children}
    </span>
  );
}

function PageHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="page-head text-center max-w-3xl mx-auto mb-14">
      <Kicker>{kicker}</Kicker>
      <h1 className="text-4xl md:text-5xl text-maroon-deep leading-tight mb-5">{title}</h1>
      {sub && <p className="font-body text-lg text-ink-soft leading-relaxed">{sub}</p>}
    </div>
  );
}

/* Tribal SVG art — people, birds, leaves and beads in Gond style */
function TribalMotif({ className = "" }: { className?: string }) {
  return (
    <svg className={`tribal-motif ${className}`} viewBox="0 0 1200 150" aria-hidden="true" focusable="false">
      <path className="motif-line" d="M0 88 C120 34 210 126 330 70 S520 28 610 80 S790 132 910 65 S1080 36 1200 82" />
      <path className="motif-line faint" d="M0 108 C145 58 220 142 354 92 S536 50 634 100 S806 150 930 88 S1090 58 1200 102" />
      <g className="motif-leaves">
        <path d="M146 73 q18-28 38-5 q-18 25-38 5M208 91 q16-25 34-3 q-15 22-34 3M972 73 q18-28 38-5 q-18 25-38 5M1044 91 q16-25 34-3 q-15 22-34 3" />
      </g>
      <g className="motif-people">
        <circle cx="490" cy="87" r="6" /><circle cx="545" cy="87" r="6" /><circle cx="655" cy="87" r="6" /><circle cx="710" cy="87" r="6" />
        <path d="M490 94v25m-11-10 11-7 11 7m-11 10-10 18m10-18 10 18M545 94v25m-11-10 11-7 11 7m-11 10-10 18m10-18 10 18M501 109l33 0M655 94v25m-11-10 11-7 11 7m-11 10-10 18m10-18 10 18M710 94v25m-11-10 11-7 11 7m-11 10-10 18m10-18 10 18M666 109l33 0" />
      </g>
      <path className="motif-bird" d="M823 48q18-18 36 0q18-18 36 0q-18-9-36 4q-18-13-36-4Z" />
      <path className="motif-bird" d="M300 42q12-12 24 0q12-12 24 0q-12-6-24 3q-12-9-24-3Z" />
      <path className="motif-dots" d="M30 50h420M750 50h420" />
    </svg>
  );
}

/* ---------- PDF READER MODAL ---------- */

export function PdfModal({ doc, onClose }: { doc: PdfDocument; onClose: () => void }) {
  const language = useLanguage();
  const hi = language !== "en";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-paper border border-ink/15 rounded-sm shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-paper-dark border-b border-ink/10">
          <div className="flex items-center gap-3 min-w-0">
            <span className="shrink-0 p-2 rounded-sm bg-saffron/10 text-saffron-deep">
              <FileText className="w-5 h-5" />
            </span>
            <div className="truncate">
              <h3 className="text-lg md:text-xl text-maroon truncate font-serif">{hi ? doc.titleHi : doc.titleEn}</h3>
              <p className="font-body text-xs text-ink-soft flex items-center gap-2 mt-0.5">
                <span className="font-medium text-saffron-deep">{hi ? doc.categoryHi : doc.categoryEn}</span>
                <span>•</span>
                <span>{typeof doc.pages === "number" ? `${doc.pages} ${hi ? "पृष्ठ" : "pages"}` : doc.pages}</span>
                <span>•</span>
                <span>{doc.fileSize}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={doc.filePath}
              download
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-body font-medium bg-saffron text-paper rounded-sm hover:bg-saffron-deep transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              {hi ? "डाउनलोड" : "Download"}
            </a>
            <a
              href={doc.filePath}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-ink-soft hover:text-maroon rounded-sm transition-colors"
              title={hi ? "नई विंडो में खोलें" : "Open in new tab"}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-ink-soft hover:text-maroon rounded-sm transition-colors"
              aria-label="Close PDF viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 bg-neutral-900 overflow-auto relative min-h-[65vh]">
          {doc.category === "manuscript" ? (
            <div className="p-4 md:p-6 bg-paper min-h-[65vh]">
              <ManuscriptSection />
            </div>
          ) : (
            <object
              data={`${doc.filePath}#toolbar=1&navpanes=1&view=FitH`}
              type="application/pdf"
              className="w-full h-full min-h-[65vh] border-0"
              aria-label={hi ? doc.titleHi : doc.titleEn}
            >
              <div className="p-8 text-center text-paper flex flex-col items-center justify-center h-full gap-4">
                <p className="font-body text-base">
                  {hi
                    ? "इस ब्राउज़र में इनबिल्ट PDF रीडर उपलब्ध नहीं है। आप नीचे दिए गए बटन से PDF डाउनलोड कर सकते हैं या नई विंडो में देख सकते हैं।"
                    : "PDF preview is not supported directly in this browser. Please download or open in a new tab."}
                </p>
                <div className="flex gap-4">
                  <a href={doc.filePath} download className="btn-primary">
                    <Download className="w-4 h-4" /> {hi ? "PDF डाउनलोड करें" : "Download PDF"}
                  </a>
                  <a href={doc.filePath} target="_blank" rel="noreferrer" className="btn-ghost text-paper border-paper/40">
                    <ExternalLink className="w-4 h-4" /> {hi ? "नई विंडो में देखें" : "Open in New Tab"}
                  </a>
                </div>
              </div>
            </object>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-paper-dark border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 font-body text-xs text-ink-soft">
          <p className="italic">{hi ? doc.descriptionHi : doc.descriptionEn}</p>
          <div className="flex items-center gap-3">
            <a href={doc.filePath} download className="sm:hidden text-saffron-deep font-semibold underline">
              {hi ? "डाउनलोड करें" : "Download"}
            </a>
            <button onClick={onClose} className="px-3 py-1 bg-paper border border-ink/10 text-ink rounded-sm hover:border-maroon">
              {hi ? "बंद करें" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- VIDEO SHOWCASE COMPONENT ---------- */

export function VideoSection({ className = "" }: { className?: string }) {
  const language = useLanguage();
  const hi = language !== "en";
  const [selectedVideo, setSelectedVideo] = useState<VideoItem>(videoItems[0]);

  return (
    <div className={`video-showcase ${className}`}>
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Main Player */}
        <div className="lg:col-span-8 bg-paper-dark/60 border border-ink/10 rounded-sm overflow-hidden shadow-lg">
          <div className="relative bg-black aspect-video flex items-center justify-center">
            <video
              key={selectedVideo.videoUrl}
              src={selectedVideo.videoUrl}
              controls
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              Your browser does not support HTML5 video.
            </video>
          </div>
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-3 mb-3 font-body text-xs">
              <span className="px-2.5 py-1 bg-saffron text-paper font-semibold rounded-sm uppercase tracking-wider">
                {hi ? selectedVideo.badgeHi : selectedVideo.badgeEn}
              </span>
              <span className="flex items-center gap-1 text-ink-soft font-medium">
                <Clock className="w-3.5 h-3.5 text-saffron" /> {selectedVideo.duration}
              </span>
              <span className="text-gold">•</span>
              <span className="text-maroon font-medium flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-saffron" /> {hi ? selectedVideo.speakerHi : selectedVideo.speakerEn}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl text-maroon font-serif mb-3 leading-snug">
              {hi ? selectedVideo.titleHi : selectedVideo.titleEn}
            </h3>
            <p className="font-body text-base md:text-lg text-ink-soft leading-relaxed">
              {hi ? selectedVideo.descriptionHi : selectedVideo.descriptionEn}
            </p>
          </div>
        </div>

        {/* Playlist & Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-paper-dark/40 border border-ink/10 rounded-sm p-4">
            <h4 className="font-serif text-lg text-maroon mb-1 flex items-center gap-2">
              <Film className="w-4 h-4 text-saffron" />
              {hi ? "वीडियो प्रवचन सूची" : "Video Playlist"}
            </h4>
            <p className="font-body text-xs text-ink-soft">
              {hi ? "देखने के लिए वीडियो चुनें" : "Select a video to play"}
            </p>
          </div>

          <div className="space-y-3">
            {videoItems.map((vid, idx) => {
              const isCurrent = vid.id === selectedVideo.id;
              return (
                <button
                  key={vid.id}
                  onClick={() => setSelectedVideo(vid)}
                  className={`w-full text-left p-4 rounded-sm border transition-all text-sm group ${
                    isCurrent
                      ? "bg-maroon text-paper border-maroon shadow-md"
                      : "bg-paper border-ink/10 hover:border-saffron text-ink hover:bg-paper-dark/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5 ${
                        isCurrent
                          ? "bg-saffron text-paper"
                          : "bg-saffron/15 text-saffron-deep group-hover:bg-saffron group-hover:text-paper"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[0.7rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs ${
                            isCurrent ? "bg-saffron text-paper" : "bg-saffron/10 text-maroon"
                          }`}
                        >
                          {hi ? `भाग ${idx + 1}` : `Part ${idx + 1}`}
                        </span>
                        <span className={`text-xs ${isCurrent ? "text-paper/80" : "text-ink-soft"}`}>
                          {vid.duration}
                        </span>
                      </div>
                      <h5
                        className={`font-serif text-base leading-snug line-clamp-2 ${
                          isCurrent ? "text-paper font-semibold" : "text-maroon group-hover:text-saffron-deep"
                        }`}
                      >
                        {hi ? vid.titleHi : vid.titleEn}
                      </h5>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-4 bg-maroon/5 border border-ink/10 rounded-sm">
            <p className="font-body text-xs text-ink-soft leading-relaxed">
              {hi
                ? "ग्रंथ, विचार-विमर्श एवं सत्संग सत्रों के आगामी वीडियो संदेश भी यहाँ समय-समय पर प्रकाशित किए जाएँगे।"
                : "Future video recordings and dialogues will be added here as they become available."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- ORIGINAL MANUSCRIPT VIEWER COMPONENT ---------- */

export function ManuscriptSection({ className = "" }: { className?: string }) {
  const language = useLanguage();
  const hi = language !== "en";
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"both" | "scan" | "extracted">("both");
  const [zoomLevel, setZoomLevel] = useState(1);

  const currentPage = manuscriptPages[selectedPageIndex];

  return (
    <div className={`manuscript-viewer-wrapper ${className}`}>
      {/* Header controls & Page selector */}
      <div className="bg-paper-dark/60 border border-ink/10 rounded-sm p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="scripture-pill">
                <ScrollText className="w-3.5 h-3.5" />
                {hi ? "लेखक की मूल हस्तलिखित पांडुलिपि" : "Author's Original Handwritten Manuscript"}
              </span>
              <span className="text-xs font-body text-ink-soft">
                {hi ? `पृष्ठ ${currentPage.pageNumber} / ${manuscriptPages.length}` : `Page ${currentPage.pageNumber} of ${manuscriptPages.length}`}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl text-maroon font-serif">
              {hi ? currentPage.titleHi : currentPage.titleEn}
            </h3>
            <p className="font-body text-sm text-saffron-deep font-medium mt-0.5">
              {hi ? currentPage.themeHi : currentPage.themeEn}
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1.5 p-1 bg-paper border border-ink/10 rounded-sm shrink-0">
            <button
              onClick={() => setViewMode("both")}
              className={`px-3 py-1.5 text-xs font-body font-medium rounded-xs transition-colors ${
                viewMode === "both" ? "manuscript-tab-active" : "manuscript-tab-inactive"
              }`}
            >
              {hi ? "दोनों (तुलनात्मक)" : "Split View"}
            </button>
            <button
              onClick={() => setViewMode("scan")}
              className={`px-3 py-1.5 text-xs font-body font-medium rounded-xs transition-colors ${
                viewMode === "scan" ? "manuscript-tab-active" : "manuscript-tab-inactive"
              }`}
            >
              {hi ? "मूल स्कैन" : "Original Scan"}
            </button>
            <button
              onClick={() => setViewMode("extracted")}
              className={`px-3 py-1.5 text-xs font-body font-medium rounded-xs transition-colors ${
                viewMode === "extracted" ? "manuscript-tab-active" : "manuscript-tab-inactive"
              }`}
            >
              {hi ? "डिजिटल पाठ" : "Extracted Text"}
            </button>
          </div>
        </div>

        {/* Page Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-ink/10">
          {manuscriptPages.map((page, idx) => (
            <button
              key={page.id}
              onClick={() => {
                setSelectedPageIndex(idx);
                setZoomLevel(1);
              }}
              className={`p-2.5 text-left rounded-sm border transition-all ${
                selectedPageIndex === idx
                  ? "bg-maroon text-paper border-maroon shadow-xs"
                  : "bg-paper border-ink/10 hover:border-saffron text-ink"
              }`}
            >
              <div className="flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-wider mb-0.5">
                <span className={selectedPageIndex === idx ? "text-gold" : "text-saffron-deep"}>
                  {hi ? `पृष्ठ ${idx + 1}` : `Page ${idx + 1}`}
                </span>
                <FileText className="w-3 h-3 opacity-70" />
              </div>
              <p className={`font-serif text-xs md:text-sm line-clamp-1 ${selectedPageIndex === idx ? "text-paper" : "text-maroon"}`}>
                {hi ? page.titleHi.split("—")[0].trim() : page.titleEn.split("—")[0].trim()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual Area */}
      <div className={`grid gap-6 items-start ${viewMode === "both" ? "lg:grid-cols-12" : "grid-cols-1"}`}>
        {/* Left / Scan Side */}
        {(viewMode === "both" || viewMode === "scan") && (
          <div className={`${viewMode === "both" ? "lg:col-span-6" : "w-full"} space-y-3`}>
            <div className="manuscript-scan-frame rounded-sm p-3 flex flex-col items-center">
              <div className="w-full flex items-center justify-between px-2 py-1 text-paper/90 text-xs font-body mb-2">
                <span className="flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-gold" />
                  {hi ? "हस्तलिखित मूल पांडुलिपि (स्कैन)" : "Original Handwritten Document (Scan)"}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.25))}
                    className="p-1 hover:text-paper bg-white/10 rounded-xs"
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(1, z - 0.25))}
                    className="p-1 hover:text-paper bg-white/10 rounded-xs"
                    title="Zoom out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomLevel(1)}
                    className="p-1 hover:text-paper bg-white/10 rounded-xs"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href={currentPage.imagePath}
                    download={`praptasya-prapti-manuscript-page-${currentPage.pageNumber}.jpg`}
                    className="px-2 py-0.5 hover:text-gold bg-white/10 rounded-xs flex items-center gap-1 text-[0.7rem]"
                    title={hi ? "मूल स्कैन डाउनलोड करें" : "Download Scan"}
                  >
                    <Download className="w-3.5 h-3.5" /> {hi ? "स्कैन" : "Scan"}
                  </a>
                </div>
              </div>

              {/* Image Viewport */}
              <div className="w-full max-h-[650px] overflow-auto rounded-xs bg-black/40 flex items-center justify-center p-2">
                <img
                  src={currentPage.imagePath}
                  alt={`हस्तलिखित पांडुलिपि पृष्ठ ${currentPage.pageNumber}`}
                  style={{ transform: `scale(${zoomLevel})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}
                  className="max-w-full h-auto object-contain rounded-xs shadow-md cursor-zoom-in"
                  onClick={() => setZoomLevel((z) => (z >= 1.75 ? 1 : 1.75))}
                />
              </div>
            </div>
          </div>
        )}

        {/* Right / Extracted Text Side */}
        {(viewMode === "both" || viewMode === "extracted") && (
          <div className={`${viewMode === "both" ? "lg:col-span-6" : "w-full"} space-y-6`}>
            <div className="manuscript-paper-extracted rounded-sm p-6 md:p-8 space-y-6">
              {/* Scripture references badge list */}
              {currentPage.scriptureReferences && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-body font-semibold text-saffron-deep">
                    {hi ? "ग्रन्थ सन्दर्भ:" : "Scripture Citations:"}
                  </span>
                  {currentPage.scriptureReferences.map((ref, idx) => (
                    <span key={idx} className="scripture-pill">
                      <BookOpen className="w-3 h-3" />
                      {hi ? ref.nameHi : ref.nameEn} {ref.verse && `(${ref.verse})`}
                    </span>
                  ))}
                </div>
              )}

              {/* Extracted Text Content */}
              <div className="space-y-4">
                {currentPage.extractedTextHi.map((paragraph, pIdx) => (
                  <p
                    key={pIdx}
                    className="font-serif text-base md:text-lg text-ink leading-[1.85] text-justify tracking-wide"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Key Essence & Takeaway Box */}
              <div className="pt-4 border-t border-ink/10 bg-maroon/5 rounded-sm p-4 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-saffron-deep">
                  <Sparkles className="w-3.5 h-3.5" />
                  {hi ? "दार्शनिक सार एवं निष्कर्ष" : "Core Philosophical Essence"}
                </div>
                <p className="font-body text-sm md:text-base text-maroon font-medium leading-relaxed">
                  {hi ? currentPage.summaryHi : currentPage.summaryEn}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <a
                  href={currentPage.imagePath}
                  download={`praptasya-prapti-manuscript-page-${currentPage.pageNumber}.jpg`}
                  className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-saffron-deep hover:underline"
                >
                  <Download className="w-3.5 h-3.5" />
                  {hi ? `पृष्ठ ${currentPage.pageNumber} का हाई-रेज़ोल्यूशन स्कैन डाउनलोड करें` : `Download High-Res Page ${currentPage.pageNumber}`}
                </a>
                <span className="font-body text-xs text-ink-soft italic">
                  — श्री हरनारायण साह (अनन्तानन्द मानव)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- PDF REPOSITORY COMPONENT ---------- */

export function PdfRepository({
  onRead,
  onManuscript,
}: {
  onRead: (doc: PdfDocument) => void;
  onManuscript: (doc: PdfDocument) => void;
}) {
  const language = useLanguage();
  const hi = language !== "en";
  const [selectedCategory, setSelectedCategory] = useState<PdfCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories: { key: PdfCategory; hi: string; en: string }[] = [
    { key: "all", hi: "सभी रचनाएँ (9)", en: "All (9)" },
    { key: "book", hi: "पुस्तकें (3)", en: "Books (3)" },
    { key: "manuscript", hi: "मूल पांडुलिपि (1)", en: "Manuscript (1)" },
    { key: "culture", hi: "संस्कृति (1)", en: "Culture (1)" },
    { key: "essay", hi: "विचार-लेख (1)", en: "Essays (1)" },
    { key: "story", hi: "साहित्य व कथा (3)", en: "Literature (3)" },
  ];

  const filteredDocs = pdfDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.titleHi.toLowerCase().includes(q) ||
      doc.titleEn.toLowerCase().includes(q) ||
      doc.descriptionHi.toLowerCase().includes(q) ||
      doc.descriptionEn.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const openDoc = (doc: PdfDocument) => {
    if (doc.category === "manuscript") onManuscript(doc);
    else onRead(doc);
  };

  return (
    <section className="pdf-repository-section space-y-8">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-sm font-body text-xs md:text-sm transition-colors ${
                selectedCategory === cat.key
                  ? "bg-maroon text-paper font-semibold shadow-xs"
                  : "bg-paper-dark/60 text-ink-soft hover:text-maroon hover:bg-paper-dark border border-ink/10"
              }`}
            >
              {hi ? cat.hi : cat.en}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={hi ? "रचना, ग्रंथ या विषय खोजें…" : "Search writings…"}
            className="w-full pl-9 pr-4 py-2 bg-paper border border-ink/10 rounded-sm font-body text-xs text-ink placeholder-ink-soft/60 focus:outline-none focus:border-saffron"
          />
          <Search className="w-3.5 h-3.5 text-ink-soft absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* PDF Grid */}
      <div className="grid sm:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => {
          const isCore = doc.id === COMPLETE_BOOK_ID;
          const maxPage = typeof doc.pages === "number" ? doc.pages : 60;
          const savedPage = readStoredPage(doc.id, maxPage);
          return (
            <motion.div
              key={doc.id}
              {...fade}
              className={`pdf-card bg-paper-dark/40 border rounded-sm p-6 flex flex-col justify-between ${
                isCore ? "border-saffron/60 ring-1 ring-saffron/20" : "border-ink/10"
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-saffron/15 text-saffron-deep font-semibold text-[0.7rem] uppercase tracking-wider rounded-xs">
                    <FileText className="w-3 h-3" />
                    {hi ? doc.categoryHi : doc.categoryEn}
                  </span>
                  <span className="font-body text-xs text-ink-soft flex items-center gap-1">
                    <span>{typeof doc.pages === "number" ? `${doc.pages} ${hi ? "पृष्ठ" : "pages"}` : doc.pages}</span>
                    <span>•</span>
                    <span>{doc.fileSize}</span>
                  </span>
                </div>

                <h3 className="text-xl md:text-2xl text-maroon font-serif mb-2 leading-snug">
                  {hi ? doc.titleHi : doc.titleEn}
                </h3>
                <p className="font-body text-ink-soft text-sm leading-relaxed mb-6">
                  {hi ? doc.descriptionHi : doc.descriptionEn}
                </p>
              </div>

              <div className="pt-4 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => openDoc(doc)}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-medium text-saffron-deep hover:text-maroon transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {hi ? "ऑनलाइन पढ़ें" : "Read Online"}
                </button>
                <div className="flex items-center gap-2">
                  <a
                    href={doc.filePath}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-paper border border-ink/10 hover:border-saffron text-maroon text-xs font-body font-medium rounded-sm transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-saffron-deep" />
                    {hi ? (doc.category === "manuscript" ? "स्कैन" : "PDF") : "Download"}
                  </a>
                  <ShareButtons doc={doc} compact />
                </div>
              </div>
              {isCore && savedPage > 1 && (
                <p className="mt-3 pt-3 border-t border-ink/10 font-body text-xs text-saffron-deep">
                  {hi ? `आप पृष्ठ ${savedPage} तक पढ़ चुके हैं` : `You have read up to page ${savedPage}`}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredDocs.length === 0 && (
        <div className="text-center py-12 bg-paper-dark/30 border border-ink/10 rounded-sm">
          <p className="font-body text-ink-soft text-base">
            {hi ? "कोई रचना नहीं मिली। कृपया भिन्न खोज शब्द आज़माएँ।" : "No writings found matching your query."}
          </p>
        </div>
      )}
    </section>
  );
}

/* ---------- HOME ---------- */

export function Home({ navigate }: { navigate: Nav }) {
  const language = useLanguage();
  const hi = language !== "en";
  const [modalPdf, setModalPdf] = useState<PdfDocument | null>(null);

  const pillars = [
    {
      title: "प्राप्तस्य प्राप्ति",
      ref: hi ? "ईशावास्योपनिषद् · वेदान्त" : "Isha Upanishad · Vedanta",
      text: hi
        ? "जो पहले से भीतर विद्यमान है, उसे बाहर न खोजकर अज्ञान के आवरण को हटाना ही सत्य की प्राप्ति है।"
        : "Understanding what already exists within human life, rather than chasing fulfillment as something outside the self.",
    },
    {
      title: "वसुधैव कुटुम्बकम्",
      ref: hi ? "महोपनिषद् ६.७१ · हितोपदेश" : "Maha Upanishad 6.71",
      text: hi
        ? "यह मेरा है, वह पराया है—ऐसी संकीर्णता से मुक्त होकर सम्पूर्ण मानवता को एक परिवार रूप में देखना।"
        : "Humanity as one family, rooted in shared ecological, social, and cultural memory.",
    },
    {
      title: "सत्यमेव जयते",
      ref: hi ? "मुण्डकोपनिषद् ३.१.६" : "Mundaka Upanishad 3.1.6",
      text: hi
        ? "सत्य की ही सदा विजय होती है, असत्य की नहीं। निष्काम कर्म द्वारा विवेक-सम्मत जीवन जीना।"
        : "Truth approached through inquiry, experience, and understanding instead of inherited certainty.",
    },
  ];

  const featuredPdfs = pdfDocuments.filter((d) => d.featured);

  return (
    <div className="museum-home">
      {modalPdf && <PdfModal doc={modalPdf} onClose={() => setModalPdf(null)} />}

      <section className="banyan-hero">
        <TribalMotif className="hero-motif" />
        <div className="hero-seal">
          <img src="/images/praptasya-logo.png" alt="प्राप्तस्य प्राप्ति का चिह्न" width={512} height={512} fetchPriority="high" />
        </div>
        <div className="hero-copy">
          <div className="hero-panel">
            <p className="hero-eyebrow">अनन्तानन्द मानव · {hi ? "लेखक" : "Author"}</p>
            <p className="hero-kicker hero-invocation">जय सेवा जय बड़ादेव जय बूढ़ादेव</p>
            <h1>प्राप्तस्य प्राप्ति</h1>
            <h2>{hi ? "मानव जीवन का मूल संविधान" : "The Fundamental Constitution of Human Life"}</h2>
            <blockquote>
              {hi ? "जो प्राप्त है, उसकी ओर लौटने का निमंत्रण।" : "An invitation to return to what is already present."}
            </blockquote>
            <div className="hero-actions">
              <button onClick={() => navigate({ name: "articles", readId: COMPLETE_BOOK_ID, readPage: 1 })} className="btn-primary">
                {hi ? "पूरा ग्रंथ पढ़ें" : "Read the complete book"} <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => navigate({ name: "articles" })} className="btn-ghost">
                {hi ? "सभी रचनाएँ" : "All writings"}
              </button>
              <button onClick={() => navigate({ name: "gallery" })} className="btn-ghost">
                <Play className="w-4 h-4 text-saffron" /> {hi ? "वीडियो देखें" : "Watch videos"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* What is Praptasya Prapti */}
      <section className="idea-section">
        <div className="section-grid">
          <div>
            <Kicker>{hi ? "प्राप्तस्य प्राप्ति क्या है?" : "What is Praptasya Prapti?"}</Kicker>
            <h2 className="museum-title">{hi ? "न कोई नया धर्म। न कोई नई पद्धति।" : "Not another religion. Not another method."}</h2>
          </div>
          <div className="museum-copy">
            <p>
              {hi
                ? "प्राप्तस्य प्राप्ति मानव जीवन, स्वतंत्रता और ज्ञान की प्रकृति पर एक स्वतंत्र जिज्ञासा है। यह उस संभावना को देखती है कि जिसे हम खोजते हैं, वह हमारे भीतर पहले से विद्यमान हो सकता है।"
                : "Praptasya Prapti is an inquiry into human life, freedom, knowledge, and the possibility that what we seek may already be inherent within us."}
            </p>
            <p>
              {hi
                ? "यह ग्रंथ पाठक को विरासत में मिली मान्यताओं की पड़ताल करने और चेतना, समाज, प्रकृति तथा मानव अस्तित्व के प्रश्नों पर विचार करने का निमंत्रण देता है।"
                : "The book invites readers to examine inherited assumptions and explore questions about consciousness, society, nature, and human existence."}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Video Discourse */}
      <section className="idea-section bg-paper-dark/40 border-y border-ink/10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Kicker>{hi ? "वीडियो उद्बोधन" : "Featured Video Discourse"}</Kicker>
            <h2 className="text-3xl md:text-4xl text-maroon">{hi ? "लेखक का विशेष वीडियो संदेश" : "Author's Video Address"}</h2>
            <p className="font-body text-ink-soft text-base mt-2">
              {hi
                ? "जीवन के मूल प्रश्नों और ग्रंथ के वैचारिक सूत्रों पर लेखक के विचार सुनें।"
                : "Listen to the author discuss foundational questions on human life and consciousness."}
            </p>
          </div>
          <VideoSection />
          <div className="text-center mt-8">
            <button onClick={() => navigate({ name: "gallery" })} className="link-arrow">
              {hi ? "सभी वीडियो एवं कला दीर्घा देखें" : "View all videos and visual gallery"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Three Pillars with Scripture Citations */}
      <section className="idea-section muted-band">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <Kicker>{hi ? "मूल वैचारिक स्तम्भ" : "The Core Pillars"}</Kicker>
            <h2 className="text-3xl md:text-4xl text-maroon">{hi ? "वैदिक महावाक्य एवं दार्शनिक आधार" : "Vedic Mahavakyas & Philosophical Roots"}</h2>
            <p className="font-body text-ink-soft text-base mt-2">
              {hi
                ? "प्राचीन उपनिषदों के शाश्वत सूत्रों पर आधारित निष्काम एवं स्वाभाविक मानव जीवन का मार्ग।"
                : "Foundational ancient verses reflecting the path of spontaneous, truthful living."}
            </p>
          </div>

          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <motion.button key={pillar.title} {...fade} onClick={() => navigate({ name: "philosophy" })} className="museum-card text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="scripture-pill">
                      <BookOpen className="w-3 h-3" />
                      {pillar.ref}
                    </span>
                  </div>
                  <h3 className="text-2xl text-maroon mb-2">{pillar.title}</h3>
                  <p className="text-sm font-body text-ink-soft leading-relaxed">{pillar.text}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-ink/10 flex items-center text-xs font-semibold text-saffron-deep">
                  <span>{hi ? "विस्तृत ग्रन्थ सन्दर्भ पढ़ें" : "Read Full Citation & Meaning"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Spotlight: Original Handwritten Manuscript */}
      <section className="idea-section bg-paper-dark/30 border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <Kicker>{hi ? "मूल हस्तलिखित दस्तावेज़" : "Original Manuscript"}</Kicker>
              <h2 className="text-3xl md:text-4xl text-maroon">{hi ? "लेखक की मूल हस्तलिखित पांडुलिपि" : "Original Handwritten Leaves"}</h2>
              <p className="font-body text-ink-soft text-base mt-2">
                {hi
                  ? "लेखक श्री हरनारायण साह द्वारा स्वयं लिखित मूल पृष्ठ — उच्च-गुणवत्ता स्कैन एवं सुगम डिजिटल पाठ।"
                  : "Handwritten manuscript pages penned by the author — high-res scans with extracted digital text."}
              </p>
            </div>
            <button onClick={() => navigate({ name: "philosophy" })} className="link-arrow mt-4 md:mt-0 shrink-0">
              {hi ? "पांडुलिपि वाचनालय खोलें" : "Open Full Manuscript Reader"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <ManuscriptSection />
        </div>
      </section>

      {/* Featured E-Library Shelf */}
      <section className="idea-section">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <Kicker>{hi ? "डिजिटल ग्रंथागार" : "E-Library & Publications"}</Kicker>
              <h2 className="text-3xl md:text-4xl text-maroon">{hi ? "प्रमुख PDF ग्रंथ एवं आलेख" : "Featured Books & Documents"}</h2>
              <p className="font-body text-ink-soft text-base mt-2">
                {hi
                  ? "सभी ग्रंथ, शोध आलेख एवं संस्मरण ऑनलाइन पढ़ें अथवा निःशुल्क PDF डाउनलोड करें।"
                  : "Read online or download the full books, essays, and biographical texts."}
              </p>
            </div>
            <button onClick={() => navigate({ name: "articles" })} className="link-arrow mt-4 md:mt-0 shrink-0">
              {hi ? "सम्पूर्ण पुस्तकालय (9 रचनाएँ)" : "View the complete library (9 works)"} <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPdfs.map((doc) => (
              <motion.div
                key={doc.id}
                {...fade}
                className="pdf-card bg-paper-dark/50 border border-ink/10 rounded-sm p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[0.7rem] font-bold uppercase tracking-wider px-2 py-0.5 bg-saffron/15 text-saffron-deep rounded-xs">
                      {hi ? doc.tagHi || doc.categoryHi : doc.tagEn || doc.categoryEn}
                    </span>
                    <span className="font-body text-xs text-ink-soft">{doc.fileSize}</span>
                  </div>
                  <h3 className="font-serif text-xl text-maroon mb-2">{hi ? doc.titleHi : doc.titleEn}</h3>
                  <p className="font-body text-sm text-ink-soft leading-relaxed mb-6">
                    {hi ? doc.descriptionHi : doc.descriptionEn}
                  </p>
                </div>
                <div className="pt-4 border-t border-ink/10 flex items-center justify-between">
                  <button
                    onClick={() =>
                      doc.category === "manuscript"
                        ? setModalPdf(doc)
                        : navigate({ name: "articles", readId: doc.id, readPage: 1 })
                    }
                    className="font-body text-sm font-medium text-saffron-deep hover:text-maroon inline-flex items-center gap-1.5"
                  >
                    <Eye className="w-4 h-4" /> {hi ? "ऑनलाइन पढ़ें" : "Read Online"}
                  </button>
                  <a
                    href={doc.filePath}
                    download
                    className="p-2 text-ink-soft hover:text-maroon rounded-sm bg-paper border border-ink/10"
                    title={hi ? "डाउनलोड करें" : "Download PDF"}
                  >
                    <Download className="w-4 h-4 text-saffron-deep" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Book Feature */}
      <section className="idea-section">
        <div className="book-feature">
          <div className="book-stack">
            <img src="/images/book-cover.png" alt="प्राप्तस्य प्राप्ति पुस्तक का आवरण" />
          </div>
          <div>
            <Kicker>{hi ? "मुख्य ग्रंथ" : "The core book"}</Kicker>
            <h2 className="museum-title">{hi ? "लेखक: अनन्तानन्द मानव" : "Written by Anantanand Manav"}</h2>
            <p className="museum-copy">
              {hi
                ? "यह कृति मानव जीवन, ज्ञान, मुक्ति, सामाजिक संरचनाओं और एक सामंजस्यपूर्ण मानव समाज की दृष्टि पर लेखक की खोज प्रस्तुत करती है।"
                : "This work presents the author's exploration of human life, knowledge, liberation, social structures, and the vision of a harmonious human society."}
            </p>
            <p className="museum-copy">
              {hi
                ? "धर्म से लेकर ज्ञान, कर्म, मानव स्वभाव, समाज और अस्तित्व के दार्शनिक प्रश्नों तक — यह पुस्तक हर पाठक को स्वयं सोचने का निमंत्रण देती है।"
                : "Across its chapters, it discusses topics ranging from religion and knowledge to karma, human nature, society, and philosophical questions about existence."}
            </p>
            <div className="flex flex-wrap gap-4 mt-5">
              <button onClick={() => navigate({ name: "articles", readId: COMPLETE_BOOK_ID, readPage: 1 })} className="link-arrow">
                {hi ? "पूरा ग्रंथ अभी पढ़ें" : "Read the full book now"} <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="/pdfs/praptasya-prapti-complete-book.pdf"
                download
                className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-saffron-deep underline underline-offset-4"
              >
                <Download className="w-3.5 h-3.5" /> {hi ? "सम्पूर्ण PDF (7.1 MB)" : "Full Book PDF (7.1 MB)"}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Chapter Rail */}
      <section className="idea-section chapter-band">
        <Kicker>{hi ? "अध्यायों की यात्रा" : "Journey through the chapters"}</Kicker>
        <div className="chapter-rail">
          {chapters.map((c) => (
            <button key={c.num} onClick={() => navigate({ name: "articles", readId: COMPLETE_BOOK_ID, readPage: 1 })} className="chapter-node">
              <span>{c.num}</span>
              <strong>{c.title}</strong>
            </button>
          ))}
        </div>
      </section>

      {/* Author Section */}
      <section className="idea-section">
        <div className="author-feature">
          <img src="/images/harnarayan-shah.jpg" alt="Harnarayan Sah" />
          <div>
            <Kicker>{hi ? "लेखक परिचय" : "About the Author"}</Kicker>
            <h2 className="museum-title">{hi ? "हरनारायण साह" : "Harnarayan Sah"}</h2>
            <p className="author-role">{hi ? "लेखकीय नाम: अनन्तानन्द मानव · मानव मुक्ति मंच" : "Pen name: Anantanand Manav · Manav Mukti Manch"}</p>
            <p className="museum-copy">
              The website presents the author's journey, writings, and philosophy without making it only about personality. The focus remains on ideas, inquiry, and the human questions behind the work.
            </p>
            <div className="flex flex-wrap gap-4 items-center mt-5">
              <button onClick={() => navigate({ name: "about" })} className="link-arrow">
                {hi ? "जीवन-यात्रा पढ़ें" : "Read the Journey"} <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="/pdfs/sanskriti-ka-khel.pdf"
                download
                className="inline-flex items-center gap-1.5 text-xs font-body font-semibold text-saffron-deep underline underline-offset-4"
              >
                <Download className="w-3.5 h-3.5" /> {hi ? "संस्कृति का खेल — काव्य PDF (15 पृष्ठ)" : "Sanskriti Ka Khel — Poetry PDF (15 pages)"}
              </a>
              <a href="https://www.facebook.com/harnarayan.sah.73" target="_blank" rel="noreferrer" className="facebook-link">
                Facebook <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="quote-band">
        <p>{hi ? "विचार का आरम्भ उत्तर से नहीं, प्रश्न करने की स्वतंत्रता से होता है।" : "Thought begins not with an answer, but with the freedom to question."}</p>
        <span>{hi ? "प्राप्तस्य प्राप्ति · चिंतन का आमंत्रण" : "Praptasya Prapti · An invitation to inquiry"}</span>
      </section>

      {/* Library shortcuts */}
      <section className="idea-section library-section">
        <Kicker>{hi ? "पुस्तकालय | शॉर्टकट" : "Library shortcuts"}</Kicker>
        <div className="library-grid">
          {[
            { hi: "पूरा ग्रंथ पढ़ें", en: "Read the full book", target: "articles" as const, readId: COMPLETE_BOOK_ID },
            { hi: "सभी रचनाएँ (9)", en: "All writings (9)", target: "articles" as const, readId: undefined as string | undefined },
            { hi: "विचार-लेख", en: "Online essays", target: "article" as const, slug: articles[0].slug },
            { hi: "वीडियो एवं कला", en: "Videos & art", target: "gallery" as const },
            { hi: "दर्शन एवं शास्त्र", en: "Philosophy & scripture", target: "philosophy" as const },
            { hi: "आयोजन", en: "Events", target: "events" as const },
          ].map((item) => (
            <button
              key={item.hi}
              onClick={() => {
                if (item.target === "article") {
                  navigate({ name: "article", slug: (item as { slug: string }).slug });
                } else if (item.target === "articles") {
                  navigate({ name: "articles", readId: item.readId, readPage: item.readId ? 1 : undefined });
                } else if (item.target === "gallery") {
                  navigate({ name: "gallery" });
                } else if (item.target === "philosophy") {
                  navigate({ name: "philosophy" });
                } else {
                  navigate({ name: "events" });
                }
              }}
            >
              <span>{hi ? item.hi : item.en}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- ABOUT ---------- */

export function About({ navigate }: { navigate: Nav }) {
  const language = useLanguage();
  const hi = language !== "en";

  const blocks = [
    { icon: ScrollText, title: "जीवन यात्रा", text: "एक साधारण जीवन से आरंभ हुई यह यात्रा प्रश्नों से भरी रही। हर अनुभव, हर संघर्ष ने चिंतन को गहराई दी और लेखक को मूल प्रश्नों की ओर मोड़ा।" },
    { icon: Sparkles, title: "साधना / शोध यात्रा", text: "वर्षों तक शास्त्रों का अध्ययन, विभिन्न परंपराओं का सत्संग, मौन साधना और आत्म-निरीक्षण — इसी तपस्या से इस ग्रंथ के विचार परिपक्व हुए।" },
    { icon: Feather, title: "क्यों लिखा यह ग्रंथ", text: "लेखक ने अनुभव किया कि आज मनुष्य को तैयार उत्तरों की नहीं, स्वयं सोचने के साहस की आवश्यकता है। यही आवश्यकता इस ग्रंथ का बीज बनी।" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-5 py-20 md:py-24">
      <PageHead
        kicker="लेखक परिचय"
        title="लेखक की विचार-यात्रा"
        sub="एक स्वतंत्र चिंतक, साधक एवं कलाकार — जिनकी लेखनी किसी मत का प्रचार नहीं, विवेक का आह्वान करती है।"
      />

      <motion.div {...fade} className="grid md:grid-cols-5 gap-10 items-start mb-20">
        <div className="md:col-span-2 space-y-6">
          <figure className="m-0">
            <img
              src="/images/harnarayan-shah.jpg"
              alt={hi ? "लेखक श्री हरनारायण साह (अनन्तानन्द मानव)" : "Author Shri Harnarayan Sah (Anantanand Manav)"}
              className="w-full aspect-[4/5] object-cover rounded-md border border-ink/10"
              width={1170}
              height={1170}
              loading="eager"
            />
            <figcaption className="font-body text-sm text-ink-soft mt-3">
              {hi ? "श्री हरनारायण साह · अनन्तानन्द मानव" : "Shri Harnarayan Sah · Anantanand Manav"}
            </figcaption>
          </figure>
        </div>

        <div className="md:col-span-3 space-y-8">
          {blocks.map((b) => (
            <div key={b.title} className="flex gap-4">
              <div className="shrink-0 w-11 h-11 rounded-sm bg-saffron/10 border border-saffron/30 flex items-center justify-center">
                <b.icon className="w-5 h-5 text-saffron-deep" />
              </div>
              <div>
                <h3 className="text-xl text-maroon mb-2">{b.title}</h3>
                <p className="font-body text-ink-soft leading-relaxed">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Author video messages */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Video className="w-6 h-6 text-saffron-deep" />
          <h2 className="text-2xl md:text-3xl text-maroon font-serif">
            {hi ? "लेखक के वीडियो संदेश" : "Author's video messages"}
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {videoItems.map((vid, i) => (
            <motion.figure key={vid.id} {...fade} className="m-0 bg-paper-dark/40 border border-ink/10 rounded-md overflow-hidden">
              <div className="bg-black aspect-video">
                <video src={vid.videoUrl} controls playsInline preload="metadata" className="w-full h-full object-contain" />
              </div>
              <figcaption className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-saffron/10 text-saffron-deep text-[0.7rem] font-bold uppercase rounded-xs">
                    {hi ? `भाग ${i + 1}` : `Part ${i + 1}`}
                  </span>
                  <span className="font-body text-xs text-ink-soft flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {vid.duration}</span>
                </div>
                <h3 className="font-serif text-lg text-maroon mb-1">{hi ? vid.titleHi : vid.titleEn}</h3>
                <p className="font-body text-sm text-ink-soft leading-relaxed">{hi ? vid.descriptionHi : vid.descriptionEn}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* Author's art images */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-saffron-deep" />
          <h2 className="text-2xl md:text-3xl text-maroon font-serif">
            {hi ? "विचारों से प्रेरित कलाकृतियाँ" : "Art inspired by these ideas"}
          </h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {gallery.map((g) => (
            <motion.figure key={g.title} {...fade} className="m-0 group">
              <div className="relative overflow-hidden rounded-md border border-ink/10 bg-paper-dark">
                <img src={g.src} alt={g.title} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" width={600} height={600} />
              </div>
              <figcaption className="mt-3">
                <h3 className="font-serif text-lg text-maroon">{g.title}</h3>
                <p className="font-body text-sm text-ink-soft">{g.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      <div className="text-center flex flex-wrap justify-center gap-4">
        <button onClick={() => navigate({ name: "book" })} className="btn-primary">
          <BookOpen className="w-5 h-5" /> {hi ? "ग्रंथ के बारे में जानें" : "Explore the Book"}
        </button>
        <button onClick={() => navigate({ name: "gallery" })} className="btn-ghost">
          <Play className="w-4 h-4 text-saffron" /> {hi ? "मीडिया एवं कला-दीर्घा" : "Media & Gallery"}
        </button>
      </div>
    </div>
  );
}

/* ---------- BOOK ---------- */

export function Book({ navigate }: { navigate: Nav }) {
  return <LibraryHub navigate={navigate} initialRead={{ id: COMPLETE_BOOK_ID, page: 1 }} />;
}

/* ---------- PHILOSOPHY ---------- */

export function Philosophy({ navigate }: { navigate: Nav }) {
  const language = useLanguage();
  const hi = language !== "en";

  return (
    <div>
      <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
        <PageHead
          kicker="विचार-दर्शन"
          title="वैचारिक स्तम्भ एवं शास्त्र सन्दर्भ"
          sub="नीचे प्रस्तुत विचार उपनिषदों, वेदान्त एवं सहज जीवन दर्शन पर आधारित लेखक की स्वतंत्र दृष्टि हैं। यह किसी मत का प्रचार नहीं — विवेक जगाने का निमंत्रण है।"
        />

        {/* Pillars with Scripture Citations and Sanskrit Shlokas */}
        <div className="space-y-8 mb-20">
          {philosophyPillars.map((p, i) => (
            <motion.div
              key={p.id}
              {...fade}
              className={`rounded-sm overflow-hidden border border-ink/10 ${
                i % 2 === 0 ? "paper-texture" : "bg-paper-dark/50"
              }`}
            >
              <div className="p-6 md:p-8 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-2xl md:text-3xl text-saffron-deep font-bold">
                      {p.sanskrit}
                    </span>
                    <span className="scripture-pill">
                      <BookOpen className="w-3.5 h-3.5" />
                      {hi ? p.shlokRef : p.sourceEn}
                    </span>
                  </div>
                  <span className="text-xs font-body font-semibold text-ink-soft bg-paper px-3 py-1 rounded-sm border border-ink/10">
                    {hi ? p.sourceHi : p.sourceEn}
                  </span>
                </div>

                {/* Sanskrit Full Verse Box */}
                {p.fullSanskrit && (
                  <div className="bg-maroon/5 border-l-3 border-saffron rounded-xs p-4 my-2">
                    <p className="font-serif text-lg md:text-xl text-maroon leading-relaxed">
                      “{p.fullSanskrit}”
                    </p>
                  </div>
                )}

                <div>
                  <h3 className="text-xl md:text-2xl text-maroon font-serif mb-2">{p.title}</h3>
                  <p className="font-body text-base md:text-lg text-ink-soft leading-relaxed">{p.text}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="gold-rule w-full my-16 opacity-50" />

        {/* Interactive Original Manuscript Section */}
        <section className="mb-20">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <Kicker>{hi ? "पांडुलिपि वाचनालय" : "Manuscript Archives"}</Kicker>
            <h2 className="text-3xl md:text-4xl text-maroon font-serif">
              {hi ? "लेखक की मूल हस्तलिखित पांडुलिपि एवं दार्शनिक आलेख" : "Original Handwritten Manuscript & Discourse"}
            </h2>
            <p className="font-body text-ink-soft text-base mt-2">
              {hi
                ? "लेखक श्री हरनारायण साह द्वारा स्वयं लिखित मूल पृष्ठों का अवलोकन करें तथा सुगम डिजिटल पाठ पढ़ें।"
                : "Explore the original handwritten manuscript leaves penned by Shri Harnarayan Sah along with extracted text."}
            </p>
          </div>

          <ManuscriptSection />
        </section>
      </div>

      {/* Quote wall */}
      <section className="paper-dark-texture text-paper">
        <div className="max-w-5xl mx-auto px-5 py-20 md:py-24">
          <div className="text-center mb-12">
            <span className="font-body text-xs tracking-[0.3em] uppercase text-gold-soft">प्रमुख उद्धरण</span>
            <h2 className="text-3xl md:text-4xl text-paper mt-3">विचार-कण</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {quotes.map((q, i) => (
              <motion.div key={i} {...fade} className="border border-ink/10 rounded-sm p-7 bg-black/10">
                <Quote className="w-6 h-6 text-gold-soft mb-3" />
                <p className="font-serif text-xl md:text-2xl leading-relaxed text-paper">“{q}”</p>
              </motion.div>
            ))}
          </div>
          <p className="font-body text-center text-sm tracking-[0.25em] uppercase text-gold-soft mt-10">— लेखक के विचार</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-5 py-20 text-center">
        <button onClick={() => navigate({ name: "articles" })} className="btn-primary">
          विस्तृत प्रवचन एवं ई-पुस्तकालय <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}

/* ---------- LIBRARY HUB (BOOK + LIBRARY + ARTICLES + MEDIA) ---------- */

function LibraryHero({
  doc,
  onStart,
  onReadOthers,
}: {
  doc: PdfDocument;
  onStart: () => void;
  onReadOthers: (doc: PdfDocument) => void;
}) {
  const language = useLanguage();
  const hi = language !== "en";
  const savedPage = typeof doc.pages === "number" ? readStoredPage(doc.id, doc.pages) : 1;
  const others = pdfDocuments.filter((d) => d.id !== doc.id && d.category !== "manuscript").slice(0, 4);

  return (
    <div className="library-hero">
      <div className="library-hero-cover">
        <img src="/images/book-cover.png" alt={hi ? "प्राप्तस्य प्राप्ति का आवरण" : "Praptasya Prapti cover"} />
      </div>
      <div className="library-hero-copy">
        <span className="scripture-pill">
          <BookOpen className="w-3 h-3" />
          {hi ? "मूल ग्रंथ · सभी पृष्ठ निःशुल्क" : "Core book · all pages free"}
        </span>
        <h2>{hi ? doc.titleHi : doc.titleEn}</h2>
        <p className="font-body text-ink-soft leading-relaxed">
          {hi ? doc.descriptionHi : doc.descriptionEn}
        </p>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-body text-sm text-maroon my-4">
          <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-saffron-deep" /> {typeof doc.pages === "number" ? `${doc.pages} ${hi ? "पृष्ठ" : "pages"}` : doc.pages}</span>
          <span className="flex items-center gap-1.5"><Download className="w-4 h-4 text-saffron-deep" /> {doc.fileSize}</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-saffron-deep" /> {hi ? "निःशुल्क" : "Free"}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={onStart} className="btn-primary">
            <BookOpen className="w-5 h-5" />
            {savedPage > 1 ? (hi ? `जारी रखें — पृष्ठ ${savedPage}` : `Continue — page ${savedPage}`) : hi ? "पढ़ना शुरू करें" : "Start reading"}
          </button>
          <a href={doc.filePath} download className="btn-ghost">
            <Download className="w-4 h-4" /> {hi ? "PDF डाउनलोड" : "Download PDF"}
          </a>
          <ShareButtons doc={doc} />
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-6">
          <span className="font-body text-xs text-ink-soft mr-1">{hi ? "यह भी पढ़ें:" : "Also read:"}</span>
          {others.map((d) => (
            <button
              key={d.id}
              onClick={() => onReadOthers(d)}
              className="read-chip"
              title={hi ? d.titleHi : d.titleEn}
            >
              {hi ? d.titleHi.split("—")[0].trim() : d.titleEn.split("—")[0].trim()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function LibraryHub({
  navigate,
  initialRead,
}: {
  navigate: Nav;
  initialRead?: { id: string; page?: number };
}) {
  const language = useLanguage();
  const hi = language !== "en";
  const [activeDoc, setActiveDoc] = useState<PdfDocument | null>(null);
  const [manuscriptDoc, setManuscriptDoc] = useState<PdfDocument | null>(null);
  const [readerPage, setReaderPage] = useState(1);
  const readerAnchorRef = useRef<HTMLDivElement>(null);
  const handledInitialRef = useRef<string | null>(null);

  const openDoc = (doc: PdfDocument, page = 1) => {
    setActiveDoc(doc);
    setReaderPage(page);
    readerAnchorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const q = new URLSearchParams();
    q.set("read", doc.id);
    if (page > 1) q.set("page", String(page));
    window.history.pushState({}, "", `/library?${q.toString()}`);
  };

  const onPageChange = (page: number) => {
    setReaderPage(page);
    if (activeDoc) {
      const q = new URLSearchParams();
      q.set("read", activeDoc.id);
      if (page > 1) q.set("page", String(page));
      window.history.replaceState({}, "", `/library?${q.toString()}`);
    }
  };

  /* open book directly when arriving via deep link / book route */
  useEffect(() => {
    if (!initialRead) return;
    if (handledInitialRef.current === `${initialRead.id}:${initialRead.page ?? 0}`) return;
    const doc = pdfDocuments.find((d) => d.id === initialRead.id);
    if (!doc) return;
    handledInitialRef.current = `${initialRead.id}:${initialRead.page ?? 0}`;
    if (doc.category === "manuscript") {
      setManuscriptDoc(doc);
    } else {
      setActiveDoc(doc);
      setReaderPage(initialRead.page && initialRead.page > 1 ? initialRead.page : 1);
    }
  }, [initialRead]);

  /* keep the reader in sync with browser back/forward */
  useEffect(() => {
    const syncFromUrl = () => {
      const q = new URLSearchParams(window.location.search);
      const id = q.get("read");
      const num = Number(q.get("page"));
      const page = Number.isFinite(num) && num > 1 ? Math.floor(num) : 1;
      if (!id) {
        setActiveDoc(null);
        setReaderPage(1);
        return;
      }
      const doc = pdfDocuments.find((d) => d.id === id);
      if (!doc) return;
      if (doc.category === "manuscript") {
        setManuscriptDoc(doc);
      } else {
        setActiveDoc(doc);
        setReaderPage(page);
      }
    };
    window.addEventListener("popstate", syncFromUrl);
    return () => window.removeEventListener("popstate", syncFromUrl);
  }, []);

  const completeBook = pdfDocuments.find((d) => d.id === COMPLETE_BOOK_ID) || pdfDocuments[0];

  return (
    <div className={activeDoc ? "reader-fold-page" : "max-w-6xl mx-auto px-5 py-16 md:py-20"}>
      {manuscriptDoc && <PdfModal doc={manuscriptDoc} onClose={() => setManuscriptDoc(null)} />}

      {!activeDoc && (
        <PageHead
          kicker={hi ? "पढ़ें — अनन्तानन्द मानव" : "Read — Anantanand Manav"}
          title={hi ? "पूरा ग्रंथ, पूरी लाइब्रेरी — एक पृष्ठ पर" : "The complete book & library on one page"}
          sub={
            hi
              ? "मूल ग्रंथ को एक सतत स्क्रॉल में ऑनलाइन पढ़ें — पिछली/अगली रचना पर एक क्लिक में जाएँ, और नीचे लेखक की सम्पूर्ण रचनाएँ — सभी निःशुल्क, बिना किसी शर्त के।"
              : "Read the complete book as one continuous scroll — switch to the previous or next work with one click, and explore every writing below — all free, no sign-up, no paywall."
          }
        />
      )}

      {/* ---- READING EXPERIENCE (fills the first fold) ---- */}
      <section
        className={activeDoc ? "reader-fold-area" : "mb-24"}
        ref={readerAnchorRef}
        aria-label={hi ? "पुस्तक पाठक" : "Book reader"}
      >
        {activeDoc ? (
          <PdfReader
            doc={activeDoc}
            initialPage={readerPage}
            onClose={() => {
              setActiveDoc(null);
              setReaderPage(1);
              window.history.replaceState({}, "", "/library");
            }}
            onPageChange={onPageChange}
            onSwitchDoc={(doc) => {
              setActiveDoc(doc);
              setReaderPage(1);
            }}
            docs={pdfDocuments}
          />
        ) : (
          <LibraryHero
            doc={completeBook}
            onStart={() => openDoc(completeBook, readStoredPage(completeBook.id, Number(completeBook.pages) || 60))}
            onReadOthers={(doc) => (doc.category === "manuscript" ? setManuscriptDoc(doc) : openDoc(doc))}
          />
        )}
      </section>

      <div className="gold-rule w-full my-4 opacity-50" />

      {/* ---- FULL LIBRARY ---- */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-saffron-deep" />
          <div>
            <h2 className="text-2xl md:text-3xl text-maroon font-serif">
              {hi ? "लेखक की सम्पूर्ण रचनाएँ" : "All writings by the author"}
            </h2>
            <p className="font-body text-sm text-ink-soft mt-1">
              {hi
                ? "हर रचना ऑनलाइन पढ़ें या PDF डाउनलोड करें — सब कुछ निःशुल्क।"
                : "Read online or download every work as PDF — all free."}
            </p>
          </div>
        </div>
        <PdfRepository onRead={(doc) => openDoc(doc)} onManuscript={(doc) => setManuscriptDoc(doc)} />
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <DownloadAllZip docs={pdfDocuments} />
          <p className="font-body text-xs text-ink-soft">
            {hi ? "9 रचनाएँ · PDF प्रारूप — किसी भी डिवाइस पर खुलेंगी।" : "All 9 works · PDF format — opens on any device."}
          </p>
        </div>
      </section>

      <div className="gold-rule w-full my-4 opacity-50" />

      {/* ---- ONLINE ESSAYS ---- */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <ScrollText className="w-6 h-6 text-saffron-deep" />
          <div>
            <h2 className="text-2xl md:text-3xl text-maroon font-serif">
              {hi ? "ऑनलाइन प्रवचन एवं विचार-लेख" : "Online essays & discourses"}
            </h2>
            <p className="font-body text-sm text-ink-soft mt-1">
              {hi ? "ग्रंथ से लिए गए मुख्य विषयों पर केंद्रित वेब आलेख।" : "Focused web essays based on core book themes."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((a) => (
            <motion.button
              key={a.slug}
              {...fade}
              onClick={() => navigate({ name: "article", slug: a.slug })}
              className="w-full text-left group bg-paper-dark/40 border border-ink/10 rounded-sm p-7 hover:border-saffron transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-3 font-body text-sm text-saffron-deep">
                  <span className="tracking-widest uppercase">{a.category}</span>
                  <span className="text-gold">•</span>
                  <span className="flex items-center gap-1 text-ink-soft"><Clock className="w-3.5 h-3.5" /> {a.readTime}</span>
                </div>
                <h3 className="text-xl md:text-2xl text-maroon mb-2 group-hover:text-saffron-deep transition-colors">
                  {a.title}
                </h3>
                <p className="font-body text-ink-soft leading-relaxed mb-4">{a.excerpt}</p>
              </div>
              <span className="link-arrow mt-2">{hi ? "पूरा पढ़ें" : "Read full"} <ArrowRight className="w-4 h-4" /></span>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="gold-rule w-full my-4 opacity-50" />

      {/* ---- MEDIA (VIDEOS) ---- */}
      <section className="mb-24">
        <div className="flex items-center gap-3 mb-8">
          <Video className="w-6 h-6 text-saffron-deep" />
          <div>
            <h2 className="text-2xl md:text-3xl text-maroon font-serif">
              {hi ? "लेखक के वीडियो संदेश" : "Author's video messages"}
            </h2>
            <p className="font-body text-sm text-ink-soft mt-1">
              {hi ? "ग्रंथ और जीवन-दर्शन पर लेखक के उद्बोधन — यहीं सुनें।" : "Listen to the author on the book and life's questions."}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {videoItems.map((vid, i) => (
            <motion.div key={vid.id} {...fade} className="bg-paper-dark/40 border border-ink/10 rounded-sm overflow-hidden">
              <div className="bg-black aspect-video">
                <video src={vid.videoUrl} controls playsInline preload="metadata" className="w-full h-full object-contain" />
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-saffron/15 text-saffron-deep text-[0.7rem] font-bold uppercase rounded-xs">
                    {hi ? `भाग ${i + 1}` : `Part ${i + 1}`}
                  </span>
                  <span className="font-body text-xs text-ink-soft flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {vid.duration}</span>
                </div>
                <h3 className="font-serif text-lg text-maroon mb-1">{hi ? vid.titleHi : vid.titleEn}</h3>
                <p className="font-body text-sm text-ink-soft line-clamp-2 mb-3">{hi ? vid.descriptionHi : vid.descriptionEn}</p>
                <button onClick={() => navigate({ name: "gallery" })} className="link-arrow text-xs">
                  {hi ? "कला दीर्घा व सभी मीडिया" : "Gallery & all media"} <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <div className="gold-rule w-full my-4 opacity-50" />

      {/* ---- REACH: SIGNUP + CONTACT ---- */}
      <section className="mb-10">
        <ReaderSignup />
      </section>

      {/* ---- BACK TO AUTHOR / HOME ---- */}
      <div className="text-center mt-12">
        <button onClick={() => navigate({ name: "about" })} className="link-arrow">
          {hi ? "लेखक के बारे में जानें" : "Meet the author"} <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function Articles({ navigate }: { navigate: Nav }) {
  return <LibraryHub navigate={navigate} />;
}

export function ArticleDetail({ article, navigate }: { article: Article; navigate: Nav }) {
  return (
    <article className="max-w-2xl mx-auto px-5 py-20 md:py-24">
      <button onClick={() => navigate({ name: "articles" })} className="link-arrow mb-8">
        <ArrowLeft className="w-4 h-4" /> सभी प्रवचन एवं ग्रंथागार
      </button>
      <div className="flex items-center gap-3 mb-4 font-body text-sm text-saffron-deep">
        <span className="tracking-widest uppercase">{article.category}</span>
        <span className="text-gold">•</span>
        <span className="flex items-center gap-1 text-ink-soft"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
      </div>
      <h1 className="text-4xl md:text-5xl text-maroon-deep leading-tight mb-6">{article.title}</h1>
      <div className="space-y-6">
        {article.body.map((para, i) => (
          <p
            key={i}
            className={`font-body text-lg leading-[1.9] text-ink ${
              i === 0
                ? "first-letter:font-serif first-letter:text-6xl first-letter:text-saffron-deep first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8] first-letter:mt-1"
                : ""
            }`}
          >
            {para}
          </p>
        ))}
      </div>
      <div className="gold-rule w-full my-12" />
      <p className="font-body text-sm tracking-[0.25em] uppercase text-saffron-deep">— लेखक के विचार</p>
    </article>
  );
}

/* ---------- GOND CULTURE ---------- */

type CultureLanguage = "hi" | "en" | "gon";

const cultureSections = [
  {
    titleHi: "एक जीवित और विविध परंपरा",
    titleEn: "A living and diverse tradition",
    titleGon: "जीवा अर अलग-अलग रीति",
    bodyHi: "गोंड समुदाय मध्य भारत के विस्तृत भूभाग में अनेक क्षेत्रीय समूहों, बोलियों और स्थानीय परंपराओं के साथ निवास करता है। इस पृष्ठ का केंद्र मध्य प्रदेश और छत्तीसगढ़ है; इसलिए यहाँ प्रस्तुत परिचय को संपूर्ण गोंड समाज का एकमात्र रूप नहीं माना जाना चाहिए।",
    bodyEn: "Gond communities live across a wide region of central India, with distinct regional groups, speech varieties, and local traditions. This page focuses on Madhya Pradesh and Chhattisgarh and does not present one regional account as universal to all Gond people.",
    bodyGon: "कोइतूर लोकुर मध्य भारत ता वेल्ले जागा न मन्टोर। अलग-अलग नाटे न गोंडी बास अर रीति अलग मंता। ई पन्ना मध्य प्रदेश अर छत्तीसगढ़ ता गोंड जीवना बारे न मंता।",
  },
  {
    titleHi: "गोंडवाना और ऐतिहासिक स्मृति",
    titleEn: "Gondwana and historical memory",
    titleGon: "गोंडवाना अर इतिहास ता याद",
    bodyHi: "गोंडवाना केवल एक भौगोलिक नाम नहीं, बल्कि शासन, समुदाय और सांस्कृतिक स्मृति से जुड़ा ऐतिहासिक क्षेत्र है। मध्य भारत में अनेक गोंड राजवंशों, दुर्गों, जल-संरचनाओं और स्थानीय शासन परंपराओं ने इस स्मृति को आकार दिया।",
    bodyEn: "Gondwana is more than a geographical expression; it is a historical region connected with governance, community, and cultural memory. Gond dynasties, forts, water systems, and traditions of local administration helped shape this memory across central India.",
    bodyGon: "गोंडवाना मावा भूम अर मावा इतिहास ता पोरोल आंद। गोंड राजा, गढ़, एर ता काम अर नाटे ता राज मावा याद न मंता।",
  },
  {
    titleHi: "गोंडी भाषा और मौखिक ज्ञान",
    titleEn: "Gondi language and oral knowledge",
    titleGon: "गोंडी बास अर वाचा ज्ञान",
    bodyHi: "गोंडी द्रविड़ भाषा परिवार की भाषा है और इसके अनेक क्षेत्रीय रूप हैं। गीत, कथाएँ, वंश-स्मृतियाँ और सामुदायिक ज्ञान लंबे समय से मौखिक परंपरा में संचित और प्रसारित होते रहे हैं। गोंडी को देवनागरी, तेलुगु तथा गोंडी लिपियों सहित विभिन्न लिपियों में लिखा जाता है।",
    bodyEn: "Gondi belongs to the Dravidian language family and has several regional varieties. Songs, narratives, genealogical memory, and community knowledge have long been carried through oral traditions. Gondi is written in several scripts, including Devanagari, Telugu, and dedicated Gondi scripts.",
    bodyGon: "गोंडी मावा बास आंद। अलग-अलग जागा न बास ता रूप अलग मंता। पाटा, कथा, पुरखा ता याद अर नाटे ता ज्ञान पीढ़ी ते पीढ़ी दाका वाचा न वात। गोंडी देवनागरी, तेलुगु अर गोंडी लिपि न लिखना कींतोर।",
  },
  {
    titleHi: "प्रकृति, कुल और पारस्परिकता",
    titleEn: "Nature, clans, and reciprocity",
    titleGon: "भूम, कुल अर संगवारी जीवना",
    bodyHi: "कई गोंड परंपराओं में मनुष्य को भूमि, वनस्पति, जीव-जगत और पूर्वजों से अलग नहीं देखा जाता। कुल-चिह्न, स्थानीय पर्यावरण और सामुदायिक उत्तरदायित्व सामाजिक संबंधों को समझने की महत्वपूर्ण कुंजियाँ हैं, यद्यपि इनके रूप क्षेत्रानुसार बदलते हैं।",
    bodyEn: "Many Gond traditions understand human life in relation to land, plants, animals, and ancestors. Clan symbols, local ecology, and community responsibilities are important ways of reading social relationships, although their forms vary by region.",
    bodyGon: "भूम, एर, मर्रा, जीव, मनकल अर पुरखा अलग हिल्लेर। कुल ता चिन्ह, जंगल अर नाटे ता जिम्मेदारी मावा संगवारी जीवना न खास मंता।",
  },
  {
    titleHi: "आस्था और सामुदायिक संसार",
    titleEn: "Faith and the community world",
    titleGon: "पेन-पुनेम अर नाटे ता जीवना",
    bodyHi: "बड़ादेव, बूढ़ादेव, पूर्वज-स्मृति और ग्राम-आधारित आस्थाएँ अनेक समुदायों के सांस्कृतिक जीवन में महत्वपूर्ण स्थान रखती हैं। नाम, अनुष्ठान और अर्थ स्थानीय परंपराओं के अनुसार भिन्न हो सकते हैं; इसलिए यह परिचय किसी एक व्याख्या को अंतिम नहीं मानता।",
    bodyEn: "Bada Dev, Budha Dev, ancestral memory, and village-centred forms of faith hold important places in the cultural life of many communities. Names, rituals, and meanings differ locally, so this introduction does not treat any single interpretation as definitive.",
    bodyGon: "बड़ादेव, बूढ़ादेव, पेन अर पुरखा ता याद मावा जीवना न खास मंता। नाटे-नाटे न पोरोल, सेवा अर रीति अलग मन्ता; ओना माटी एके आखरी अर्थ आयो।",
  },
  {
    titleHi: "कला, संगीत और सामूहिक अभिव्यक्ति",
    titleEn: "Art, music, and collective expression",
    titleGon: "चित्र, पाटा अर नाच",
    bodyHi: "चित्रांकन, गीत, नृत्य, वाद्य, देह-अलंकरण और कथा-वाचन केवल सजावटी रूप नहीं हैं; वे स्मृति, संबंध और सामुदायिक अनुभव को व्यक्त करते हैं। समकालीन गोंड कला ने विश्व स्तर पर पहचान बनाई है, जबकि उसकी जड़ें विविध स्थानीय दृश्य और कथात्मक परंपराओं में हैं।",
    bodyEn: "Painting, song, dance, instruments, body ornamentation, and storytelling are not merely decorative forms; they express memory, relationships, and collective experience. Contemporary Gond art has gained international recognition while remaining connected to varied local visual and narrative traditions.",
    bodyGon: "चित्र, पाटा, नाच, बाजा अर कथा सिरिफ सजावट आयो। इव मावा याद, संबंध अर संगवारी जीवना वेहंतांग। गोंड कला मावा नाटे ता कथा अर प्रकृति संग जोड़ेम मंता।",
  },
];

export function GondCulture() {
  const siteLanguage = useLanguage();
  const [cultureLanguage, setCultureLanguage] = useState<CultureLanguage>(siteLanguage);
  const isHindi = cultureLanguage === "hi";
  const isGondi = cultureLanguage === "gon";

  useEffect(() => setCultureLanguage(siteLanguage), [siteLanguage]);

  return (
    <article className="culture-page">
      <header className="culture-hero">
        <div className="culture-hero-copy">
          <div className="culture-hero-inner">
            <Kicker>{isHindi ? "मध्य भारत की सांस्कृतिक स्मृति" : isGondi ? "गोंडी भाषा" : "Cultural memory of central India"}</Kicker>
            <h1>{isHindi ? "गोंडी संस्कृति और गोंडवाना" : isGondi ? "कोइतूर संस्कृति अर गोंडवाना" : "Gond Culture and Gondwana"}</h1>
            <p>{isHindi ? "मध्य प्रदेश और छत्तीसगढ़ के संदर्भ में भाषा, प्रकृति, इतिहास, आस्था और सामुदायिक जीवन का परिचय।" : isGondi ? "मध्य प्रदेश और छत्तीसगढ़ की गोंडी भाषा में समुदाय-समीक्षित अनुवाद।" : "An introduction to language, ecology, history, faith, and community life, focused on Madhya Pradesh and Chhattisgarh."}</p>
            <div className="culture-language" role="group" aria-label="Culture page language">
              <button className={cultureLanguage === "hi" ? "active" : ""} onClick={() => setCultureLanguage("hi")}>हिंदी</button>
              <button className={cultureLanguage === "en" ? "active" : ""} onClick={() => setCultureLanguage("en")}>English</button>
              <button className={cultureLanguage === "gon" ? "active" : ""} onClick={() => setCultureLanguage("gon")}>गोंडी</button>
            </div>
          </div>
        </div>
      </header>
      <figure className="culture-artwork">
        <img src="/images/gondi-culture.png" alt="गोंडी संस्कृति की जड़ों, आस्था, प्रकृति, कला, उत्सव और सामुदायिक जीवन को दर्शाती वर्णनात्मक चित्रकला" />
      </figure>

      <div className="culture-content">
        {isGondi && (
          <section className="gondi-draft-note" aria-label="Translation review status">
            <strong>गोंडी मसौदा · समुदाय समीक्षा बाकी मंता</strong>
            <span>Generated language draft. Native-speaker approval is pending.</span>
          </section>
        )}
        <div className="culture-section-list">
          {cultureSections.map((section, index) => (
            <motion.section key={section.titleEn} {...fade} className="culture-section">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h2>{isHindi ? section.titleHi : isGondi ? section.titleGon : section.titleEn}</h2>
                <p>{isHindi ? section.bodyHi : isGondi ? section.bodyGon : section.bodyEn}</p>
              </div>
            </motion.section>
          ))}
        </div>

        <aside className="culture-sources">
          <h2>{isHindi || isGondi ? "स्रोत और संपादकीय दृष्टि" : "Sources and editorial approach"}</h2>
          <p>{isHindi || isGondi ? "यह परिचय सरकारी जनजातीय अनुसंधान संस्थानों और भाषा-संसाधनों के आधार पर तैयार किया गया है। स्थानीय परंपराओं में विविधता का सम्मान करते हुए समुदाय-समीक्षा को प्राथमिक माना गया है।" : "This introduction draws on government tribal research and language resources. Community review takes priority, with explicit recognition of regional variation."}</p>
          <div className="source-links">
            <a href="https://repository.tribal.gov.in/handle/123456789/73820" target="_blank" rel="noreferrer">Ministry of Tribal Affairs: Gond handbook <ExternalLink /></a>
            <a href="https://repository.tribal.gov.in/upload/handle/123456789/62465" target="_blank" rel="noreferrer">SCSTRTI: Gond monograph <ExternalLink /></a>
            <a href="https://library.ciil.org/Sites/Photography/Sri%20Munshi%20Mangalasimha%20Masarana%20Krit55.html" target="_blank" rel="noreferrer">CIIL: Gondi language and scripts <ExternalLink /></a>
          </div>
        </aside>
      </div>
    </article>
  );
}

/* ---------- MEDIA & GALLERY ---------- */

export function Gallery() {
  const language = useLanguage();
  const hi = language !== "en";
  const [modalPdf, setModalPdf] = useState<PdfDocument | null>(null);

  return (
    <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
      {modalPdf && <PdfModal doc={modalPdf} onClose={() => setModalPdf(null)} />}

      <PageHead
        kicker="मीडिया एवं कला-दीर्घा"
        title="वीडियो संदेश एवं कला-दीर्घा"
        sub="लेखक के वीडियो प्रवचन, विचार संदेश, सुलेख एवं वैचारिक कलाकृतियाँ — दर्शन और दृश्य-माध्यम का संगम।"
      />

      {/* Section 1: Video Discourses */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-6">
          <Video className="w-6 h-6 text-saffron-deep" />
          <div>
            <h2 className="text-2xl md:text-3xl text-maroon font-serif">
              {hi ? "वीडियो प्रवचन एवं संदेश" : "Video Discourses & Messages"}
            </h2>
            <p className="font-body text-sm text-ink-soft mt-1">
              {hi ? "प्राप्तस्य प्राप्ति ग्रंथ और जीवन-दर्शन पर लेखक के उद्बोधन।" : "Author's discourses and reflections on core tenets."}
            </p>
          </div>
        </div>
        <VideoSection />
      </section>

      <div className="gold-rule w-full my-16 opacity-50" />

      {/* Section 2: Visual Art Gallery */}
      <section className="mb-20">
        <div className="flex items-center gap-3 mb-8">
          <Palette className="w-6 h-6 text-saffron-deep" />
          <div>
            <h2 className="text-2xl md:text-3xl text-maroon font-serif">
              {hi ? "कला एवं सुलेख दीर्घा" : "Visual Art & Calligraphy Gallery"}
            </h2>
            <p className="font-body text-sm text-ink-soft mt-1">
              {hi ? "विचारों से प्रेरित चित्र, देवनागरी सुलेख एवं संकल्पना रेखांकन।" : "Conceptual illustrations, Devanagari calligraphy, and visual metaphors."}
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gallery.map((g) => (
            <motion.figure key={g.title} {...fade} className="group">
              <div className="relative overflow-hidden rounded-sm border border-ink/10 bg-paper-dark">
                <img src={g.src} alt={g.title} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon-deep/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <figcaption className="mt-3">
                <h3 className="text-xl text-maroon">{g.title}</h3>
                <p className="font-body text-sm text-ink-soft">{g.caption}</p>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </section>

      {/* Section 3: PDF Document Shelf */}
      <section className="paper-dark-texture text-paper rounded-sm p-8 md:p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <FileText className="w-8 h-8 text-gold-soft mb-3" />
            <h2 className="text-2xl md:text-3xl text-paper mb-2">
              {hi ? "सम्पूर्ण साहित्य एवं PDF ग्रंथागार" : "Complete Publications & PDF Library"}
            </h2>
            <p className="font-body text-paper/80 max-w-xl text-sm leading-relaxed">
              {hi
                ? "सभी 8 पुस्तकें, जीवन-वृत्त, संस्मरण और विचार-लेख PDF प्रारूप में ऑनलाइन पढ़ने और डाउनलोड करने के लिए उपलब्ध हैं।"
                : "All 8 books, essays, and stories are available for free online reading and PDF download."}
            </p>
          </div>
          <div className="shrink-0">
            <a
              href="/pdfs/praptasya-prapti-complete-book.pdf"
              download
              className="btn-primary bg-gold hover:bg-gold-soft text-maroon font-bold"
            >
              <Download className="w-4 h-4" /> {hi ? "मूल ग्रंथ डाउनलोड (7.1 MB)" : "Download Book PDF"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- EVENTS ---------- */

export function Events({ navigate }: { navigate: Nav }) {
  const language = useLanguage();
  const hi = language !== "en";

  return (
    <div className="max-w-4xl mx-auto px-5 py-20 md:py-24">
      <PageHead
        kicker="आयोजन"
        title="कार्यक्रम एवं व्याख्यान"
        sub="ग्रंथ लोकार्पण, सत्संग एवं विचार-गोष्ठी, तथा कला-दर्शन प्रदर्शनी — सभी आयोजनों की जानकारी।"
      />
      <div className="space-y-5">
        {events.map((e) => (
          <motion.div key={e.title} {...fade} className="flex flex-col sm:flex-row gap-5 bg-paper-dark/40 border border-ink/10 rounded-sm p-6">
            <div className="shrink-0 flex sm:flex-col items-center justify-center gap-1 sm:w-28 bg-maroon/5 rounded-sm px-4 py-3 border border-ink/10">
              <Calendar className="w-5 h-5 text-saffron-deep" />
              <span className="font-serif text-lg text-maroon">{e.date}</span>
            </div>
            <div className="flex-1">
              <span className="font-body text-xs tracking-widest uppercase text-saffron-deep">{e.type}</span>
              <h3 className="text-2xl text-maroon mt-1 mb-2">{e.title}</h3>
              <p className="font-body text-ink-soft mb-2">{e.desc}</p>
              <p className="flex items-center gap-1.5 font-body text-sm text-ink-soft"><MapPin className="w-4 h-4 text-saffron" /> {e.place}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recorded Video Discourses Section */}
      <motion.div {...fade} className="mt-14 bg-paper-dark/60 border border-ink/10 rounded-sm p-8">
        <div className="flex items-center gap-2 mb-4">
          <Play className="w-6 h-6 text-saffron-deep" />
          <h3 className="text-2xl text-maroon font-serif">
            {hi ? "पूर्व विचार-सत्रों की वीडियो रिकॉर्डिंग" : "Recorded Video Discourses"}
          </h3>
        </div>
        <p className="font-body text-ink-soft mb-6">
          {hi
            ? "लेखक के विचार संदेश एवं प्रवचनों की रिकॉर्डिंग नीचे उपलब्ध है:"
            : "Recorded video sessions and discourses by the author are available below:"}
        </p>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          {videoItems.map((vid, i) => (
            <div key={vid.id} className="bg-paper border border-ink/10 rounded-sm p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 bg-saffron/15 text-saffron-deep text-[0.7rem] font-bold uppercase rounded-xs">
                    {hi ? `भाग ${i + 1}` : `Part ${i + 1}`}
                  </span>
                  <span className="font-body text-xs text-ink-soft">{vid.duration}</span>
                </div>
                <h4 className="font-serif text-base text-maroon mb-1">{hi ? vid.titleHi : vid.titleEn}</h4>
                <p className="font-body text-xs text-ink-soft line-clamp-2">{hi ? vid.descriptionHi : vid.descriptionEn}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between">
                <button
                  onClick={() => navigate({ name: "gallery" })}
                  className="font-body text-xs font-semibold text-saffron-deep hover:text-maroon inline-flex items-center gap-1"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> {hi ? "मीडिया में देखें" : "Watch in Media"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4 border-t border-ink/10">
          <button onClick={() => navigate({ name: "contact" })} className="btn-ghost mx-auto">
            {hi ? "व्याख्यान / विचार-गोष्ठी हेतु आमंत्रित करें" : "Invite for Lecture / Discussion"} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- CONTACT ---------- */

export function Contact() {
  const language = useLanguage();
  const hi = language !== "en";
  const [name, setName] = useState("");
  const [contactValue, setContactValue] = useState("");
  const [subject, setSubject] = useState(hi ? "ग्रंथ की प्रति चाहिए" : "Request a copy of the book");
  const [message, setMessage] = useState("");

  const compose = () => {
    const parts = [
      name && (hi ? `नाम: ${name}` : `Name: ${name}`),
      contactValue && (hi ? `संपर्क: ${contactValue}` : `Contact: ${contactValue}`),
      message,
    ].filter(Boolean);
    return parts.join("\n");
  };

  const waHref =
    "https://wa.me/?text=" + encodeURIComponent(`${subject}\n\n${compose() || ""}`.trim());
  const mailHref =
    "mailto:sampark@praptasya.example?subject=" +
    encodeURIComponent(subject) +
    "&body=" +
    encodeURIComponent(compose());

  return (
    <div className="max-w-5xl mx-auto px-5 py-20 md:py-24">
      <PageHead
        kicker={hi ? "संपर्क" : "Contact"}
        title={hi ? "संपर्क एवं ग्रंथ अनुरोध" : "Contact & book requests"}
        sub={
          hi
            ? "ग्रंथ की प्रति मँगाने, किसी व्याख्यान या पुस्तक-चर्चा हेतु आमंत्रण देने, अथवा विचार साझा करने के लिए संपर्क करें।"
            : "Request a copy, invite the author to speak, or share your thoughts."
        }
      />
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { icon: Phone, label: hi ? "दूरभाष" : "Phone", value: "+91 00000 00000" },
            { icon: MessageCircle, label: "WhatsApp", value: "+91 00000 00000" },
            { icon: Mail, label: hi ? "ईमेल" : "Email", value: "sampark@praptasya.example" },
            { icon: MapPin, label: hi ? "पता" : "Address", value: hi ? "विचार-कुटीर, [नगर], भारत" : "Vichar-Kuteer, [City], India" },
          ].map((c) => (
            <div key={c.label} className="flex gap-4 items-center bg-paper-dark/40 border border-ink/10 rounded-sm p-5">
              <div className="w-11 h-11 rounded-sm bg-saffron/10 border border-saffron/30 flex items-center justify-center shrink-0">
                <c.icon className="w-5 h-5 text-saffron-deep" />
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-saffron-deep">{c.label}</p>
                <p className="font-body text-lg text-ink">{c.value}</p>
              </div>
            </div>
          ))}
          <div className="bg-paper-dark/50 border border-ink/10 rounded-sm p-5">
            <p className="font-body text-sm text-ink-soft leading-relaxed">
              {hi
                ? "सभी पुस्तकें इसी वेबसाइट से निःशुल्क पढ़ी व डाउनलोड की जा सकती हैं — संपर्क केवल हार्डकॉपी या आमंत्रण हेतु आवश्यक है।"
                : "All books are free to read and download on this site — contact is only for hard copies or invitations."}
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            window.open(waHref, "_blank", "noopener");
          }}
          className="paper-texture border border-ink/10 rounded-sm p-7 space-y-4"
        >
          <h3 className="text-2xl text-maroon mb-2">{hi ? "संदेश भेजें" : "Send a message"}</h3>
          {[
            { ph: hi ? "आपका नाम" : "Your name", type: "text", set: setName, value: name },
            { ph: hi ? "ईमेल अथवा दूरभाष" : "Email or phone", type: "text", set: setContactValue, value: contactValue },
          ].map((f) => (
            <input
              key={f.ph}
              type={f.type}
              value={f.value}
              onChange={(e) => f.set(e.target.value)}
              placeholder={f.ph}
              className="w-full font-body bg-paper border border-ink/10 rounded-sm px-4 py-3 text-ink placeholder-ink-soft/60 focus:outline-none focus:border-saffron"
            />
          ))}
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full font-body bg-paper border border-ink/10 rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-saffron"
          >
            <option>{hi ? "ग्रंथ की प्रति चाहिए" : "Request a copy of the book"}</option>
            <option>{hi ? "व्याख्यान हेतु आमंत्रण" : "Invitation for a lecture"}</option>
            <option>{hi ? "पुस्तक-चर्चा / सत्संग" : "Book discussion / satsang"}</option>
            <option>{hi ? "अन्य विचार / प्रश्न" : "Other thoughts / question"}</option>
          </select>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={hi ? "आपका संदेश" : "Your message"}
            className="w-full font-body bg-paper border border-ink/10 rounded-sm px-4 py-3 text-ink placeholder-ink-soft/60 focus:outline-none focus:border-saffron"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit" className="btn-primary flex-1 justify-center">
              <MessageCircle className="w-4 h-4" /> {hi ? "WhatsApp पर भेजें" : "Send via WhatsApp"}
            </button>
            <a href={mailHref} className="btn-ghost flex-1 justify-center">
              <Mail className="w-4 h-4" /> {hi ? "ईमेल से भेजें" : "Send via email"}
            </a>
          </div>
          <p className="font-body text-xs text-ink-soft text-center">
            {hi
              ? "आपके संदेश में नाम व संपर्क जुड़ते हैं — सीधे लेखक तक।"
              : "Your name and contact are included in the message — it goes directly to the author."}
          </p>
        </form>
      </div>
    </div>
  );
}

