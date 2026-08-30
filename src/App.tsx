import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import {
  Home, About, Book, Philosophy, LibraryHub, ArticleDetail,
  Gallery, Events, Contact, GondCulture, type Route, type Nav,
} from "./pages";
import { articles } from "./data";
import { LanguageProvider, type Language } from "./i18n";

const NAV_ITEMS: { hi: string; en: string; route: Route }[] = [
  { hi: "मुखपृष्ठ", en: "Home", route: { name: "home" } },
  { hi: "पढ़ें", en: "Read", route: { name: "articles" } },
  { hi: "दर्शन", en: "Philosophy", route: { name: "philosophy" } },
  { hi: "लेखक", en: "Author", route: { name: "about" } },
  { hi: "गोंड संस्कृति", en: "Gond Culture", route: { name: "culture" } },
  { hi: "आयोजन", en: "Events", route: { name: "events" } },
  { hi: "संपर्क", en: "Contact", route: { name: "contact" } },
];

function LanguageSelect({ value, onChange }: { value: Language; onChange: (language: Language) => void }) {
  return (
    <select className="language-select" value={value} onChange={(event) => onChange(event.target.value as Language)} aria-label="Website language">
      <option value="hi">हिंदी</option>
      <option value="en">English</option>
    </select>
  );
}

function routePath(route: Route) {
  if (route.name === "home") return "/";
  if (route.name === "about") return "/author";
  if (route.name === "articles") {
    const q = new URLSearchParams();
    if (route.readId) {
      q.set("read", route.readId);
      if (route.readPage && route.readPage > 1) q.set("page", String(route.readPage));
    }
    const s = q.toString();
    return s ? `/library?${s}` : "/library";
  }
  if (route.name === "gallery") return "/media";
  if (route.name === "culture") return "/gond-culture";
  if (route.name === "article") return `/library/${route.slug}`;
  return `/${route.name}`;
}

