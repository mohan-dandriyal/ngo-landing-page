"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Heart,
  HandHeart,
  Pause,
  Play,
  Users,
  type LucideIcon,
} from "lucide-react";
import data from "@/app/data/banner.json";

// Two clearly different voices: a light italic serif and a heavy grotesque
const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { slides, services, autoplay } = data;

const iconMap: Record<string, LucideIcon> = {
  heart: Heart,
  users: Users,
  "hand-heart": HandHeart,
};

const EASE = [0.22, 1, 0.36, 1] as const;

/* NEW: fixed particle layout (static so server and client render the same) */
const particles = [
  { left: "8%", size: 6, delay: 0, duration: 11 },
  { left: "18%", size: 4, delay: 3, duration: 14 },
  { left: "29%", size: 8, delay: 6, duration: 12 },
  { left: "42%", size: 5, delay: 1.5, duration: 15 },
  { left: "55%", size: 7, delay: 4.5, duration: 13 },
  { left: "68%", size: 4, delay: 8, duration: 11 },
  { left: "79%", size: 6, delay: 2, duration: 14 },
  { left: "90%", size: 5, delay: 5.5, duration: 12 },
];

const pad = (n: number) => String(n).padStart(2, "0");

/* ---------- animation variants ---------- */
const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.25 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

const word: Variants = {
  hidden: { y: "115%", rotate: 4 },
  show: { y: 0, rotate: 0, transition: { duration: 0.85, ease: EASE } },
  exit: { y: "-115%", transition: { duration: 0.4, ease: EASE } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

/* NEW: tagline rule draws itself on every slide change */
const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.7, ease: EASE } },
  exit: { scaleX: 0, transition: { duration: 0.2 } },
};

