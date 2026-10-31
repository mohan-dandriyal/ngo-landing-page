
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
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

const { logo, cta } = data;

const nav = data.nav.map((item) => ({
  label: item.label.trim(),
  href: item.href.trim(),
}));

const EASE = [0.22, 1, 0.36, 1] as const;

const listVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE },
  },
};

const mobileListVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const mobileItemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: EASE },
  },
};

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("/");
  const [hovered, setHovered] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const [spacerHeight, setSpacerHeight] = useState(93);

  const sectionsRef = useRef<{ href: string; el: HTMLElement }[]>([]);
  const lockedRef = useRef(false);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { scrollY, scrollYProgress } = useScroll();

  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  /* --------------------------------
     Sticky header offset
  --------------------------------- */

  const getHeaderOffset = useCallback(() => {
    return (headerRef.current?.getBoundingClientRect().height ?? 0) + 12;
  }, []);

  /* --------------------------------
     Smooth section navigation
  --------------------------------- */

  const handleNavigation = useCallback(
    (event: MouseEvent<HTMLAnchorElement>, href: string) => {
      setOpen(false);

      if (!href) return;

      const destination = new URL(href, window.location.href);

      const isSamePage =
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname;

      // Allow Next.js to handle navigation to another page.
      if (!isSamePage || !destination.hash) return;

      const id = decodeURIComponent(destination.hash.slice(1));

      if (!id) return;

      const target = document.getElementById(id);

      if (!target) return;

      // Prevent the browser's default hash jump.
      event.preventDefault();

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        getHeaderOffset();

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      // Immediately update the active navigation item.
      setActive(`#${id}`);

      // Temporarily prevent scroll spy from overriding the selected item.
      lockedRef.current = true;

      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: reduceMotion ? "auto" : "smooth",
      });

      // Update the URL without causing another navigation.
      window.history.replaceState(
        null,
        "",
        `${destination.pathname}${destination.search}${destination.hash}`
      );

      // Unlock after scrolling.
      lockTimerRef.current = setTimeout(() => {
        lockedRef.current = false;
        updateActiveRef.current?.();
      }, reduceMotion ? 50 : 1000);
    },
    [getHeaderOffset]
  );

  /* --------------------------------
     Scroll spy
  --------------------------------- */

  const updateActive = useCallback(() => {
    if (lockedRef.current) return;

    const items = sectionsRef.current;

    if (!items.length) return;

    const line = window.innerHeight * 0.35;

    const atBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;

    let found: string | null = null;

    for (const { href, el } of items) {
      const rect = el.getBoundingClientRect();

      if (rect.top <= line && rect.bottom > line) {
        found = href;
        break;
      }
    }

    if (!found && atBottom) {
      const sorted = [...items].sort(
        (a, b) =>
          a.el.getBoundingClientRect().top -
          b.el.getBoundingClientRect().top
      );

      found = sorted[sorted.length - 1]?.href ?? null;
    }

    if (found) {
      setActive(found);
    } else if (
      items.every(
        (item) => item.el.getBoundingClientRect().top > line
      )
    ) {
      setActive("/");
    }
  }, []);

  const updateActiveRef = useRef<(() => void) | null>(updateActive);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 8);
    updateActive();
  });

  /* --------------------------------
     Measure header height
  --------------------------------- */

  useEffect(() => {
    const el = headerRef.current;

    if (!el) return;

    const measure = () => {
      if (window.scrollY < 8) {
        setSpacerHeight(el.offsetHeight);
      }
    };

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(el);

    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  /* --------------------------------
     Find all navigation sections
  --------------------------------- */

  useEffect(() => {
    const collectSections = () => {
      sectionsRef.current = nav
        .filter(
          (item) =>
            item.href.startsWith("#") && item.href.length > 1
        )
        .flatMap((item) => {
          const id = decodeURIComponent(item.href.slice(1));
          const el = document.getElementById(id);

          if (!el) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(
                `Navbar: "${item.label}" links to ${item.href}, but no element has id="${id}"`
              );
            }

            return [];
          }

          return [{ href: item.href, el }];
        });

      updateActive();
    };

    collectSections();

    window.addEventListener("resize", updateActive);
    window.addEventListener("hashchange", updateActive);

    return () => {
      window.removeEventListener("resize", updateActive);
      window.removeEventListener("hashchange", updateActive);
    };
  }, [updateActive]);

  /* --------------------------------
     Cleanup scroll timer
  --------------------------------- */

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current);
      }
    };
  }, []);

  /* --------------------------------
     Close menu with Escape
  --------------------------------- */

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* --------------------------------
     Close menu on desktop resize
  --------------------------------- */

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1030px)");

    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };

    mq.addEventListener("change", onChange);

    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      {/* Fixed header spacer */}
      <div aria-hidden="true" style={{ height: spacerHeight }} />

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
            className={`mx-auto flex max-w-7xl items-center justify-between px-6 transition-[padding] duration-300 lg:px-10 ${
              scrolled ? "py-1.5" : "py-3"
            }`}
          >
            {/* Logo */}
            <Link
              href={logo.href}
              onClick={(event) =>
                handleNavigation(event, logo.href)
              }
              className="shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
            >
              <motion.div
                animate={{ scale: scrolled ? 0.85 : 1 }}
                style={{ originX: 0 }}
                whileHover={{ scale: 1.06, rotate: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 20,
                }}
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

            {/* Desktop Navigation */}
            <nav
              aria-label="Main"
              className="hidden min-[1030px]:block"
            >
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
                    <motion.li
                      key={item.label}
                      variants={itemVariants}
                    >
                      <Link
                        href={item.href}
                        aria-current={isActive ? "true" : undefined}
                        onClick={(event) =>
                          handleNavigation(event, item.href)
                        }
                        onMouseEnter={() => setHovered(item.href)}
                        onFocus={() => setHovered(item.href)}
                        onBlur={() => setHovered(null)}
                        className={`relative isolate block rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-neutral-900 ${
                          isActive
                            ? "text-neutral-950"
                            : "text-neutral-600 hover:text-neutral-950"
                        }`}
                      >
                        {hovered === item.href && (
                          <motion.span
                            layoutId="nav-hover"
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 rounded-full bg-neutral-100"
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 36,
                            }}
                          />
                        )}

                        {item.label}

                        {isActive && (
                          <motion.span
                            layoutId="nav-active"
                            aria-hidden="true"
                            className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-[#fe6e41]"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 32,
                            }}
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
              variants={{
                rest: { y: 0 },
                hover: { y: -2 },
              }}
              transition={{
                type: "spring",
                stiffness: 350,
                damping: 18,
              }}
              className="relative hidden min-[1030px]:block"
            >
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[#fe6e41]"
                animate={{
                  scale: [1, 1.3],
                  opacity: [0.45, 0],
                }}
                transition={{
                  duration: 2.2,
                  ease: "easeOut",
                  repeat: Infinity,
                }}
              />

              <Link
                href={cta.href}
                onClick={(event) =>
                  handleNavigation(event, cta.href)
                }
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#fe6e41] px-5 py-2.5 text-sm font-semibold text-neutral-950 shadow-[0_10px_24px_-10px_rgba(254,110,65,0.8)] transition-colors hover:bg-neutral-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 transition-transform duration-700 ease-out group-hover:translate-x-[700%]"
                />

                <motion.span
                  variants={{
                    rest: {
                      scale: [1, 1.18, 1, 1.12, 1],
                      transition: {
                        duration: 1.2,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 2,
                      },
                    },
                    hover: {
                      scale: [1, 1.4, 1],
                      transition: { duration: 0.5 },
                    },
                  }}
                  className="relative flex"
                >
                  <Heart className="h-4 w-4" aria-hidden="true" />
                </motion.span>

                <span className="relative">{cta.label}</span>
              </Link>
            </motion.div>

            {/* Mobile Toggle */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.9 }}
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="rounded-md p-2 text-neutral-900 focus-visible:outline-2 focus-visible:outline-neutral-900 min-[1030px]:hidden"
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
                  {open ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence initial={false}>
            {open && (
              <motion.div
                id="mobile-menu"
                key="mobile-menu"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-neutral-200 bg-white min-[1030px]:hidden"
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
                            onClick={(event) =>
                              handleNavigation(event, item.href)
                            }
                            aria-current={
                              isActive ? "true" : undefined
                            }
                            className={`flex items-center justify-between py-3 text-base font-medium ${
                              isActive
                                ? "text-neutral-950"
                                : "text-neutral-600"
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

                  {/* Mobile CTA */}
                  <motion.div variants={mobileItemVariants}>
                    <Link
                      href={cta.href}
                      onClick={(event) =>
                        handleNavigation(event, cta.href)
                      }
                      className="mt-5 flex items-center justify-center gap-2 rounded-full bg-[#fe6e41] px-5 py-3 text-sm font-semibold text-neutral-950 transition-colors hover:bg-neutral-950 hover:text-white"
                    >
                      <Heart
                        className="h-4 w-4"
                        aria-hidden="true"
                      />
                      {cta.label}
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll Progress Bar */}
          <motion.div
            aria-hidden="true"
            style={{
              scaleX: progress,
              originX: 0,
            }}
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-gradient-to-r from-[#fe6e41] via-amber-400 to-[#fe6e41]"
          />
        </motion.header>
      </MotionConfig>
    </>
  );
}
