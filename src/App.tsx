import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import {
  Home, About, Book, Philosophy, Articles, ArticleDetail,
  Gallery, Events, Contact, GondCulture, type Route, type Nav,
} from "./pages";
import { articles } from "./data";
import { LanguageProvider, type Language } from "./i18n";

const NAV_ITEMS: { hi: string; en: string; gon: string; route: Route }[] = [
  { hi: "मुखपृष्ठ", en: "Home", gon: "मुखपृष्ठ", route: { name: "home" } },
  { hi: "दर्शन", en: "Philosophy", gon: "दर्शन", route: { name: "philosophy" } },
  { hi: "ग्रंथ", en: "Book", gon: "ग्रंथ", route: { name: "book" } },
  { hi: "लेखक", en: "Author", gon: "लेखक", route: { name: "about" } },
  { hi: "गोंड संस्कृति", en: "Gond Culture", gon: "कोइतूर संस्कृति", route: { name: "culture" } },
  { hi: "ज्ञानालय", en: "Library", gon: "ज्ञानालय", route: { name: "articles" } },
  { hi: "मीडिया", en: "Media", gon: "मीडिया", route: { name: "gallery" } },
  { hi: "आयोजन", en: "Events", gon: "कार्यक्रम", route: { name: "events" } },
  { hi: "संपर्क", en: "Contact", gon: "संपर्क", route: { name: "contact" } },
];

function LanguageSelect({ value, onChange }: { value: Language; onChange: (language: Language) => void }) {
  return (
    <select className="language-select" value={value} onChange={(event) => onChange(event.target.value as Language)} aria-label="Website language">
      <option value="hi">हिंदी</option>
      <option value="en">English</option>
      <option value="gon">गोंडी</option>
    </select>
  );
}

function routePath(route: Route) {
  if (route.name === "home") return "/";
  if (route.name === "about") return "/author";
  if (route.name === "articles") return "/library";
  if (route.name === "gallery") return "/media";
  if (route.name === "culture") return "/gond-culture";
  if (route.name === "article") return `/library/${route.slug}`;
  return `/${route.name}`;
}

