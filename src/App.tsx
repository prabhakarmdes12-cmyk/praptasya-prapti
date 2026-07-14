import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import {
  Home, About, Book, Philosophy, Articles, ArticleDetail,
  Gallery, Events, Contact, type Route, type Nav,
} from "./pages";
import { articles } from "./data";

const NAV_ITEMS: { label: string; route: Route }[] = [
  { label: "मुख्य पृष्ठ", route: { name: "home" } },
  { label: "लेखक", route: { name: "about" } },
  { label: "ग्रंथ", route: { name: "book" } },
  { label: "विचार-दर्शन", route: { name: "philosophy" } },
  { label: "प्रवचन", route: { name: "articles" } },
  { label: "कला-दीर्घा", route: { name: "gallery" } },
  { label: "आयोजन", route: { name: "events" } },
  { label: "संपर्क", route: { name: "contact" } },
];

export default function App() {
  const [route, setRoute] = useState<Route>({ name: "home" });
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate: Nav = (r) => {
    setRoute(r);
    setMenuOpen(false);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [route]);

  const isActive = (r: Route) =>
    r.name === route.name || (route.name === "article" && r.name === "articles");

  return (
    <div className="min-h-screen flex flex-col paper-texture">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-sm border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between h-20">
            <button onClick={() => navigate({ name: "home" })} className="text-left leading-none">
              <span className="block font-serif text-2xl text-maroon">प्राप्तस्य प्राप्ति</span>
              <span className="block font-body text-[0.65rem] tracking-[0.3em] uppercase text-saffron-deep mt-1">
                विचार-यात्रा · Author Archive
              </span>
            </button>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.route)}
                  className={`font-body text-sm px-3 py-2 rounded-sm transition-colors ${
                    isActive(item.route)
                      ? "text-saffron-deep font-semibold"
                      : "text-ink-soft hover:text-maroon"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button className="lg:hidden text-maroon" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X /> : <Menu />}
            </button>
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
                    key={item.label}
                    onClick={() => navigate(item.route)}
                    className={`text-left font-body py-2.5 border-b border-gold/15 last:border-0 ${
                      isActive(item.route) ? "text-saffron-deep font-semibold" : "text-ink-soft"
                    }`}
                  >
                    {item.label}
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
                  <button key={item.label} onClick={() => navigate(item.route)}
                    className="text-left font-body text-sm text-paper/70 hover:text-gold-soft transition-colors">
                    {item.label}
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
    case "article": {
      const article = articles.find((a) => a.slug === route.slug);
      if (!article) return <Articles navigate={navigate} />;
      return <ArticleDetail article={article} navigate={navigate} />;
    }
  }
}