/* NEW: services strip cards rise in one after another */
const servicesList: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE, delay: 0.9, staggerChildren: 0.14, delayChildren: 1 },
  },
};
const serviceItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* Each word rises out of its own mask */
function Words({ text, className }: { text: string; className: string }) {
  return (
    <span className={`block ${className}`}>
      {text.split(" ").map((w, i) => (
        <span
          key={`${w}-${i}`}
          className="mr-[0.22em] inline-block overflow-hidden pb-[0.16em] pr-[0.08em] align-bottom -mb-[0.16em]"
        >
          <motion.span variants={word} className="inline-block will-change-transform">
            {w}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Banner() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hoverPaused, setHoverPaused] = useState(false);
  const progress = useMotionValue(0);

  // NEW: background drifts slower than the page while scrolling (parallax)
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 700], [0, 140]);

  const playing = !userPaused && !hoverPaused && !reduce;
  const slide = slides[index];

  // Slides never autoplay for people who prefer reduced motion
  useEffect(() => {
    // if (reduce) setUserPaused(true);
  }, [reduce]);

  const go = useCallback(
    (to: number) => {
      setIndex((to + slides.length) % slides.length);
      progress.set(0);
    },
    [progress]
  );

  // The progress bar drives autoplay, so pausing keeps its place
  useAnimationFrame((_, delta) => {
    if (!playing) return;
    const next = progress.get() + delta / autoplay;
    if (next >= 1) {
      setIndex((i) => (i + 1) % slides.length);
      progress.set(0);
    } else {
      progress.set(next);
    }
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="home"
        aria-roledescription="carousel"
        aria-label="Featured campaigns"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1);
          if (e.key === "ArrowLeft") go(index - 1);
        }}
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
        onFocus={() => setHoverPaused(true)}
        onBlur={() => setHoverPaused(false)}
        className={`${sans.className} relative isolate flex min-h-[90svh] flex-col overflow-hidden bg-neutral-950 text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime-400`}
      >
        {/* Background photos: crossfade + slow push-in */}
        <AnimatePresence initial={false}>
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{ y: reduce ? 0 : parallaxY }}
            transition={{
              opacity: { duration: 1.2 },
              scale: { duration: autoplay / 1000 + 1.6, ease: "linear" },
            }}
            className="absolute inset-0 -z-20"
          >
            <Image
              src={slide.image.src}
              alt={slide.image.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

        {/* Overlays keep the type readable on any photo */}
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-r from-black/80 via-black/50 to-black/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-transparent to-black/30"
        />

        {/* NEW: warm orange glow that slowly breathes behind the copy */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-[30rem] w-[30rem] rounded-full bg-[#fe6e41] opacity-20 blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        />

        {/* NEW: glowing embers floating upward */}
        {!reduce && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            {particles.map((p, i) => (
              <motion.span
                key={i}
                className="absolute bottom-0 rounded-full bg-[#fe6e41] shadow-[0_0_12px_2px_rgba(254,110,65,0.7)]"
                style={{ left: p.left, width: p.size, height: p.size }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: "-85svh", opacity: [0, 0.9, 0.9, 0] }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeOut",
                  repeat: Infinity,
                  times: [0, 0.15, 0.7, 1],
                }}
              />
            ))}
          </div>
        )}

        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pb-8 pt-16 lg:px-10">
          {/* Slide copy */}
          <motion.div
            className="my-auto touch-pan-y py-10"
            onPanEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1);
              if (info.offset.x > 60) go(index - 1);
            }}
          >
            <AnimatePresence mode="wait" initial>
              <motion.div
                key={slide.id}
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
                aria-live={playing ? "off" : "polite"}
                className="max-w-4xl"
              >
                <h1>
                  <Words
                    text={slide.heading.light}
                    className={`${serif.className} text-[clamp(2.1rem,5.2vw,4.4rem)] leading-[1.05] text-white/85`}
                  />
                  <Words
                    text={slide.heading.bold}
                    className="mt-1 text-[clamp(2.7rem,8vw,6rem)] font-extrabold leading-[0.92] tracking-tight"
                  />
                </h1>

                <motion.div variants={fadeUp} className="mt-8 flex items-center gap-4">
                  <motion.span
                    variants={drawLine}
                    style={{ originX: 0 }}
                    aria-hidden="true"
                    className="h-px w-12 bg-[#fe6e41]"
                  />
                  <p className="text-lg font-medium text-[#fe6e41] sm:text-xl">
                    {slide.tagline}
                  </p>
                </motion.div>

                <motion.p
                  variants={fadeUp}
                  className="mt-4 max-w-xl text-base leading-relaxed text-white/80"
                >
                  {slide.description}
                </motion.p>

                <motion.div variants={fadeUp} className="mt-8">
                  {/* NEW: halo + lift + press feedback */}
                  <motion.div
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 350, damping: 18 }}
                    className="relative inline-block"
                  >
                    <motion.span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full bg-[#fe6e41]"
                      animate={{ scale: [1, 1.35], opacity: [0.5, 0] }}
                      transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
                    />
                    <a
                      href={slide.cta.href}
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#fe6e41] px-7 py-3.5 text-sm font-bold text-neutral-950 transition-colors hover:bg-white hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                    >
                      {/* NEW: shine sweep */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/50 transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
                      />
                      <span className="relative">{slide.cta.label}</span>
                      <ArrowRight
                        className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </a>
                  </motion.div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Slider controls */}
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {/* NEW: slide counter that rolls like an odometer */}
            <div
              aria-hidden="true"
              className="flex items-center gap-2 text-sm font-semibold tabular-nums leading-5"
            >
              <span className="relative inline-block h-5 w-6 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={index}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "-100%" }}
                    transition={{ duration: 0.45, ease: EASE }}
                    className="absolute inset-0 text-[#fe6e41]"
                  >
                    {pad(index + 1)}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className="text-white/50">/ {pad(slides.length)}</span>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Go to slide ${i + 1}: ${s.heading.bold}`}
                  aria-current={i === index ? "true" : undefined}
                  className="group flex h-6 w-14 items-center focus-visible:outline-2 focus-visible:outline-white sm:w-20"
                >
                  <span className="relative block h-0.5 w-full overflow-hidden bg-white/30 transition-[height] group-hover:h-1">
                    {i === index && (
                      <motion.span
                        aria-hidden="true"
                        style={{ scaleX: reduce ? 1 : progress }}
                        className="absolute inset-0 origin-left bg-[#fe6e41]"
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="rounded-full border border-white/30 p-2.5 transition-colors hover:bg-white hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronLeft className="h-4 w-4" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="rounded-full border border-white/30 p-2.5 transition-colors hover:bg-white hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <ChevronRight className="h-4 w-4" />
              </motion.button>
              <motion.button
                type="button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setUserPaused((v) => !v)}
                aria-label={userPaused ? "Play slideshow" : "Pause slideshow"}
                className="rounded-full border border-white/30 p-2.5 transition-colors hover:bg-white hover:text-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                {userPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </motion.button>
            </div>
          </div>

          {/* Services strip */}
          <motion.ul
            variants={servicesList}
            initial="hidden"
            animate="show"
            className="mt-8 grid divide-y divide-white/15 overflow-hidden rounded-2xl border border-white/15 bg-black/40 backdrop-blur-md md:grid-cols-3 md:divide-x md:divide-y-0"
          >
            {services.map((s, i) => {
              const Icon = iconMap[s.icon] ?? Heart;
              return (
                <motion.li key={s.id} variants={serviceItem}>
                  <a
                    href={s.link.href}
                    className="group flex h-full items-start gap-4 p-6 transition-colors hover:bg-white/5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-lime-400"
                  >
                    {/* NEW: icons gently float, each on its own rhythm */}
                    <motion.span
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 3 + i * 0.6,
                        ease: "easeInOut",
                        repeat: Infinity,
                        delay: i * 0.4,
                      }}
                      className="flex shrink-0"
                    >
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fe6e41] text-neutral-950 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </motion.span>
                    <span>
                      <span className="block text-lg font-bold">{s.title}</span>
                      <span className="mt-1 block text-sm leading-relaxed text-white/70">
                        {s.description}
                      </span>
                      {/* <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-lime-300">
                        {s.link.label}
                        <ArrowUpRight
                          className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                        />
                      </span> */}
                    </span>
                  </a>
                </motion.li>
              );
            })}
          </motion.ul>
        </div>
      </section>
    </MotionConfig>
  );
}