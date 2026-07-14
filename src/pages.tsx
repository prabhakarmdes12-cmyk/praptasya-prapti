import { motion } from "framer-motion";
import {
  Feather, BookOpen, Sparkles, ArrowRight, ArrowLeft,
  Quote, Phone, Mail, MapPin, MessageCircle, Calendar, Clock,
  ScrollText, Palette, Play,
} from "lucide-react";
import {
  quotes, philosophyPillars, chapters, articles, events, gallery,
  type Article,
} from "./data";

export type Route =
  | { name: "home" }
  | { name: "about" }
  | { name: "book" }
  | { name: "philosophy" }
  | { name: "articles" }
  | { name: "gallery" }
  | { name: "events" }
  | { name: "contact" }
  | { name: "article"; slug: string };

export type Nav = (r: Route) => void;

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6 },
};

/* ---------- Shared UI ---------- */

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="gold-rule w-16" />
      <span className="text-gold text-lg">❖</span>
      <span className="gold-rule w-16" />
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block font-body text-xs md:text-sm tracking-[0.3em] uppercase text-saffron-deep mb-4">
      {children}
    </span>
  );
}

function PageHead({ kicker, title, sub }: { kicker: string; title: string; sub?: string }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-14">
      <Kicker>{kicker}</Kicker>
      <h1 className="text-4xl md:text-5xl text-maroon leading-tight mb-5">{title}</h1>
      {sub && <p className="font-body text-lg text-ink-soft leading-relaxed">{sub}</p>}
      <Ornament className="mt-8" />
    </div>
  );
}

/* ---------- HOME ---------- */