function routeFromPath(pathname: string): Route {
  const path = pathname.replace(/\/$/, "") || "/";
  if (path === "/") return { name: "home" };
  if (path === "/author") return { name: "about" };
  if (path === "/library") return { name: "articles" };
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
    return saved === "en" || saved === "gon" ? saved : "hi";
  });
  const [soundOn, setSoundOn] = useState(() => localStorage.getItem("praptasya-sound") !== "off");
  const audioRef = useRef<HTMLAudioElement>(null);

  const navigate: Nav = (r) => {
    setRoute(r);
    window.history.pushState({}, "", routePath(r));
    setMenuOpen(false);
  };

  const changeLanguage = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    if (nextLanguage === "gon" && route.name !== "culture") {
      navigate({ name: "culture" });
    }
  };

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    const isCulture = route.name === "culture";
    document.title = isCulture
      ? "गोंड संस्कृति, गोंडी भाषा और गोंडवाना | प्राप्तस्य प्राप्ति"
      : "प्राप्तस्य प्राप्ति | मानव जीवन का मूल संविधान";
    const description = isCulture
      ? "मध्य प्रदेश और छत्तीसगढ़ के संदर्भ में गोंड संस्कृति, गोंडी भाषा, मौखिक परंपराओं, प्रकृति, कला और सामुदायिक जीवन का परिचय।"
      : "प्राप्तस्य प्राप्ति — मानव जीवन, स्वतंत्रता, ज्ञान और समाज पर अनन्तानन्द मानव की विचार-यात्रा।";
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

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.2;
    localStorage.setItem("praptasya-sound", soundOn ? "on" : "off");

    const removeUnlockListeners = () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
    const unlockAudio = () => {
      if (!soundOn) return;
      void audio.play().then(removeUnlockListeners).catch(() => undefined);
    };

    if (soundOn) {
      void audio.play().then(removeUnlockListeners).catch(() => {
        window.addEventListener("pointerdown", unlockAudio, { once: true });
        window.addEventListener("keydown", unlockAudio, { once: true });
      });
    } else {
      audio.pause();
    }

    return removeUnlockListeners;
  }, [soundOn]);

  const isActive = (r: Route) =>
    r.name === route.name || (route.name === "article" && r.name === "articles");

  return (
    <LanguageProvider language={language}>
    <div className="min-h-screen flex flex-col paper-texture" lang={language}>
      <audio ref={audioRef} src="/audio/sanctuary-music.mp3" autoPlay loop preload="auto" playsInline />
      <button
        type="button"
        className={`sound-toggle ${soundOn ? "is-on" : ""}`}
        onClick={() => setSoundOn((current) => !current)}
        aria-label={soundOn ? "Turn website music off" : "Turn website music on"}
        title={soundOn ? "Music off" : "Music on"}
      >
        {soundOn ? <Volume2 /> : <VolumeX />}
      </button>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-5">
          <div className="header-row flex items-center justify-between h-20">
            <button onClick={() => navigate({ name: "home" })} className="brand-lockup">
              <img src="/images/praptasya-logo.png" alt="" />
              <span>
              <span className="block font-serif text-xl text-maroon">प्राप्तस्य प्राप्ति</span>
              <span className="block font-body text-[0.65rem] tracking-[0.3em] uppercase text-saffron-deep mt-1">
                {language === "en" ? "Human Constitution" : language === "gon" ? "मानवा जीवना ता मूल संविधान" : "मानव जीवन का मूल संविधान"}
              </span>
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.en}
                  onClick={() => navigate(item.route)}
                  className={`font-body text-sm px-3 py-2 rounded-sm transition-colors ${
                    isActive(item.route)
                      ? "text-saffron-deep font-semibold"
                      : "text-ink-soft hover:text-maroon"
                  }`}
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
              className="lg:hidden overflow-hidden bg-paper-dark border-t border-gold/30"
            >
              <div className="px-5 py-3 flex flex-col">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.en}
                    onClick={() => navigate(item.route)}
                    className={`text-left font-body py-2.5 border-b border-gold/15 last:border-0 ${
                      isActive(item.route) ? "text-saffron-deep font-semibold" : "text-ink-soft"
                    }`}
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
              <h3 className="font-serif text-2xl text-paper mb-3">प्राप्तस्य प्राप्ति</h3>
              <p className="font-body text-paper/70 leading-relaxed text-sm">
                मानव जीवन के मूल प्रश्नों पर एक स्वतंत्र विचार-यात्रा। यहाँ प्रस्तुत सभी विचार
                लेखक के स्वतंत्र विचार हैं।
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
              <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold-soft mb-4">संपर्क</h4>
              <p className="font-body text-sm text-paper/70">व्हाट्सऐप · ईमेल · डाक</p>
              <button onClick={() => navigate({ name: "contact" })} className="mt-4 font-body text-sm text-gold-soft hover:text-paper transition-colors underline underline-offset-4">
                ग्रंथ की प्रति मँगाएँ →
              </button>
            </div>
          </div>
          <div className="gold-rule w-full my-10 opacity-40" />
          <p className="font-body text-center text-xs text-paper/50">
            © {new Date().getFullYear()} प्राप्तस्य प्राप्ति · समस्त विचार लेखक के स्वतंत्र विचार हैं · Built in India
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
    case "articles": return <Articles navigate={navigate} />;
    case "gallery": return <Gallery />;
    case "events": return <Events navigate={navigate} />;
    case "contact": return <Contact />;
    case "culture": return <GondCulture />;
    case "article": {
      const article = articles.find((a) => a.slug === route.slug);
      if (!article) return <Articles navigate={navigate} />;
      return <ArticleDetail article={article} navigate={navigate} />;
    }
  }
}
