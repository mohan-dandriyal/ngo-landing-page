
"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface PrimaryButtonProps {
  href: string;
  label: string;
  className?: string;
}

 function PrimaryButton({
  href,
  label,
  className = "",
}: PrimaryButtonProps) {
  const reduceMotion = useReducedMotion();

  // Smooth page and section navigation
  const handleNavigation = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const destination = new URL(href, window.location.href);

      const isSamePage =
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname;

      if (!isSamePage || !destination.hash) return;

      const id = decodeURIComponent(destination.hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      const header = document.querySelector("header");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        16;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: reduceMotion ? "auto" : "smooth",
      });

      // Update URL without triggering another navigation
      window.history.replaceState(
        null,
        "",
        `${destination.pathname}${destination.search}${destination.hash}`
      );
    },
    [href, reduceMotion]
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${className}`}
    >
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -3 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 18,
        }}
        className="relative inline-block"
      >
        {/* Animated halo */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[#fe6e41]"
            animate={{
              scale: [1, 1.35],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2.2,
              ease: "easeOut",
              repeat: Infinity,
            }}
          />
        )}

        {/* Button */}
        <Link
          href={href}
          onClick={handleNavigation}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#fe6e41] px-7 py-3.5 text-sm font-bold text-neutral-950 transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {/* Shine animation */}
          {!reduceMotion && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/50 transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
            />
          )}

          <span className="relative">{label}</span>

          <ArrowRight
            className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function OutLineButton({
  href,
  label,
  className = "",
}: PrimaryButtonProps) {
  const reduceMotion = useReducedMotion();

  // Smooth page and section navigation
  const handleNavigation = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const destination = new URL(href, window.location.href);

      const isSamePage =
        destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname;

      if (!isSamePage || !destination.hash) return;

      const id = decodeURIComponent(destination.hash.slice(1));
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();

      const header = document.querySelector("header");
      const headerHeight = header?.getBoundingClientRect().height ?? 0;

      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerHeight -
        16;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: reduceMotion ? "auto" : "smooth",
      });

      // Update URL without triggering another navigation
      window.history.replaceState(
        null,
        "",
        `${destination.pathname}${destination.search}${destination.hash}`
      );
    },
    [href, reduceMotion]
  );

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`${className}`}
    >
      <motion.div
        whileHover={reduceMotion ? undefined : { y: -3 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
        transition={{
          type: "spring",
          stiffness: 350,
          damping: 18,
        }}
        className="relative inline-block"
      >
        {/* Animated halo */}
        {!reduceMotion && (
          <motion.span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full bg-[#fe6e41]"
            animate={{
              scale: [1, 1.35],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 2.2,
              ease: "easeOut",
              repeat: Infinity,
            }}
          />
        )}

        {/* Button */}
        <Link
          href={href}
          onClick={handleNavigation}
          className="group relative inline-flex items-center gap-2 overflow-hidden border border-[#fe6e41] rounded-full bg-[#fe6e41] px-7 py-3.5 text-sm font-bold text-neutral-950 transition-colors duration-300 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          {/* Shine animation */}
          {!reduceMotion && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/50 transition-transform duration-700 ease-out group-hover:translate-x-[600%]"
            />
          )}

          <span className="relative">{label}</span>

          <ArrowRight
            className="relative h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </motion.div>
    </motion.div>
  );
}


export {PrimaryButton, }