"use client";

import { useState } from "react";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
import { ArrowRight, Mail, Plus } from "lucide-react";
import data from "@/app/data/faq.json";

const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { tagline, heading, intro, contact, categories, faqs } = data as {
  tagline: string;
  heading: { light: string; bold: string };
  intro: string;
  contact: {
    title: string;
    description: string;
    email: string;
    cta: { href: string; label: string };
  };
  categories: { id: string; label: string }[];
  faqs: { id: string; category: string; question: string; answer: string }[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

// NEW: the tagline rule draws itself from left to right
const drawLine: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

export default function Faq() {
  const [category, setCategory] = useState("all");
  const [openId, setOpenId] = useState<string | null>(faqs[0].id);

  const visible = category === "all" ? faqs : faqs.filter((f) => f.category === category);

  const pick = (id: string) => {
    setCategory(id);
    const first = (id === "all" ? faqs : faqs.filter((f) => f.category === id))[0];
    setOpenId(first ? first.id : null);
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="faq"
        className={`${sans.className} relative scroll-mt-16 overflow-hidden bg-white py-20 text-[color:var(--ink)] lg:py-28`}
      >
        {/* NEW: slowly drifting background blobs */}
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-[var(--brand)] opacity-[0.08] blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 14, ease: "easeInOut", repeat: Infinity }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[var(--brand)] opacity-[0.06] blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 18, ease: "easeInOut", repeat: Infinity }}
        />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            {/* Left: heading + contact card */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="lg:sticky lg:top-28 lg:self-start"
            >
              <motion.div variants={rise} className="flex items-center gap-4">
                <motion.span
                  variants={drawLine}
                  style={{ originX: 0 }}
                  aria-hidden="true"
                  className="h-px w-12 bg-[var(--brand)]"
                />
                <p className="text-lg font-semibold text-[color:var(--brand-ink)]">{tagline}</p>
              </motion.div>

              <h2 className="mt-5">
                <motion.span
                  variants={rise}
                  className={`${serif.className} block text-[clamp(1.8rem,3.6vw,3rem)] leading-[1.1] text-neutral-700`}
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

              <motion.p
                variants={rise}
                className="mt-6 max-w-md text-base leading-relaxed text-neutral-600"
              >
                {intro}
              </motion.p>

              <motion.div
                variants={rise}
                className="mt-8 max-w-md rounded-3xl bg-[var(--ink)] p-6 text-white sm:p-7"
              >
                {/* NEW: lift on hover */}
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* NEW: pulsing ring behind the mail icon */}
                  <span className="relative flex h-12 w-12 items-center justify-center">
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[var(--brand)]"
                      animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
                      transition={{ duration: 2, ease: "easeOut", repeat: Infinity }}
                    />
                    <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)] text-[color:var(--ink)]">
                      <Mail className="h-5 w-5" aria-hidden="true" />
                    </span>
                  </span>
                  <h3 className="mt-5 text-xl font-bold">{contact.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">
                    {contact.description}
                  </p>
                  <a
                    href={`mailto:${contact.email}`}
                    className="mt-3 inline-block text-sm font-semibold text-[color:var(--brand)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {contact.email}
                  </a>
                  <a
                    href={contact.cta.href}
                    className="group mt-6 flex w-fit items-center gap-2 rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-bold text-[color:var(--ink)] transition-colors hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                  >
                    {contact.cta.label}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right: filters + accordion */}
            <div>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter questions">
                {categories.map((c) => {
                  const isActive = c.id === category;
                  return (
                    <motion.button
                      key={c.id}
                      type="button"
                      onClick={() => pick(c.id)}
                      aria-pressed={isActive}
                      whileTap={{ scale: 0.94 }}
                      className={`relative isolate rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)] ${
                        isActive ? "text-white" : "text-neutral-600 hover:text-[color:var(--ink)]"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="faq-pill"
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full bg-[var(--ink)]"
                          transition={{ type: "spring", stiffness: 450, damping: 36 }}
                        />
                      )}
                      {!isActive && (
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full border border-neutral-200"
                        />
                      )}
                      {c.label}
                    </motion.button>
                  );
                })}
              </div>

              <motion.ul
                key={category}
                variants={stagger}
                initial="hidden"
                animate="show"
                className="mt-6 space-y-3"
              >
                {visible.map((f) => {
                  const isOpen = f.id === openId;
                  return (
                    <motion.li
                      key={f.id}
                      variants={rise}
                      // NEW: gentle nudge on hover for closed items
                      whileHover={isOpen ? undefined : { x: 6 }}
                      className={`rounded-2xl border transition-[border-color,box-shadow] duration-300 ${
                        isOpen
                          ? "border-[color:var(--brand)] bg-white shadow-[0_16px_40px_-20px_rgba(254,110,65,0.45)]"
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      }`}
                    >
                      <h3>
                        <button
                          type="button"
                          id={`faq-btn-${f.id}`}
                          aria-expanded={isOpen}
                          aria-controls={`faq-panel-${f.id}`}
                          onClick={() => setOpenId(isOpen ? null : f.id)}
                          className="flex w-full items-center justify-between gap-5 rounded-2xl px-5 py-5 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[color:var(--brand)] sm:px-7 sm:py-6"
                        >
                          <span className="text-lg font-bold leading-snug sm:text-xl">
                            {f.question}
                          </span>
                          <span
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                              isOpen
                                ? "bg-[var(--brand)] text-[color:var(--ink)]"
                                : "bg-neutral-100 text-[color:var(--ink)]"
                            }`}
                          >
                            {/* NEW: springy rotation instead of a CSS transition */}
                            <motion.span
                              animate={{ rotate: isOpen ? 135 : 0 }}
                              transition={{ type: "spring", stiffness: 300, damping: 18 }}
                              className="flex"
                            >
                              <Plus className="h-5 w-5" aria-hidden="true" />
                            </motion.span>
                          </span>
                        </button>
                      </h3>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            id={`faq-panel-${f.id}`}
                            role="region"
                            aria-labelledby={`faq-btn-${f.id}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.35, ease: EASE }}
                            className="overflow-hidden"
                          >
                            {/* NEW: answer text slides down and fades in after the panel opens */}
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: 0.12, ease: EASE }}
                              className="max-w-2xl px-5 pb-6 text-base leading-relaxed text-neutral-600 sm:px-7 sm:pb-7"
                            >
                              {f.answer}
                            </motion.p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}