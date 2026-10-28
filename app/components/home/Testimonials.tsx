"use client";

import { useState } from "react";
import Image from "next/image";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import data from "@/app/data/testimonials.json";

const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { tagline, heading, testimonials } = data;

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Quote slides in from the side you navigated toward */
const slide: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -56, transition: { duration: 0.25 } }),
};

const initials = (name: string) =>
  name
    .replace(/^Dr\.?\s+/i, "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

/* Photo, or the person's initials if the file is missing */
function Avatar({ name, src, alt, size }: { name: string; src: string; alt: string; size: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`relative block overflow-hidden rounded-full bg-white/15 ${size}`}>
      {failed ? (
        <span className="flex h-full w-full items-center justify-center text-base font-bold text-white">
          {initials(name)}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="64px"
          onError={() => setFailed(true)}
          className="object-cover"
        />
      )}
    </span>
  );
}

export default function Testimonials() {
  const [[index, dir], setPage] = useState<[number, number]>([0, 0]);
  const count = testimonials.length;
  const current = testimonials[index];

  const go = (to: number, d: number) => setPage([(to + count) % count, d]);

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="testimonials"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(index + 1, 1);
          if (e.key === "ArrowLeft") go(index - 1, -1);
        }}
        className={`${sans.className} relative scroll-mt-16 overflow-hidden bg-[var(--ink)] py-20 text-white lg:py-28`}
      >
        <div className="mx-auto max-w-5xl px-6 text-center lg:px-10">
          {/* Heading */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={rise} className="flex items-center justify-center gap-4">
              <span aria-hidden="true" className="h-px w-12 bg-[var(--brand)]" />
              <p className="text-lg font-semibold text-[color:var(--brand)]">{tagline}</p>
              <span aria-hidden="true" className="h-px w-12 bg-[var(--brand)]" />
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
          </motion.div>

          {/* Quote stage */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            onPanEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1, 1);
              if (info.offset.x > 60) go(index - 1, -1);
            }}
            className="mt-12 touch-pan-y lg:mt-14"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--brand)] text-[color:var(--ink)]">
              <Quote className="h-7 w-7 fill-current" aria-hidden="true" />
            </span>

            <div className="relative mt-8 min-h-[330px] sm:min-h-[290px] lg:min-h-[270px]" aria-live="polite">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.figure
                  key={current.id}
                  custom={dir}
                  variants={slide}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col items-center"
                >
                  <div className="flex gap-1" role="img" aria-label={`${current.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < current.rating ? "fill-[var(--brand)] text-[color:var(--brand)]" : "text-white/25"
                        }`}
                        aria-hidden="true"
                      />
                    ))}
                  </div>

                  <blockquote
                    className={`${serif.className} mt-6 max-w-4xl text-[clamp(1.45rem,3vw,2.4rem)] leading-[1.3] text-white`}
                  >
                    &ldquo;{current.quote}&rdquo;
                  </blockquote>

                  <figcaption className="mt-8 flex items-center gap-4 text-left">
                    <Avatar
                      name={current.name}
                      src={current.image.src}
                      alt={current.image.alt}
                      size="h-14 w-14"
                    />
                    <span>
                      <span className="block text-lg font-bold">{current.name}</span>
                      <span className="block text-sm text-white/60">{current.role}</span>
                    </span>
                  </figcaption>
                </motion.figure>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Controls: arrows + avatar picker */}
          <div className="mt-10 flex items-center justify-center gap-4 sm:gap-6">
            <button
              type="button"
              onClick={() => go(index - 1, -1)}
              aria-label="Previous testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <ul className="flex items-center gap-3 sm:gap-5">
              {testimonials.map((t, i) => {
                const isActive = i === index;
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => go(i, i > index ? 1 : -1)}
                      aria-label={`Show testimonial from ${t.name}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`relative block rounded-full transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white ${
                        isActive ? "scale-100" : "scale-90 opacity-50 grayscale hover:opacity-80"
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="avatar-ring"
                          aria-hidden="true"
                          className="absolute -inset-1.5 rounded-full border-2 border-[color:var(--brand)]"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <Avatar name={t.name} src={t.image.src} alt="" size="h-12 w-12 sm:h-14 sm:w-14" />
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={() => go(index + 1, 1)}
              aria-label="Next testimonial"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/30 transition-colors hover:bg-white hover:text-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}