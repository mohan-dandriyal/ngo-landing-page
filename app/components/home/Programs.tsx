"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  Droplets,
  GraduationCap,
  ImageOff,
  Plus,
  Stethoscope,
  Utensils,
  type LucideIcon,
} from "lucide-react";
import data from "@/app/data/programs.json";

const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { tagline, heading, intro, programs } = data;

const iconMap: Record<string, LucideIcon> = {
  "graduation-cap": GraduationCap,
  utensils: Utensils,
  stethoscope: Stethoscope,
  droplets: Droplets,
};

const EASE = [0.22, 1, 0.36, 1] as const;

const pad = (n: number) => String(n).padStart(2, "0");

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

const row: Variants = {
  hidden: { opacity: 0, x: -36 },
  show: { opacity: 1, x: 0, transition: { duration: 0.65, ease: EASE } },
};

const CURTAIN_CLOSED = "inset(0% 0% 100% 0% round 2rem)";
const CURTAIN_OPEN = "inset(0% 0% 0% 0% round 2rem)";

export default function Programs() {
  const [activeId, setActiveId] = useState<(typeof programs)[number]["id"]>(programs[0].id);
  const [failed, setFailed] = useState<string[]>([]);

  // The scroll check watches this plain wrapper. The clipped panel inside it
  // starts fully hidden, so watching the panel itself could leave it stuck closed.
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, { once: true, amount: 0.1 });

  const active = programs.find((p) => p.id === activeId) ?? programs[0];
  const activeIndex = programs.findIndex((p) => p.id === active.id);
  const imageFailed = failed.includes(active.image.src);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="programs"
        className={`${sans.className} relative scroll-mt-16 overflow-hidden bg-[var(--ink,#0b1218)] py-20 text-white lg:py-28`}
      >
        {/* Background glow effects */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 top-20 h-[30rem] w-[30rem] rounded-full bg-[var(--brand,#e0503a)] opacity-[0.12] blur-3xl"
          animate={{ x: [0, 60, 0], y: [0, 40, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[var(--brand,#e0503a)] opacity-[0.09] blur-3xl"
          animate={{ x: [0, -60, 0], y: [0, -40, 0], scale: [1, 1.25, 1] }}
          transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          {/* Header section */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid items-end gap-8 lg:grid-cols-2 lg:gap-20"
          >
            <div>
              <motion.div variants={rise} className="flex items-center gap-4">
                <motion.span
                  variants={drawLine}
                  style={{ originX: 0 }}
                  aria-hidden="true"
                  className="h-px w-12 bg-[var(--brand,#e0503a)]"
                />
                <p className="text-lg font-semibold text-[color:var(--brand,#e0503a)]">{tagline}</p>
              </motion.div>

              <h2 className="mt-5">
                <motion.span
                  variants={rise}
                  className={`${serif.className} block text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.1] text-white/80`}
                >
                  {heading.light}
                </motion.span>
                <motion.span
                  variants={rise}
                  className="mt-1 block text-[clamp(2.3rem,5vw,4rem)] font-extrabold leading-[0.98] tracking-tight"
                >
                  {heading.bold}
                </motion.span>
              </h2>
            </div>

            <motion.p variants={rise} className="max-w-xl text-base leading-relaxed text-white/70">
              {intro}
            </motion.p>
          </motion.div>

          {/* Main layout */}
          <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
            {/* Image preview */}
            <div ref={stageRef} className="order-first lg:sticky lg:top-24 lg:order-2 lg:self-start">
              <motion.div
                initial={{ clipPath: CURTAIN_CLOSED }}
                animate={{ clipPath: stageInView ? CURTAIN_OPEN : CURTAIN_CLOSED }}
                transition={{ duration: 1.1, ease: EASE }}
                className="relative h-[420px] overflow-hidden rounded-[2rem] bg-white/5 lg:h-[620px]"
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.id}
                    initial={{ opacity: 0, scale: 1.08 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: EASE }}
                    className="absolute inset-0"
                  >
                    {imageFailed ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#141d24] p-6 text-center">
                        <ImageOff className="h-10 w-10 text-[color:var(--brand,#e0503a)]" aria-hidden="true" />
                        <p className="text-sm font-medium text-white/70">Image not found</p>
                        <span className="max-w-xs break-all font-mono text-xs text-white/40">
                          Add the file to public{active.image.src}
                        </span>
                      </div>
                    ) : (
                      <Image
                        src={active.image.src}
                        alt={active.image.alt || active.title}
                        fill
                        sizes="(min-width: 1024px) 45vw, 100vw"
                        onError={() =>
                          setFailed((f) => (f.includes(active.image.src) ? f : [...f, active.image.src]))
                        }
                        className="object-cover"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
                />

                {/* Number indicator chip */}
                <div
                  aria-hidden="true"
                  className="absolute bottom-6 left-6 z-10 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold leading-5 tabular-nums backdrop-blur-md"
                >
                  <span className="relative inline-block h-5 w-6 overflow-hidden">
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        key={active.id}
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="absolute inset-0 text-[color:var(--brand,#e0503a)]"
                      >
                        {pad(activeIndex + 1)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-white/60">/ {pad(programs.length)}</span>
                </div>
              </motion.div>
            </div>

            {/* Interactive program list */}
            <motion.ul
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="divide-y divide-white/10 border-y border-white/10 lg:order-1"
            >
              {programs.map((p) => {
                const Icon = iconMap[p.icon] ?? GraduationCap;
                const isActive = p.id === activeId;
                return (
                  <motion.li key={p.id} variants={row} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="program-marker"
                        aria-hidden="true"
                        className="absolute inset-y-0 left-0 w-1 rounded-full bg-[var(--brand,#e0503a)]"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}

                    <motion.button
                      type="button"
                      onClick={() => setActiveId(p.id)}
                      aria-expanded={isActive}
                      aria-controls={`program-${p.id}`}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ type: "spring", stiffness: 350, damping: 24 }}
                      className="group flex w-full items-center gap-5 py-6 pl-6 pr-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--brand,#e0503a)]"
                    >
                      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                        {isActive && (
                          <motion.span
                            aria-hidden="true"
                            className="absolute inset-0 rounded-full bg-[var(--brand,#e0503a)]"
                            animate={{ scale: [1, 1.6], opacity: [0.45, 0] }}
                            transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
                          />
                        )}
                        <motion.span
                          whileHover={{ scale: 1.1, rotate: -8 }}
                          transition={{ type: "spring", stiffness: 400, damping: 14 }}
                          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-300 ${
                            isActive
                              ? "bg-[var(--brand,#e0503a)] text-white"
                              : "bg-white/10 text-white group-hover:bg-white/20"
                          }`}
                        >
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </motion.span>
                      </span>

                      <span className="flex-1">
                        <span className="block text-xl font-bold sm:text-2xl">{p.title}</span>
                        <span className="mt-0.5 block text-sm text-white/60">{p.summary}</span>
                      </span>

                      <motion.span
                        animate={{ rotate: isActive ? 135 : 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        className={`flex shrink-0 ${
                          isActive ? "text-[color:var(--brand,#e0503a)]" : "text-white/60"
                        }`}
                      >
                        <Plus className="h-5 w-5" aria-hidden="true" />
                      </motion.span>
                    </motion.button>

                    <AnimatePresence initial={false}>
                      {isActive && (
                        <motion.div
                          id={`program-${p.id}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="pb-7 pl-[5.75rem] pr-2">
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
                              className="max-w-md text-base leading-relaxed text-white/75"
                            >
                              {p.description}
                            </motion.p>
                            <motion.div
                              initial={{ opacity: 0, y: 12 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.22, ease: EASE }}
                              className="mt-5"
                            >
                              <motion.div
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.96 }}
                                transition={{ type: "spring", stiffness: 350, damping: 18 }}
                                className="inline-block"
                              >
                               
                              </motion.div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}