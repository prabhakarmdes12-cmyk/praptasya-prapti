# UX Redesign Notes — अनन्तानन्द मानव का लेखन-संसार

What changed and why, following the review of the site on **2026-08-30**.

## Design cleanup (2026-08-30, later pass)

Removed decorative clutter (the "AI slop") and applied a consistent system:

- **Removed** autoplay background music + floating sound toggle (bad UX, removed `public/audio/`).
- **Removed** the animated SVG "sanctuary motif" (people/birds/dashed lines), the `❖` ornament component, and the duplicate logo seal over the hero.
- **Removed** paper-grain textures, gradient "glows", gold gradient rules, and the third font (Martel).
- **Hero rebuilt**: the Gond artwork is now a proper `<figure>` (with caption, explicit dimensions, high priority loading) beside clean typography — no overlay, no text-shadow.
- **Design tokens**: flat ivory `#f7f3ea`, deep forest `#17402f`, ochre `#a8642a`; consistent 4/8/12px radii (Tailwind `--radius-*` overridden so `rounded-sm` etc. are uniform); hairline borders `rgba(23,64,47,…)` replace gold borders.
- **Components**: buttons (primary green / ghost outline), nav with pill active state, quiet metadata chips, clean cards, editorial quote band, flat dark chapter band.
- **Accessibility**: real `:focus-visible` outlines, `prefers-reduced-motion` support, CLS-safe hero image.


## 1. Reading the book is now effortless

**Before:** the Book page embedded a 10-page PDF with `<object>` (broken on iPhone/Android PDF viewers), the full 60-page book existed only as a 7.1 MB download, and there was no progress, resume, TOC, or mobile support.

**Now — `/library` reading hub:**
- **In-browser PDF reader (pdf.js)** renders every page as a canvas — works on iOS, Android and desktop, no plug-in.
- **Page-by-page navigation**: big Prev/Next buttons, swipe gestures, arrow keys, progress slider, "jump to page" box, and a %-complete bar.
- **Chapter/contents drawer** (अध्याय १–८ with page estimates) + quick switch to other works.
- **Reading settings**: zoom in/out / fit-width, paper or dark theme, fullscreen. All remembered.
- **Resume reading**: your last page per book is saved (`localStorage`) — "जारी रखें — पृष्ठ N" appears on the hero and on the book card.
- **Shareable deep links**: `/library?read=<doc>&page=<n>` opens any book on any page — used by all share buttons and link copying.
- The old `/book` route now opens the reader directly; `/library` is the merged page.

## 2. Book + Library = one page

The new `पढ़ें` page contains, top to bottom:
1. Complete book reader (hero with cover → reader when opened)
2. All 9 writings with search + category filters, "read online" + PDF download + share on every card
3. "सभी रचनाएँ एक साथ (ZIP)" — one-click download of the whole library (built client-side, nothing extra hosted)
4. Online essays (प्रवचन/विचार-लेख)
5. Author's video messages
6. Reader opt-in ("नए लेखन की सूचना पाएँ" — email/WhatsApp, no backend required)

## 3. Branding shifted to the writer

- Header brand lockup is now **अनन्तानन्द मानव · लेखक · प्राप्तस्य प्राप्ति** (pen name leads).
- Home hero adds the author byline; "Written by अनन्तानन्द मानव" section is bilingual.
- Page titles, meta description and footer are author-first; footer states all works are free to read/download/share.
- Nav simplified from **9 → 7 items** (मुखपृष्ठ, पढ़ें, दर्शन, लेखक, गोंड संस्कृति, आयोजन, संपर्क). Media/gallery moved out of the main nav (linked from home, hub and footer).

## 4. Reaching maximum audience with free content

- **Share buttons** (WhatsApp, Telegram, Facebook, X, copy link) on the reader toolbar, library cards and book hero — with exact-chapter/deep links.
- **Free downloads everywhere**: PDF per work + full-library ZIP; no sign-up required.
- **Reader opt-in** channel (WhatsApp join / email) for new-work announcements.
- Working **contact flow**: the form now composes a WhatsApp message or email to the author (no dead demo).
- Language selector trimmed to हिंदी + English (global); Gondi stays as the culture page's own reviewer-draft section.

## 5. Technical notes

- Added `pdfjs-dist@3.11` (reader) and `jszip` (library ZIP). The pdf.js worker is inlined as a Blob so it survives the single-file Vite build — the whole app is still one `index.html` (~577 KB gzipped).
- Reader state lives in `src/reader.tsx`; the hub in `src/pages.tsx` (`LibraryHub`); data/constants in `src/data.ts`.
- `npm run dev` / `npm run build` both pass; `tsc --noEmit` is clean.

## Still needed from the writer (future steps)

- The main book PDF is a **scan without a text layer** — if you supply typed chapter text (Word/DOCX), we can upgrade the reader to adjustable-font HTML text with real chapter jumps and EPUB export.
- Real phone/email and social handles are placeholders (`+91 00000 00000`, `sampark@praptasya.example`) — replace them in `src/pages.tsx` (Contact, signup).
- A backend/Google Form can replace the localStorage-based signup if you want an actual mailing list.