export function Home({ navigate }: { navigate: Nav }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative paper-texture overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.5] bg-[radial-gradient(ellipse_at_top,rgba(200,97,27,0.10),transparent_60%)]" />
        <div className="max-w-5xl mx-auto px-5 pt-24 pb-20 md:pt-32 md:pb-28 text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <Ornament className="mb-8" />
            <p className="font-serif text-2xl md:text-3xl text-saffron-deep italic mb-6">प्राप्तस्य प्राप्ति</p>
            <h1 className="font-serif text-3xl md:text-5xl lg:text-[3.4rem] leading-[1.35] text-maroon max-w-4xl mx-auto">
              मानव जीवन के मूल प्रश्नों पर<br className="hidden md:block" /> एक स्वतंत्र विचार-यात्रा
            </h1>
            <p className="font-body text-lg md:text-xl text-ink-soft max-w-2xl mx-auto mt-8 leading-relaxed">
              धर्म, ईश्वर, गुरु और मानवता पर एक निर्भीक चिंतन — जो किसी मत का प्रचार नहीं,
              बल्कि प्रत्येक मनुष्य को स्वयं सोचने का निमंत्रण देता है।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
              <button onClick={() => navigate({ name: "book" })} className="btn-primary">
                <BookOpen className="w-5 h-5" /> ग्रंथ के बारे में
              </button>
              <button onClick={() => navigate({ name: "philosophy" })} className="btn-ghost">
                विचार-दर्शन देखें <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author intro strip */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-24">
        <motion.div {...fade} className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute -inset-3 border border-gold/40 rounded-sm" />
              <img src="/images/author.jpg" alt="लेखक" className="relative w-full aspect-[4/5] object-cover rounded-sm grayscale-[15%] sepia-[10%]" loading="lazy" />
            </div>
          </div>
          <div className="md:col-span-3">
            <Kicker>लेखक परिचय</Kicker>
            <h2 className="text-3xl md:text-4xl text-maroon mb-5">एक स्वतंत्र विचारक की कलम से</h2>
            <p className="font-body text-lg text-ink-soft leading-relaxed mb-4">
              दशकों की साधना, शोध और आत्म-अन्वेषण के पश्चात लिखा गया यह ग्रंथ किसी उपदेश का
              संग्रह नहीं है। यह जीवन के उन प्रश्नों से जूझने का लेखा-जोखा है जिनसे हर संवेदनशील
              मनुष्य कभी न कभी टकराता है।
            </p>
            <p className="font-body text-lg text-ink-soft leading-relaxed mb-6">
              लेखक का मानना है कि सत्य किसी की बपौती नहीं — वह खोज है, और वह खोज स्वतंत्र होनी चाहिए।
            </p>
            <button onClick={() => navigate({ name: "about" })} className="link-arrow">
              लेखक की पूरी यात्रा पढ़ें <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Featured quote */}
      <section className="paper-dark-texture text-paper">
        <div className="max-w-4xl mx-auto px-5 py-20 md:py-24 text-center">
          <Quote className="w-10 h-10 text-gold-soft mx-auto mb-6" />
          <motion.p {...fade} className="font-serif text-2xl md:text-4xl leading-[1.6] text-paper">
            “{quotes[0]}”
          </motion.p>
          <p className="font-body text-sm tracking-[0.25em] uppercase text-gold-soft mt-8">— लेखक के विचार</p>
        </div>
      </section>

      {/* Book teaser */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-24">
        <motion.div {...fade} className="grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2 order-2 md:order-1">
            <Kicker>प्रमुख ग्रंथ</Kicker>
            <h2 className="text-3xl md:text-4xl text-maroon mb-5">प्राप्तस्य प्राप्ति</h2>
            <p className="font-body text-lg text-ink-soft leading-relaxed mb-6">
              जो प्राप्त है, उसी की प्राप्ति। यह ग्रंथ मनुष्य को बाहर की दौड़ से भीतर की ओर
              लौटने का मार्ग सुझाता है — आठ अध्यायों में एक पूर्ण विचार-यात्रा।
            </p>
            <button onClick={() => navigate({ name: "book" })} className="btn-primary">
              ग्रंथ देखें <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="md:col-span-3 order-1 md:order-2">
            <div className="relative mx-auto max-w-sm">
              <div className="absolute -inset-4 bg-maroon/5 rounded-sm rotate-1" />
              <img src="/images/book-cover.jpg" alt="प्राप्तस्य प्राप्ति" className="relative w-full rounded-sm shadow-2xl" loading="lazy" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy pillars preview */}
      <section className="bg-paper-dark/60 border-y border-gold/20">
        <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
          <PageHead kicker="मूल विचार" title="चिंतन के चार स्तंभ" />
          <div className="grid sm:grid-cols-2 gap-5">
            {philosophyPillars.map((p) => (
              <motion.button
                key={p.id}
                {...fade}
                onClick={() => navigate({ name: "philosophy" })}
                className="text-left bg-paper border border-gold/25 rounded-sm p-7 hover:border-saffron transition-colors group"
              >
                <p className="font-serif text-2xl text-saffron-deep mb-2">{p.sanskrit}</p>
                <h3 className="text-xl text-maroon mb-2">{p.title}</h3>
                <p className="font-body text-ink-soft leading-relaxed">{p.text}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      <HomeCTA navigate={navigate} />
    </div>
  );
}

function HomeCTA({ navigate }: { navigate: Nav }) {
  return (
    <section className="max-w-4xl mx-auto px-5 py-20 md:py-24 text-center">
      <motion.div {...fade}>
        <Feather className="w-9 h-9 text-saffron mx-auto mb-5" />
        <h2 className="text-3xl md:text-4xl text-maroon mb-5">यह विचार-यात्रा आपकी प्रतीक्षा में है</h2>
        <p className="font-body text-lg text-ink-soft max-w-xl mx-auto mb-8">
          ग्रंथ की प्रति मँगाएँ, प्रवचन पढ़ें, अथवा किसी चर्चा या व्याख्यान हेतु लेखक से संपर्क करें।
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigate({ name: "contact" })} className="btn-primary">ग्रंथ मँगाएँ / संपर्क</button>
          <button onClick={() => navigate({ name: "articles" })} className="btn-ghost">प्रवचन पढ़ें</button>
        </div>
      </motion.div>
    </section>
  );
}

/* ---------- ABOUT ---------- */

