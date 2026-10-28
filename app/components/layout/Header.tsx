"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import data from "@/app/data/navbar.json";

const { logo, nav, cta } = data;

const EASE = [0.22, 1, 0.36, 1] as const;

// One orchestrated entrance: links drop in one after another
const listVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

// Mobile links slide in one by one
const mobileListVariants: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};
const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: EASE } },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("/");
  const [hovered, setHovered] = useState<string | null>(null);

  // The header is position: fixed, so this spacer keeps the page content from sliding under it
  const headerRef = useRef<HTMLElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(93);

  const { scrollY, scrollYProgress } = useScroll();

  // Smooth reading-progress bar along the bottom edge of the header
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  // The header stays visible the whole time; it only changes its look once you scroll
  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
    if (latest < 120) setActive("/");
  });

  // Measure the full-size header (only while at the top, before it tightens up)
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const measure = () => {
      if (window.scrollY < 8) setSpacerHeight(el.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Highlight the link of the section currently in view
  useEffect(() => {
    const sections = nav
      .filter((item) => item.href.startsWith("#"))
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div aria-hidden="true" style={{ height: spacerHeight }} />

      {/* reducedMotion="user" turns off movement for people who ask for less motion */}
      <MotionConfig reducedMotion="user">
        <motion.header
          ref={headerRef}
          initial={{ y: -32, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
          className={`fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-[box-shadow,border-color,background-color] duration-300 ${
            scrolled
              ? "border-neutral-200 bg-white/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]"
              : "border-transparent bg-white/95"
          }`}
        >
          <div
            // Header tightens up a little once you scroll
            className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 lg:px-10 ${
              scrolled ? "py-1.5" : "py-3"
            }`}
          >
            {/* Logo */}
            <Link
              href={logo.href}
              className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
            >
              <motion.div
                // Logo shrinks smoothly on scroll
                animate={{ scale: scrolled ? 0.85 : 1 }}
                style={{ originX: 0 }}
                whileHover={{ scale: 1.06, rotate: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={250}
                  height={130}
                  priority
                  className="h-17 w-auto"
                />
              </motion.div>
            </Link>

            {/* Desktop nav */}
            <nav aria-label="Main" className="hidden md:block">
              <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="show"
                className="flex items-center gap-1"
                onMouseLeave={() => setHovered(null)}
              >
                {nav.map((item) => {
                  const isActive = active === item.href;
                  return (
                    <motion.li key={item.label} variants={itemVariants}>
                      <Link
                        href={item.href}
                        aria-current={isActive ? "true" : undefined}
                        onMouseEnter={() => setHovered(item.href)}
                        onFocus={() => setHovered(item.href)}
                        onBlur={() => setHovered(null)}
                        className={`relative isolate block rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900 ${
                          isActive ? "text-neutral-950" : "text-neutral-600 hover:text-neutral-950"
                        }`}
                      >
                        {/* Hover pill that glides between links */}
                        {hovered === item.href && (
                          <motion.span
                            layoutId="nav-hover"
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 rounded-full bg-neutral-100"
                            transition={{ type: "spring", stiffness: 500, damping: 36 }}
                          />
                        )}

                        {item.label}

                        {/* Active underline that slides to the current section */}
                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            aria-hidden="true"
                            className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#fe6e41]"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}
              </motion.ul>
            </nav>

            {/* Desktop CTA */}
            <motion.div
              initial="rest"
              animate="rest"
              whileHover="hover"
              whileTap={{ scale: 0.96 }}
              variants={{ rest: { y: 0 }, hover: { y: -2 } }}
              transition={{ type: "spring", stiffness: 350, damping: 18 }}
              className="relative hidden md:block"
            >
              {/* Soft pulsing halo that draws the eye to the CTA */}
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[#fe6e41]"
                animate={{ scale: [1, 1.3], opacity: [0.45, 0] }}
                transition={{ duration: 2.2, ease: "easeOut", repeat: Infinity }}
              />
              <Link
                href={cta.href}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#fe6e41] px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-[0_10px_24px_-10px_rgba(254,110,65,0.8)] transition-colors hover:bg-neutral-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                {/* Shine sweep on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[700%]"
                />
                <motion.span
                  variants={{
                    // Heart beats every few seconds, and bursts on hover
                    rest: {
                      scale: [1, 1.18, 1, 1.12, 1],
                      transition: {
                        duration: 1.2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2,
                      },
                    },
                    hover: { scale: [1, 1.4, 1], transition: { duration: 0.5 } },
                  }}
                  className="relative flex"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                </motion.span>
                <span className="relative">{cta.label}</span>
              </Link>
            </motion.div>

            {/* Mobile toggle */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="rounded-md p-2 text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-900 md:hidden"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={open ? "close" : "open"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="block"
                >
                  {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile menu (scrolls inside itself if it is taller than the screen) */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="mobile-menu"
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-neutral-200 bg-white md:hidden"
              >
                <motion.div
                  variants={mobileListVariants}
                  initial="hidden"
                  animate="show"
                  className="px-6 pb-6 pt-2"
                >
                  <ul>
                    {nav.map((item) => {
                      const isActive = active === item.href;
                      return (
                        <motion.li
                          key={item.label}
                          variants={mobileItemVariants}
                          className="border-b border-neutral-100"
                        >
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={isActive ? "true" : undefined}
                            className={`flex items-center justify-between py-3 text-base font-medium ${
                              isActive ? "text-neutral-950" : "text-neutral-600"
                            }`}
                          >
                            {item.label}
                            {isActive && (
                              <motion.span
                                layoutId="mobile-active-dot"
                                aria-hidden="true"
                                className="h-2 w-2 rounded-full bg-[#fe6e41]"
                              />
                            )}
                          </Link>
                        </motion.li>
                      );
                    })}
                  </ul>

                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href={cta.href}
                      onClick={() => setOpen(false)}
                      className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#fe6e41] px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
                    >
                      <Heart className="h-4 w-4" aria-hidden="true" />
                      {cta.label}
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll progress bar (sits on the bottom edge of the header) */}
          <motion.div
            aria-hidden="true"
            style={{ scaleX: progress, originX: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#fe6e41] via-amber-400 to-[#fe6e41]"
          />
        </motion.header>
      </MotionConfig>
    </>
  );
}