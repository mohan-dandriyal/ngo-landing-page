"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import {
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  type Variants,
} from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import data from "@/app/data/volunteer.json";

const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { heading, subline, description, cta, slides } = data;

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Photo, or a tidy placeholder if the file is missing */
function SlideImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[var(--brand-tint)] p-4 text-center text-[color:var(--brand-ink)]">
        <ImageOff className="h-8 w-8" aria-hidden="true" />
        {process.env.NODE_ENV !== "production" && (
          <span className="break-all text-xs">Missing file: public{src}</span>
        )}
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1024px) 300px, 240px"
      onError={() => setFailed(true)}
      className="object-cover transition-transform duration-700 group-hover:scale-105"
    />
  );
}

export default function VolunteerSlider({ id = "volunteers" }: { id?: string }) {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Scroll progress of the track drives both the progress bar and the arrow states
  const { scrollXProgress } = useScroll({ container: trackRef });
  useMotionValueEvent(scrollXProgress, "change", (v) => {
    setAtStart(v <= 0.01);
    setAtEnd(v >= 0.99);
  });

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector("li");
    const step = (card?.getBoundingClientRect().width ?? 280) + 20;
    track.scrollBy({ left: dir * step, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <MotionConfig reducedMotion="user">
      <section
        id={id}
        className={`${sans.className} relative scroll-mt-16 overflow-hidden py-20 text-[color:var(--ink)] lg:py-28`}
      >
        {/* Left edge lines up with the page container; the slider runs off the right edge of the screen */}
        <div className="pl-6 lg:pl-[max(2.5rem,calc((100vw-80rem)/2+2.5rem))]">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:gap-16">
            {/* Left: copy */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="pr-6 lg:w-[25rem] lg:shrink-0 lg:pr-0"
            >
              <h2>
                <motion.span
                  variants={rise}
                  className={`${serif.className} block text-[clamp(1.9rem,3.6vw,3rem)] leading-[1.1] text-neutral-700`}
                >
                  {heading.light}
                </motion.span>
                <motion.span
                  variants={rise}
                  className="mt-1 block text-[clamp(2.4rem,4.6vw,3.9rem)] font-extrabold leading-[0.98] tracking-tight"
                >
                  {heading.bold}
                </motion.span>
              </h2>

              <motion.div variants={rise} className="mt-6 flex items-center gap-4">
                <motion.span
                  variants={{
                    hidden: { scaleX: 0 },
                    show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
                  }}
                  style={{ originX: 0 }}
                  aria-hidden="true"
                  className="h-px w-12 bg-[var(--brand)]"
                />
                <p className="text-lg font-semibold text-[color:var(--brand-ink)]">{subline}</p>
              </motion.div>

              <motion.p variants={rise} className="mt-5 max-w-sm text-base leading-relaxed text-neutral-600">
                {description}
              </motion.p>


              {/* Slider controls */}
              <motion.div variants={rise} className="mt-10 flex items-center gap-5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => scrollByCard(-1)}
                    disabled={atStart}
                    aria-label="Previous photos"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 transition-colors hover:border-[color:var(--ink)] hover:bg-[var(--ink)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-neutral-300 disabled:hover:bg-transparent disabled:hover:text-[color:var(--ink)]"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollByCard(1)}
                    disabled={atEnd}
                    aria-label="Next photos"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 transition-colors hover:border-[color:var(--ink)] hover:bg-[var(--ink)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:border-neutral-300 disabled:hover:bg-transparent disabled:hover:text-[color:var(--ink)]"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div aria-hidden="true" className="h-0.5 w-28 overflow-hidden rounded-full bg-neutral-300">
                  <motion.div
                    style={{ scaleX: scrollXProgress }}
                    className="h-full origin-left bg-[var(--brand)]"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Right: photo slider */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
              className="min-w-0 flex-1"
            >
              <div
                ref={trackRef}
                role="region"
                aria-label="Volunteer photos"
                tabIndex={0}
                className="snap-x snap-mandatory overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--brand)] [&::-webkit-scrollbar]:hidden"
              >
                <ul className="flex items-start gap-5 pr-6 lg:pr-10">
                  {slides.map((s) => (
                    <motion.li
                      key={s.id}
                      variants={rise}
                      className="group relative aspect-[2/3] w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl bg-neutral-200 shadow-[0_24px_40px_-24px_rgba(45,45,50,0.5)] sm:w-[280px] lg:w-[300px] lg:even:mt-10"
                    >
                      <SlideImage src={s.image.src} alt={s.image.alt} />
                      {
                        s.caption && <>
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                          />
                          <p className="absolute bottom-5 left-5 right-5 flex items-center gap-2 text-sm font-semibold text-white">
                            <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]" />
                            {s.caption}
                          </p>
                        </>
                      }
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}