function routeFromPath(pathname: string): Route {
  const path = pathname.replace(/\/$/, "") || "/";
  const q = new URLSearchParams(window.location.search);
  const readId = q.get("read") || undefined;
  const pageNum = Number(q.get("page"));
  const readPage = Number.isFinite(pageNum) && pageNum > 1 ? Math.floor(pageNum) : undefined;
  if (path === "/") return { name: "home" };
  if (path === "/author") return { name: "about" };
  if (path === "/library") return { name: "articles", readId, readPage };
  if (path === "/media") return { name: "gallery" };
  if (path === "/gond-culture") return { name: "culture" };
  if (path.startsWith("/library/")) return { name: "article", slug: path.slice(9) };
  const known = ["book", "philosophy", "events", "contact"] as const;
  const name = path.slice(1);
  return known.includes(name as (typeof known)[number])
    ? { name: name as (typeof known)[number] }
    : { name: "home" };
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => routeFromPath(window.location.pathname));
  const [menuOpen, setMenuOpen] = useState(false);
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem("praptasya-language");
    return saved === "en" ? saved : "hi";
  });
  const navigate: Nav = (r) => {
    setRoute(r);
    window.history.pushState({}, "", routePath(r));
    setMenuOpen(false);
  };

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
  };

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const isCulture = route.name === "culture";
    const titleFor = (t: string) => `${t} | अनन्तानन्द मानव`;
    document.title = isCulture
      ? titleFor("गोंड संस्कृति, गोंडी भाषा और गोंडवाना")
      : route.name === "articles" || route.name === "book"
        ? titleFor("पढ़ें — निःशुल्क कृतियाँ एवं पुस्तकें")
        : route.name === "about"
          ? titleFor("लेखक परिचय")
          : route.name === "philosophy"
            ? titleFor("विचार-दर्शन")
            : route.name === "gallery"
              ? titleFor("वीडियो एवं कला-दीर्घा")
              : route.name === "events"
                ? titleFor("आयोजन")
                : route.name === "contact"
                  ? titleFor("संपर्क")
                  : route.name === "article"
                    ? titleFor(articles.find((a) => a.slug === route.slug)?.title ?? "विचार-लेख")
                    : titleFor("लेखक — प्राप्तस्य प्राप्ति");
    const description = isCulture
      ? "मध्य प्रदेश और छत्तीसगढ़ के संदर्भ में गोंड संस्कृति, गोंडी भाषा, मौखिक परंपराओं, प्रकृति, कला और सामुदायिक जीवन का परिचय।"
      : "अनन्तानन्द मानव (हरनारायण साह) की निःशुल्क कृतियाँ — 'प्राप्तस्य प्राप्ति' सहित सम्पूर्ण पुस्तकें ऑनलाइन पढ़ें और PDF डाउनलोड करें।";
    let meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = description;
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${routePath(route)}`;
    const schemaId = "culture-structured-data";
    document.getElementById(schemaId)?.remove();
    if (isCulture) {
      const schema = document.createElement("script");
      schema.id = schemaId;
      schema.type = "application/ld+json";
      schema.text = JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Article",
            headline: "गोंड संस्कृति, गोंडी भाषा और गोंडवाना",
            description,
            inLanguage: ["hi", "en", "gon"],
            about: ["Gond culture", "Gondi language", "Gondwana", "Madhya Pradesh", "Chhattisgarh"],
            author: { "@type": "Person", name: "अनन्तानन्द मानव" },
            mainEntityOfPage: canonical.href,
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "प्राप्तस्य प्राप्ति", item: window.location.origin },
              { "@type": "ListItem", position: 2, name: "गोंड संस्कृति", item: canonical.href },
            ],
          },
        ],
      });
      document.head.appendChild(schema);
    }
  }, [route]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  useEffect(() => {
    localStorage.setItem("praptasya-language", language);
  }, [language]);

  const isActive = (r: Route) =>
    r.name === route.name ||
    (route.name === "article" && r.name === "articles") ||
    (route.name === "book" && r.name === "articles");

  return (
    <LanguageProvider language={language}>
    <div className="min-h-screen flex flex-col bg-paper" lang={language}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b border-ink/10">
        <div className="max-w-7xl mx-auto px-5">
          <div className="header-row flex items-center justify-between h-20">
            <button onClick={() => navigate({ name: "home" })} className="brand-lockup">
              <img src="/images/praptasya-logo.png" alt="" />
              <span>
              <span className="block font-serif text-xl text-maroon">अनन्तानन्द मानव</span>
              <span className="block font-body text-[0.65rem] tracking-[0.3em] uppercase text-saffron-deep mt-1">
                {language === "en" ? "Author · Praptasya Prapti" : "लेखक · प्राप्तस्य प्राप्ति"}
              </span>
              </span>
            </button>

            <nav className="site-nav hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.en}
                  onClick={() => navigate(item.route)}
                  className={isActive(item.route) ? "nav-active" : ""}
                >
                  {item[language]}
                </button>
              ))}
              <LanguageSelect value={language} onChange={changeLanguage} />
            </nav>

            <div className="mobile-actions lg:hidden flex items-center gap-2">
              <LanguageSelect value={language} onChange={changeLanguage} />
              <button className="text-maroon p-2" onClick={() => setMenuOpen(!menuOpen)} aria-label="Open navigation">
                {menuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="site-nav-mobile lg:hidden overflow-hidden bg-paper-dark border-t border-ink/10"
            >
              <div className="px-5 py-2 flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.en}
                    onClick={() => navigate(item.route)}
                    className={isActive(item.route) ? "nav-active" : ""}
                  >
                    {item[language]}
                  </button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={route.name === "article" ? route.slug : route.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Page route={route} navigate={navigate} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="paper-dark-texture text-paper">
        <div className="max-w-7xl mx-auto px-5 py-16">
          <div className="grid md:grid-cols-3 gap-10">
            <div>
              <h3 className="font-serif text-2xl text-paper mb-3">अनन्तानन्द मानव</h3>
              <p className="font-body text-paper/70 leading-relaxed text-sm">
                {language === "en"
                  ? "Writings by Anantanand Manav — all books and works are free to read, download and share."
                  : "अनन्तानन्द मानव की कृतियाँ — सभी पुस्तकें एवं लेखन पढ़ने व साझा करने के लिए पूर्णतः निःशुल्क हैं।"}
              </p>
            </div>
            <div>
              <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold-soft mb-4">पृष्ठ</h4>
              <div className="grid grid-cols-2 gap-y-2">
                {NAV_ITEMS.map((item) => (
                  <button key={item.en} onClick={() => navigate(item.route)}
                    className="text-left font-body text-sm text-paper/70 hover:text-gold-soft transition-colors">
                    {item[language]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold-soft mb-4">{language === "en" ? "Contact" : "संपर्क"}</h4>
              <p className="font-body text-sm text-paper/70">WhatsApp · Email · Post</p>
              <button onClick={() => navigate({ name: "contact" })} className="mt-4 font-body text-sm text-gold-soft hover:text-paper transition-colors underline underline-offset-4">
                {language === "en" ? "Reach the author →" : "लेखक से जुड़ें →"}
              </button>
            </div>
          </div>
          <div className="gold-rule w-full my-10 opacity-40" />
          <p className="font-body text-center text-xs text-paper/50">
            © {new Date().getFullYear()} अनन्तानन्द मानव · {language === "en" ? "All works are free to read, download and share." : "सभी रचनाएँ निःशुल्क पढ़ने, डाउनलोड करने व साझा करने हेतु उपलब्ध हैं।"} · Built in India
          </p>
        </div>
      </footer>
    </div>
    </LanguageProvider>
  );
}

function Page({ route, navigate }: { route: Route; navigate: Nav }) {
  switch (route.name) {
    case "home": return <Home navigate={navigate} />;
    case "about": return <About navigate={navigate} />;
    case "book": return <Book navigate={navigate} />;
    case "philosophy": return <Philosophy navigate={navigate} />;
    case "articles":
      return (
        <LibraryHub
          navigate={navigate}
          initialRead={route.readId ? { id: route.readId, page: route.readPage || 1 } : undefined}
        />
      );
    case "gallery": return <Gallery />;
    case "events": return <Events navigate={navigate} />;
    case "contact": return <Contact />;
    case "culture": return <GondCulture />;
    case "article": {
      const article = articles.find((a) => a.slug === route.slug);
      if (!article) return <LibraryHub navigate={navigate} />;
      return <ArticleDetail article={article} navigate={navigate} />;
    }
  }
}