export function About({ navigate }: { navigate: Nav }) {
  const blocks = [
    { icon: ScrollText, title: "जीवन यात्रा", text: "एक साधारण जीवन से आरंभ हुई यह यात्रा प्रश्नों से भरी रही। हर अनुभव, हर संघर्ष ने चिंतन को गहराई दी और लेखक को मूल प्रश्नों की ओर मोड़ा।" },
    { icon: Sparkles, title: "साधना / शोध यात्रा", text: "वर्षों तक शास्त्रों का अध्ययन, विभिन्न परंपराओं का सत्संग, मौन साधना और आत्म-निरीक्षण — इसी तपस्या से इस ग्रंथ के विचार परिपक्व हुए।" },
    { icon: Feather, title: "क्यों लिखा यह ग्रंथ", text: "लेखक ने अनुभव किया कि आज मनुष्य को तैयार उत्तरों की नहीं, स्वयं सोचने के साहस की आवश्यकता है। यही आवश्यकता इस ग्रंथ का बीज बनी।" },
  ];
  return (
    <div className="max-w-5xl mx-auto px-5 py-20 md:py-24">
      <PageHead kicker="लेखक परिचय" title="लेखक की विचार-यात्रा"
        sub="एक स्वतंत्र चिंतक, साधक एवं कलाकार — जिनकी लेखनी किसी मत का प्रचार नहीं, विवेक का आह्वान करती है।" />

      <motion.div {...fade} className="grid md:grid-cols-5 gap-10 items-start mb-16">
        <div className="md:col-span-2">
          <div className="relative">
            <div className="absolute -inset-3 border border-gold/40 rounded-sm" />
            <img src="/images/author.jpg" alt="लेखक" className="relative w-full aspect-[4/5] object-cover rounded-sm grayscale-[15%] sepia-[10%]" loading="lazy" />
          </div>
          <div className="mt-6 bg-maroon/5 border border-gold/25 rounded-sm p-5 text-center">
            <Play className="w-7 h-7 text-saffron mx-auto mb-2" />
            <p className="font-body text-sm text-ink-soft">लेखक का वीडियो संदेश शीघ्र उपलब्ध होगा</p>
          </div>
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

      <div className="text-center">
        <button onClick={() => navigate({ name: "book" })} className="btn-primary">
          <BookOpen className="w-5 h-5" /> ग्रंथ के बारे में जानें
        </button>
      </div>
    </div>
  );
}

/* ---------- BOOK ---------- */

