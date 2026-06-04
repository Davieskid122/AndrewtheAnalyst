import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const PROJECTS = [
  {
    num: "01", tag: "B2B Sales", accent: "#c9a97a",
    title: "Revenue Command Dashboard",
    link: "https://sales-intel.andrewtheanalyst.org",
    desc: "B2B sales analysis across 307 orders, 92 customers, and 19 countries, surfacing where revenue is concentrated, what is at risk, and where the next dollar should be spent.",
    finding: "$194K in cancelled orders identified, with root causes traceable to three fulfilment patterns that could be operationally resolved.",
    metrics: ["$10.03M total revenue", "92 customers", "19 countries"],
  },
  {
    num: "02", tag: "SaaS · Retention", accent: "#c9a97a",
    title: "RavenStack Churn Analytics",
    link: "https://revenue-churn-analysis.andrewtheanalyst.org",
    desc: "Subscription churn intelligence across plan tiers, feature usage, and support behaviour, ranked by business impact so retention teams know exactly where to act first.",
    finding: "67 no-auto-renew accounts holding $204K MRR identified before their renewal windows, with a prioritized intervention playbook.",
    metrics: ["$204K revenue at risk", "3 data sources", "6 action items"],
  },
  {
    num: "03", tag: "E-Commerce · CLV", accent: "#c9a97a",
    title: "Customer Lifetime Value Segmentation",
    link: "https://customer-value-segmentation.andrewtheanalyst.org",
    desc: "Statistical CLV modelling across 4,170 customers using BG/NBD and Gamma-Gamma models, predicting future value per customer and allocating retention budget where it generates the highest ROI.",
    finding: "1,154 customers with spend 40%+ below personal baseline flagged, with a win-back ROI calculator built directly into the dashboard.",
    metrics: ["$54M portfolio value", "4,170 customers", "73% Pareto ratio"],
  },
  {
    num: "04", tag: "Investment Intelligence", accent: "#e8935a",
    title: "Macro Market Sentiment & Sector Rotation",
    link: "https://macro-market.andrewtheanalyst.org",
    desc: "Live macroeconomic data from the U.S. Federal Reserve (FRED), classifying the current market regime and identifying which sectors to overweight or underweight based on where we are in the economic cycle.",
    finding: "Live regime classification with historical stress-testing against 1994, 2000, 2008, 2020, and 2022, so the thesis can be validated before capital is deployed.",
    metrics: ["4 live FRED feeds", "11 sector ETFs", "10-year historical range"],
  },

  {
    num: "05", tag: "Healthcare · Predictive Analytics", accent: "#c9a97a",
    title: "No-Show Risk Intelligence",
    link: "https://appointment-risk-intelligence.andrewtheanalyst.org",
    desc: " A booked slot that goes empty isn’t a scheduling problem. The patient didn’t show, and nobody called. This dashboard scores every patient on the morning list by no-show probability.                                             Filter to High Risk: 4 to 8 names on a typical day. Call those. The rest of the list doesn’t need you.",  
     finding: "Lead time between booking and appointment tops the feature importance chart every single time. Not age. Not SMS reminders. The gap between when someone booked and when they’re due in.",
    metrics: ["110,527 patient records", "73% AUC-ROC", "1 in 5 historically never showed"],
  },

  {
    num: "06", tag: "Quantitative Finance · Market Microstructure", accent: "#c9a97a",
    title: "Stock Volume Driver Dashboard",
    link: "https://stock.andrewtheanalyst.org",
    desc: " Daily trading data for AMZN, INTC, NVDA, PLUG, and TSLA across 3 years, statistically isolating what actually drives volume per ticker so traders and risk managers can anticipate liquidity before they need it.",  
     finding: "Big price moves bring 1.5 to 2.4× more volume depending on the ticker, while price level has no reliable relationship with volume, making it a misleading liquidity signal that this dashboard directly corrects.",
    metrics: ["3,605 trading day rows", "5 tickers", "8 analytical panels"],
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ["0%", "20%"]);
  const heroTextY = useTransform(heroScroll, [0, 1], ["0%", "40%"]);
  const heroOpacity = useTransform(heroScroll, [0, 0.8], [1, 0]);

  const carouselRef = useRef<HTMLDivElement>(null);
  const currentCard = useRef(0);
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  const scrollToCard = useCallback((index: number) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.children[index] as HTMLElement;
    if (!card) return;
    carouselRef.current.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
    currentCard.current = index;
  }, []);

  const stopAutoScroll = useCallback(() => {
    if (autoScrollTimer.current) { clearInterval(autoScrollTimer.current); autoScrollTimer.current = null; }
  }, []);

  const startAutoScroll = useCallback(() => {
    stopAutoScroll();
    autoScrollTimer.current = setInterval(() => {
      const next = (currentCard.current + 1) % PROJECTS.length;
      scrollToCard(next);
    }, 3500);
  }, [scrollToCard, stopAutoScroll]);

  const pauseAndResume = useCallback(() => {
    stopAutoScroll();
    if (pauseTimer.current) clearTimeout(pauseTimer.current);
    pauseTimer.current = setTimeout(startAutoScroll, 5000);
  }, [stopAutoScroll, startAutoScroll]);

  useEffect(() => {
    startAutoScroll();
    return () => {
      stopAutoScroll();
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
    };
  }, [startAutoScroll, stopAutoScroll]);

  const handleCarouselMouseDown = (e: React.MouseEvent) => {
    if (!carouselRef.current) return;
    isDragging.current = true;
    dragStartX.current = e.pageX - carouselRef.current.offsetLeft;
    dragScrollLeft.current = carouselRef.current.scrollLeft;
    pauseAndResume();
  };
  const handleCarouselMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !carouselRef.current) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    carouselRef.current.scrollLeft = dragScrollLeft.current - (x - dragStartX.current);
  };
  const handleCarouselMouseUp = () => { isDragging.current = false; };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="bg-[#0a0a0a] text-white overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-14 py-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif text-base md:text-xl text-white tracking-tight"
        >
          andrewtheanalyst.
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex items-center gap-10 text-sm font-light tracking-widest uppercase text-white/70"
        >
          {["work", "about", "contact"].map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="hover:text-white transition-colors duration-300"
            >
              {s}
            </button>
          ))}
        </motion.div>
        <button
          className="md:hidden text-white/70"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="text-xs tracking-widest uppercase">Menu</span>
        </button>
      </nav>

      {menuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-10"
        >
          {["work", "about", "contact"].map((s) => (
            <button
              key={s}
              onClick={() => scrollTo(s)}
              className="font-serif text-4xl italic text-white/80 hover:text-white"
            >
              {s}
            </button>
          ))}
        </motion.div>
      )}

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden">

        {/* Full-bleed photo */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-end bg-black">
          <img
            src="/images/eri5.jpg"
            alt="Eri"
            className="h-[70%] w-[80%] md:w-[45%] object-cover object-top brightness-[0.85]"
          />
        </div>

        {/* Gradient overlay, only darken the very bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

        {/* Hero text */}
        <motion.div
          style={{ y: heroTextY, opacity: heroOpacity }}
          className="absolute inset-0 flex flex-col justify-end px-8 md:px-14 pb-20 md:pb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-white/50 mb-6 font-light">
              Data Analyst & Revenue Strategist
            </p>
            <h1 className="font-serif text-[11vw] sm:text-[12vw] md:text-[9vw] lg:text-[8vw] leading-[0.88] tracking-tight text-white">
              andrewtheanalyst<span className="italic text-white/40">.</span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-8 md:mt-12 flex flex-wrap items-center gap-3 md:gap-4"
          >
            <button
              onClick={() => scrollTo("work")}
              className="px-6 md:px-8 py-3 border border-white/30 text-xs md:text-sm tracking-widest uppercase text-white/70 hover:bg-white hover:text-black transition-all duration-300 font-light"
            >
              View Work
            </button>
            <button
              onClick={() => scrollTo("contact")}
              className="px-6 md:px-8 py-3 text-xs md:text-sm tracking-widest uppercase text-white/40 hover:text-white transition-colors duration-300 font-light"
            >
              Get in touch →
            </button>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 right-8 md:right-14 flex items-center gap-3 text-white/30 text-xs tracking-widest uppercase"
        >
          <span>Scroll</span>
          <div className="w-12 h-[1px] bg-white/30" />
        </motion.div>
      </section>

      {/* ── STATEMENT ── */}
      <section id="about" className="py-28 md:py-40 px-8 md:px-14 bg-black">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
            <div className="md:col-span-4">
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-xs tracking-[0.25em] uppercase text-[#c9a97a]/70 font-light mb-4"
              >
                About
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-12 h-[1px] bg-[#c9a97a]/40 mb-6"
              />
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <p className="font-serif text-lg text-white/80 leading-snug">Andrew Eriiyanuoluwa</p>
                <p className="text-xs text-white/30 font-light tracking-widest uppercase mt-1">andrewtheanalyst</p>
              </motion.div>
            </div>
            <div className="md:col-span-8 space-y-8">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="font-serif text-3xl md:text-4xl lg:text-5xl leading-[1.15] text-white/90"
              >
                Statistics graduate from the University of Ibadan. I build
                revenue intelligence tools for B2B and e-commerce businesses
                whose customer data sits around{" "}
                <span className="italic text-white/40">half-used.</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="font-serif text-xl md:text-2xl italic text-white/50 leading-relaxed"
              >
                I find what the data says, not what someone wants to hear.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/10"
              >
                <p className="text-white/50 font-light text-base leading-relaxed">
                  Not spending years inside one industry has worked in my favour. I don't carry its assumptions, and my training is genuinely quantitative. I run numbers to find out what they say, not to confirm a hypothesis someone already loves.
                </p>
                <p className="text-white/50 font-light text-base leading-relaxed">
                  Most of the dashboards I build do two things: show what happened, and say what to do about it. The second part is usually why someone hired me.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PORTRAIT STRIP ── */}
      <section className="w-full bg-black flex justify-center overflow-hidden py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-52 h-52 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-[#c9a97a]/30 shadow-[0_0_60px_rgba(201,169,122,0.1)]"
        >
          <img
            src="/images/eri6.jpg"
            alt="andrewtheanalyst"
            className="w-full h-full object-cover brightness-[0.88]"
            style={{ objectPosition: "center 15%" }}
          />
        </motion.div>
      </section>


      {/* ── SELECTED WORK ── */}
      <section id="work" className="py-28 md:py-40 bg-[#111827]">
        {/* Section header */}
        <div className="px-8 md:px-14 max-w-6xl mx-auto mb-16">
          <div className="flex items-end justify-between border-b border-white/10 pb-10">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="font-serif text-4xl md:text-6xl text-white"
            >
              Selected<br />
              <span className="italic text-white/40">Work</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hidden md:block text-white/30 font-light text-sm max-w-xs text-right leading-relaxed"
            >
              Tools built to surface hidden revenue and answer difficult questions.
            </motion.p>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            ref={carouselRef}
            className="flex gap-5 overflow-x-auto snap-x snap-mandatory px-8 md:px-14 pb-4 cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
            onMouseDown={handleCarouselMouseDown}
            onMouseMove={handleCarouselMouseMove}
            onMouseUp={handleCarouselMouseUp}
            onMouseLeave={handleCarouselMouseUp}
            onTouchStart={() => pauseAndResume()}
          >
          {PROJECTS.map((p, i) => (
            <div
              key={i}
              className="snap-start flex-shrink-0 w-[82vw] md:w-[46vw] lg:w-[38vw] xl:w-[420px] rounded-2xl border border-white/10 p-7 flex flex-col gap-5"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              {/* Tag */}
              <span
                className="text-[10px] tracking-[0.25em] uppercase font-light"
                style={{ color: p.accent }}
              >
                {p.tag}
              </span>

              {/* Number + Title */}
              <div>
                <span className="text-xs font-mono text-white/20 mb-1 block">{p.num}</span>
                <h3 className="font-serif text-xl md:text-2xl text-white leading-snug">{p.title}</h3>
              </div>

              {/* Description */}
              <p className="text-white/45 font-light text-sm leading-relaxed">{p.desc}</p>

              {/* Key Finding */}
              <div
                className="border-l-2 pl-4 py-1"
                style={{ borderColor: p.accent + "80" }}
              >
                <p className="text-[9px] tracking-[0.22em] uppercase mb-1" style={{ color: p.accent + "99" }}>Key Finding</p>
                <p className="text-white/55 text-sm font-light leading-relaxed">{p.finding}</p>
              </div>

              {/* Metrics */}
              <div className="flex flex-wrap gap-2">
                {p.metrics.map((m, mi) => (
                  <span
                    key={mi}
                    className="text-[10px] font-mono border rounded-full px-3 py-1"
                    style={{ borderColor: p.accent + "50", color: p.accent + "cc" }}
                  >
                    {m}
                  </span>
                ))}
              </div>

              {/* CTA */}
              <a
                href={p.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-[0.22em] uppercase font-light text-white/40 hover:text-white transition-colors duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                View Live Dashboard <span>↗</span>
              </a>
            </div>
          ))}
          </div>
          {/* Right-edge fade, hints there are more cards */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#111827] to-transparent" />
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {PROJECTS.map((_, i) => (
            <button
              key={i}
              onClick={() => { scrollToCard(i); pauseAndResume(); }}
              className="w-1.5 h-1.5 rounded-full bg-white/20 hover:bg-white/50 transition-colors duration-300"
            />
          ))}
        </div>
      </section>

      {/* ── INVESTOR CALLOUT ── */}
      <section className="bg-[#111827] py-0">
        <div className="grid grid-cols-1 md:grid-cols-2 items-stretch">
          {/* Circular profile photo */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="flex items-center justify-center bg-[#111827] order-2 md:order-1 min-h-[40vh] md:min-h-[60vh] py-16 md:py-20"
          >
            <div className="w-52 h-52 md:w-72 md:h-72 rounded-full overflow-hidden border-2 border-[#c9a97a]/30 shadow-[0_0_60px_rgba(201,169,122,0.1)]">
              <img
                src="/images/eri6.jpg"
                alt="Andrew Eriiyanuoluwa"
                className="w-full h-full object-cover brightness-[0.88]"
                style={{ objectPosition: "center 10%" }}
              />
            </div>
          </motion.div>

          {/* Text side */}
          <div className="flex flex-col justify-center px-6 md:px-14 py-12 md:py-32 order-1 md:order-2">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-xs tracking-[0.25em] uppercase text-[#c9a97a]/70 mb-8 font-light"
            >
              Side Projects
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-4xl md:text-5xl lg:text-6xl leading-[1.1] text-white mb-8"
            >
              I build tools<br />
              <span className="italic text-white/40">for investors.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white/50 font-light text-lg leading-relaxed mb-10"
            >
              Dashboards that track where we are in the economic cycle, identify
              which sectors look worth overweighting, and stress-test the thesis
              against past regimes before anyone commits money.
            </motion.p>
            <motion.a
              href="https://macro-market.andrewtheanalyst.org"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-3 px-7 py-3 border border-[#c9a97a]/40 text-[#c9a97a] text-xs tracking-[0.22em] uppercase font-light hover:bg-[#c9a97a]/10 transition-colors duration-300"
            >
              View Live Dashboard <span>↗</span>
            </motion.a>
          </div>
        </div>
      </section>

      {/* ── CAPABILITIES ── */}
      <section className="py-28 md:py-40 px-8 md:px-14 bg-[#0d1117]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="md:col-span-4">
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs tracking-[0.25em] uppercase text-[#c9a97a]/70 mb-4 font-light"
              >
                Capabilities
              </motion.p>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="font-serif text-3xl md:text-4xl text-white sticky top-32"
              >
                What I<br />
                <span className="italic text-white/40">do.</span>
              </motion.h2>
            </div>
            <div className="md:col-span-8">
              {[
                {
                  title: "Data Modelling & Architecture",
                  tools: "R · Python · SQL · dbt",
                  desc: "Structuring messy, disparate data sources into clean, reliable single sources of truth that people actually trust.",
                },
                {
                  title: "Revenue Intelligence",
                  tools: "Churn · LTV · Pricing Elasticity",
                  desc: "Predictive models that move beyond historical reporting into forward-looking strategy. Knowing what will happen, not just what did.",
                },
                {
                  title: "Dashboard Engineering",
                  tools: "Looker · Microsoft Power BI · Custom",
                  desc: "Highly interactive, bespoke interfaces that tell a story. Not charts on a page, tools that actually drive decisions.",
                },
                {
                  title: "Statistical Rigour",
                  tools: "A/B Testing · Cohort Analysis · Regression",
                  desc: "Academic statistical methods applied to business problems. Conclusions you can defend, not numbers that just look right.",
                },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group py-10 border-b border-white/10 hover:border-[#c9a97a]/40 transition-colors duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4 mb-3">
                    <h3 className="font-serif text-xl md:text-2xl text-white/80 group-hover:text-white transition-colors duration-300">
                      {s.title}
                    </h3>
                    <span className="text-xs text-[#c9a97a]/55 font-light font-mono sm:whitespace-nowrap sm:pt-1">{s.tools}</span>
                  </div>
                  <p className="text-white/35 font-light text-sm leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="py-28 md:py-36 px-8 md:px-14 bg-[#111827]">
        <div className="max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.25em] uppercase text-[#c9a97a]/70 font-light mb-16 text-center"
          >
            Client Feedback
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="text-center"
          >
            <span className="block font-serif text-5xl text-[#c9a97a]/30 leading-none mb-6">"</span>
            <p className="font-serif text-2xl md:text-3xl lg:text-4xl text-white/80 leading-[1.3] italic mb-10">
              Andrew didn't just hand us a dashboard, he handed us a decision. Within two weeks of the analysis, we reallocated budget away from three underperforming channels and saw a 22% lift in qualified pipeline.
            </p>
            <div className="flex flex-col items-center gap-1">
              <div className="w-8 h-[1px] bg-[#c9a97a]/40 mb-4" />
              <p className="text-white/60 text-sm font-light tracking-wide">James H.</p>
              <p className="text-white/30 text-xs font-light tracking-widest uppercase">Head of Revenue Operations</p>
            </div>
          </motion.blockquote>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="py-28 md:py-36 px-8 md:px-14 bg-black">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <p className="text-xs tracking-[0.2em] uppercase text-[#c9a97a]/70 font-light mb-2">
              Let's Work
            </p>
            <p className="text-white/40 text-sm font-light tracking-wide mb-6">Currently available</p>
            <h2 className="font-serif text-4xl md:text-5xl text-white">
              Start a conversation.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start">
            {/* Left, contact info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              {/* Email */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-light mb-0.5">Email</p>
                  <a href="mailto:contact@andrewtheanalyst.org" className="text-white/60 hover:text-white transition-colors text-sm font-light">contact@andrewtheanalyst.org</a>
                </div>
              </div>

              {/* Upwork */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <path d="M8 21h8M12 17v4"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-light mb-0.5">Upwork</p>
                  <a href="https://www.upwork.com/freelancers/~017947a786a60508cd?mp_source=share" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-light">upwork.com/freelancers/andrewtheanalyst</a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-light mb-0.5">LinkedIn</p>
                  <a href="http://linkedin.com/in/eriiyanuoluwa-andrew-akinola" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-white transition-colors text-sm font-light">linkedin.com/in/eriiyanuoluwa-andrew-akinola</a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/25 font-light mb-0.5">Location</p>
                  <p className="text-white/60 text-sm font-light">Nigeria · Available Remotely</p>
                </div>
              </div>
            </motion.div>

            {/* Right, contact form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15 }}
            >
              <form className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-white/30 font-light mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white/70 placeholder-white/20 text-sm font-light focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-white/30 font-light mb-2">Email</label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white/70 placeholder-white/20 text-sm font-light focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-white/30 font-light mb-2">Subject</label>
                  <select defaultValue="" className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white/40 text-sm font-light focus:outline-none focus:border-white/30 transition-colors appearance-none">
                    <option value="" disabled>Select a topic...</option>
                    <option value="dashboard">Dashboard / Data Product</option>
                    <option value="analysis">Data Analysis</option>
                    <option value="strategy">Revenue Strategy</option>
                    <option value="investor">Investor Tools</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.18em] uppercase text-white/30 font-light mb-2">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell me about your project or question..."
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white/70 placeholder-white/20 text-sm font-light focus:outline-none focus:border-white/30 transition-colors resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#c9a97a] hover:bg-[#b8925e] text-[#0a0a0a] text-xs tracking-[0.25em] uppercase font-medium py-4 rounded-lg transition-colors duration-300"
                >
                  Review & Send
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div className="px-8 md:px-14 py-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-black">
        <p className="text-white/20 text-xs font-light tracking-widest">
          © {new Date().getFullYear()} Andrew Eriiyanuoluwa · andrewtheanalyst. All rights reserved.
        </p>
        <p className="text-white/20 text-xs font-light tracking-widest uppercase">
          Data Analyst & Revenue Strategist
        </p>
      </div>

    </div>
  );
}