export function Book({ navigate }: { navigate: Nav }) {
  const reasons = [
    "मूल प्रश्नों पर एक निर्भीक एवं स्वतंत्र दृष्टि",
    "किसी मत का प्रचार नहीं, विवेक जगाने का प्रयास",
    "सरल भाषा में गहन दार्शनिक विचार",
    "दैनिक जीवन में उतारने योग्य चिंतन",
  ];
  return (
    <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
      <PageHead kicker="प्रमुख ग्रंथ" title="प्राप्तस्य प्राप्ति"
        sub="जो प्राप्त है, उसी की प्राप्ति — मानव जीवन के मूल प्रश्नों पर आठ अध्यायों की विचार-यात्रा।" />

      <div className="grid md:grid-cols-5 gap-12 items-start">
        <motion.div {...fade} className="md:col-span-2 md:sticky md:top-28">
          <div className="relative mx-auto max-w-xs">
            <div className="absolute -inset-4 bg-maroon/5 rounded-sm rotate-1" />
            <img src="/images/book-cover.jpg" alt="प्राप्तस्य प्राप्ति" className="relative w-full rounded-sm shadow-2xl" loading="lazy" />
          </div>
          <button onClick={() => navigate({ name: "contact" })} className="btn-primary w-full justify-center mt-8">
            प्रति मँगाएँ / अनुरोध करें
          </button>
          <p className="font-body text-center text-sm text-ink-soft mt-3">डाक अथवा व्हाट्सऐप द्वारा उपलब्ध</p>
        </motion.div>

        <motion.div {...fade} className="md:col-span-3 space-y-12">
          <div>
            <h2 className="text-2xl text-maroon mb-4">ग्रंथ-सार</h2>
            <p className="font-body text-lg text-ink-soft leading-relaxed mb-4">
              'प्राप्तस्य प्राप्ति' इस विरोधाभास से आरंभ होती है कि मनुष्य जीवन-भर उसे बाहर खोजता है
              जो पहले से उसके भीतर विद्यमान है। यह ग्रंथ उसी 'प्राप्त' की ओर लौटने का मार्ग सुझाता है।
            </p>
            <p className="font-body text-lg text-ink-soft leading-relaxed">
              धर्म, ईश्वर, गुरु और मानवता जैसे शाश्वत विषयों पर यह पुस्तक कोई अंतिम उत्तर नहीं देती —
              यह पाठक को स्वयं प्रश्न पूछने और उत्तर खोजने के लिए प्रेरित करती है।
            </p>
          </div>

          <div>
            <h2 className="text-2xl text-maroon mb-5">विषय सूची</h2>
            <div className="space-y-3">
              {chapters.map((c) => (
                <div key={c.num} className="flex gap-4 items-start bg-paper-dark/50 border border-gold/20 rounded-sm p-4">
                  <span className="font-serif text-2xl text-saffron-deep w-8 text-center shrink-0">{c.num}</span>
                  <div>
                    <h4 className="text-lg text-maroon">{c.title}</h4>
                    <p className="font-body text-ink-soft text-sm">{c.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl text-maroon mb-4">नमूना पृष्ठ</h2>
            <blockquote className="paper-texture border-l-4 border-saffron rounded-sm p-6 md:p-8">
              <p className="font-serif text-xl md:text-2xl text-ink leading-[1.8] italic">
                “मनुष्य पूछता है — मुझे क्या पाना है? और यही प्रश्न उसे भटकाता है। सही प्रश्न है —
                जो मेरे पास पहले से है, उसे मैं क्यों नहीं देख पाता?”
              </p>
              <p className="font-body text-sm text-ink-soft mt-4">— अध्याय २, प्राप्तस्य प्राप्ति</p>
            </blockquote>
          </div>

          <div>
            <h2 className="text-2xl text-maroon mb-4">यह ग्रंथ क्यों पढ़ें</h2>
            <ul className="space-y-3">
              {reasons.map((r) => (
                <li key={r} className="flex gap-3 items-start font-body text-lg text-ink-soft">
                  <span className="text-gold text-xl leading-none mt-1">❖</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---------- PHILOSOPHY ---------- */

export function Philosophy({ navigate }: { navigate: Nav }) {
  return (
    <div>
      <div className="max-w-5xl mx-auto px-5 py-20 md:py-24">
        <PageHead kicker="विचार-दर्शन" title="लेखक के विचार"
          sub="नीचे प्रस्तुत विचार लेखक की स्वतंत्र दृष्टि हैं। यह किसी मत, संप्रदाय अथवा संस्था का आधिकारिक सिद्धांत नहीं — यह चिंतन का निमंत्रण है।" />

        <div className="space-y-6">
          {philosophyPillars.map((p, i) => (
            <motion.div
              key={p.id}
              {...fade}
              className={`grid md:grid-cols-3 gap-6 items-center rounded-sm overflow-hidden border border-gold/25 ${i % 2 === 0 ? "paper-texture" : "bg-paper-dark/50"}`}
            >
              <div className="p-8 md:p-10 flex flex-col items-center justify-center text-center bg-maroon/5 md:h-full">
                <span className="font-serif text-3xl md:text-4xl text-saffron-deep leading-snug">{p.sanskrit}</span>
              </div>
              <div className="md:col-span-2 p-8 md:p-10">
                <h3 className="text-2xl text-maroon mb-3">{p.title}</h3>
                <p className="font-body text-lg text-ink-soft leading-relaxed">{p.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
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
              <motion.div key={i} {...fade} className="border border-gold/30 rounded-sm p-7 bg-black/10">
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
          विस्तृत प्रवचन पढ़ें <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
}

/* ---------- ARTICLES ---------- */

export function Articles({ navigate }: { navigate: Nav }) {
  return (
    <div className="max-w-4xl mx-auto px-5 py-20 md:py-24">
      <PageHead kicker="प्रवचन / लेख" title="विचार एवं प्रवचन"
        sub="ग्रंथ से लिए गए संक्षिप्त निबंध एवं स्वतंत्र लेख — प्रत्येक अपने-आप में एक पूर्ण चिंतन।" />
      <div className="space-y-6">
        {articles.map((a) => (
          <motion.button
            key={a.slug}
            {...fade}
            onClick={() => navigate({ name: "article", slug: a.slug })}
            className="w-full text-left group bg-paper-dark/40 border border-gold/25 rounded-sm p-7 hover:border-saffron transition-colors"
          >
            <div className="flex items-center gap-3 mb-3 font-body text-sm text-saffron-deep">
              <span className="tracking-widest uppercase">{a.category}</span>
              <span className="text-gold">•</span>
              <span className="flex items-center gap-1 text-ink-soft"><Clock className="w-3.5 h-3.5" /> {a.readTime}</span>
            </div>
            <h3 className="text-2xl text-maroon mb-2 group-hover:text-saffron-deep transition-colors">{a.title}</h3>
            <p className="font-body text-ink-soft leading-relaxed mb-4">{a.excerpt}</p>
            <span className="link-arrow">पूरा पढ़ें <ArrowRight className="w-4 h-4" /></span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function ArticleDetail({ article, navigate }: { article: Article; navigate: Nav }) {
  return (
    <article className="max-w-2xl mx-auto px-5 py-20 md:py-24">
      <button onClick={() => navigate({ name: "articles" })} className="link-arrow mb-8">
        <ArrowLeft className="w-4 h-4" /> सभी प्रवचन
      </button>
      <div className="flex items-center gap-3 mb-4 font-body text-sm text-saffron-deep">
        <span className="tracking-widest uppercase">{article.category}</span>
        <span className="text-gold">•</span>
        <span className="flex items-center gap-1 text-ink-soft"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
      </div>
      <h1 className="text-4xl md:text-5xl text-maroon leading-tight mb-6">{article.title}</h1>
      <Ornament className="mb-10 !justify-start" />
      <div className="space-y-6">
        {article.body.map((para, i) => (
          <p key={i} className={`font-body text-lg leading-[1.9] text-ink ${i === 0 ? "first-letter:font-serif first-letter:text-6xl first-letter:text-saffron-deep first-letter:float-left first-letter:mr-3 first-letter:leading-[0.8] first-letter:mt-1" : ""}`}>
            {para}
          </p>
        ))}
      </div>
      <div className="gold-rule w-full my-12" />
      <p className="font-body text-sm tracking-[0.25em] uppercase text-saffron-deep">— लेखक के विचार</p>
    </article>
  );
}

/* ---------- GALLERY ---------- */

export function Gallery() {
  return (
    <div className="max-w-6xl mx-auto px-5 py-20 md:py-24">
      <PageHead kicker="कला-दीर्घा / प्रदर्शनी" title="विचार से कला तक"
        sub="विचारों से प्रेरित चित्र, देवनागरी सुलेख एवं संकल्पना रेखांकन — जहाँ दर्शन और कला एक हो जाते हैं।" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {gallery.map((g) => (
          <motion.figure key={g.title} {...fade} className="group">
            <div className="relative overflow-hidden rounded-sm border border-gold/30">
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
      <motion.div {...fade} className="paper-dark-texture text-paper rounded-sm p-10 text-center">
        <Palette className="w-9 h-9 text-gold-soft mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl text-paper mb-3">आगामी कला एवं दर्शन प्रदर्शनी</h2>
        <p className="font-body text-paper/80 max-w-xl mx-auto">
          विचारों पर आधारित एक विशेष प्रदर्शनी की योजना प्रस्तावित है। तिथि एवं स्थान की घोषणा शीघ्र की जाएगी।
        </p>
      </motion.div>
    </div>
  );
}

/* ---------- EVENTS ---------- */

export function Events({ navigate }: { navigate: Nav }) {
  return (
    <div className="max-w-4xl mx-auto px-5 py-20 md:py-24">
      <PageHead kicker="आयोजन" title="कार्यक्रम एवं व्याख्यान"
        sub="ग्रंथ लोकार्पण, सत्संग एवं विचार-गोष्ठी, तथा कला-दर्शन प्रदर्शनी — सभी आयोजनों की जानकारी।" />
      <div className="space-y-5">
        {events.map((e) => (
          <motion.div key={e.title} {...fade} className="flex flex-col sm:flex-row gap-5 bg-paper-dark/40 border border-gold/25 rounded-sm p-6">
            <div className="shrink-0 flex sm:flex-col items-center justify-center gap-1 sm:w-28 bg-maroon/5 rounded-sm px-4 py-3 border border-gold/20">
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
      <motion.div {...fade} className="mt-14 text-center bg-maroon/5 border border-gold/25 rounded-sm p-8">
        <Play className="w-8 h-8 text-saffron mx-auto mb-3" />
        <h3 className="text-2xl text-maroon mb-2">वीडियो रिकॉर्डिंग</h3>
        <p className="font-body text-ink-soft max-w-lg mx-auto mb-5">पूर्व व्याख्यानों एवं चर्चाओं की वीडियो रिकॉर्डिंग शीघ्र उपलब्ध कराई जाएँगी।</p>
        <button onClick={() => navigate({ name: "contact" })} className="btn-ghost mx-auto">व्याख्यान हेतु आमंत्रित करें <ArrowRight className="w-4 h-4" /></button>
      </motion.div>
    </div>
  );
}

/* ---------- CONTACT ---------- */

export function Contact() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-20 md:py-24">
      <PageHead kicker="संपर्क" title="संपर्क एवं ग्रंथ अनुरोध"
        sub="ग्रंथ की प्रति मँगाने, किसी व्याख्यान या पुस्तक-चर्चा हेतु आमंत्रण देने, अथवा विचार साझा करने के लिए संपर्क करें।" />
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          {[
            { icon: Phone, label: "दूरभाष", value: "+91 00000 00000" },
            { icon: MessageCircle, label: "व्हाट्सऐप", value: "+91 00000 00000" },
            { icon: Mail, label: "ईमेल", value: "sampark@praptasya.example" },
            { icon: MapPin, label: "पता", value: "विचार-कुटीर, [नगर], भारत" },
          ].map((c) => (
            <div key={c.label} className="flex gap-4 items-center bg-paper-dark/40 border border-gold/25 rounded-sm p-5">
              <div className="w-11 h-11 rounded-sm bg-saffron/10 border border-saffron/30 flex items-center justify-center shrink-0">
                <c.icon className="w-5 h-5 text-saffron-deep" />
              </div>
              <div>
                <p className="font-body text-xs tracking-widest uppercase text-saffron-deep">{c.label}</p>
                <p className="font-body text-lg text-ink">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="paper-texture border border-gold/25 rounded-sm p-7 space-y-4">
          <h3 className="text-2xl text-maroon mb-2">संदेश भेजें</h3>
          {[
            { ph: "आपका नाम", type: "text" },
            { ph: "ईमेल अथवा दूरभाष", type: "text" },
          ].map((f) => (
            <input key={f.ph} type={f.type} placeholder={f.ph}
              className="w-full font-body bg-paper border border-gold/30 rounded-sm px-4 py-3 text-ink placeholder-ink-soft/60 focus:outline-none focus:border-saffron" />
          ))}
          <select className="w-full font-body bg-paper border border-gold/30 rounded-sm px-4 py-3 text-ink focus:outline-none focus:border-saffron">
            <option>ग्रंथ की प्रति चाहिए</option>
            <option>व्याख्यान हेतु आमंत्रण</option>
            <option>पुस्तक-चर्चा / सत्संग</option>
            <option>अन्य विचार / प्रश्न</option>
          </select>
          <textarea rows={4} placeholder="आपका संदेश"
            className="w-full font-body bg-paper border border-gold/30 rounded-sm px-4 py-3 text-ink placeholder-ink-soft/60 focus:outline-none focus:border-saffron" />
          <button type="submit" className="btn-primary w-full justify-center">संदेश भेजें</button>
          <p className="font-body text-xs text-ink-soft text-center">यह एक प्रदर्शन प्रपत्र है। कृपया उपरोक्त माध्यमों से भी संपर्क कर सकते हैं।</p>
        </form>
      </div>
    </div>
  );
}
