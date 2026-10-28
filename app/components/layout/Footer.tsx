"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import { MotionConfig, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ArrowUp,
  Heart,
  Mail,
  MapPin,
  Phone,
  type LucideIcon,
} from "lucide-react";
import data from "@/app/data/footer.json";
import contactData from "@/app/data/contact.json";

const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { brand, cta, columns, contactTitle, socials, legal } = data;

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};
const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

/* Contact rows come from contact.json so the numbers are only written once */
const contactIcons: Record<string, LucideIcon> = {
  address: MapPin,
  phone: Phone,
  email: Mail,
};
const contactRows = contactData.details.filter((d) => d.id in contactIcons);

/* Small inline social icons (brand icons were removed from newer lucide versions) */
const socialIcons: Record<string, ReactNode> = {
  facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
    </>
  ),
  youtube: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ),
};

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block text-base text-neutral-600 transition-all duration-200 hover:translate-x-1 hover:text-[color:var(--brand-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  const reduce = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <footer className={`${sans.className} text-[color:var(--ink)]`}>
        {/* Call-to-action band: top half sits on the dark Contact section, bottom half on the light footer */}
        <div className="bg-[linear-gradient(to_bottom,var(--ink)_50%,#fafafa_50%)]">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              className="relative overflow-hidden rounded-[2rem] bg-[var(--brand)] p-8 sm:p-12 lg:p-14"
            >
              <Heart
                aria-hidden="true"
                strokeWidth={1.25}
                className="pointer-events-none absolute -bottom-12 -right-8 h-64 w-64 -rotate-12 text-white/25 sm:h-80 sm:w-80"
              />

              <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_auto] lg:gap-14">
                <div>
                  <h2>
                    <motion.span
                      variants={rise}
                      className={`${serif.className} block text-[clamp(1.6rem,3.2vw,2.6rem)] leading-[1.1]`}
                    >
                      {cta.heading.light}
                    </motion.span>
                    <motion.span
                      variants={rise}
                      className="mt-1 block text-[clamp(2.1rem,4.6vw,3.8rem)] font-extrabold leading-[0.98] tracking-tight"
                    >
                      {cta.heading.bold}
                    </motion.span>
                  </h2>
                  <motion.p variants={rise} className="mt-4 max-w-lg text-base leading-relaxed">
                    {cta.description}
                  </motion.p>
                </div>

                <motion.div variants={rise} className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                  <Link
                    href={cta.primary.href}
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-white hover:text-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
                  >
                    {cta.primary.label}
                    <ArrowRight
                      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Main footer */}
        <div className="bg-neutral-50 pb-8 pt-16 lg:pt-20">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.15 }}
              className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1.4fr] lg:gap-10"
            >
              {/* Brand */}
              <motion.div variants={rise} className="sm:col-span-2 lg:col-span-1">
                <Link
                  href={brand.logo.href}
                  className="inline-block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
                >
                  <Image
                    src={brand.logo.src}
                    alt={brand.logo.alt}
                    width={200}
                    height={130}
                    className="h-20 w-auto"
                  />
                </Link>
                <p className="mt-5 max-w-sm text-base leading-relaxed text-neutral-600">
                  {brand.description}
                </p>

                <ul className="mt-6 flex gap-3">
                  {socials.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.name}
                        className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-300 text-[color:var(--ink)] transition-colors duration-200 hover:border-[color:var(--brand)] hover:bg-[var(--brand)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--ink)]"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-[18px] w-[18px]"
                          aria-hidden="true"
                        >
                          {socialIcons[s.icon]}
                        </svg>
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Link columns */}
              {columns.map((col) => (
                <motion.nav key={col.id} variants={rise} aria-label={col.title}>
                  <h3 className="text-lg font-bold">{col.title}</h3>
                  <ul className="mt-5 space-y-3">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <FooterLink href={l.href}>{l.label}</FooterLink>
                      </li>
                    ))}
                  </ul>
                </motion.nav>
              ))}

              {/* Contact */}
              <motion.div variants={rise}>
                <h3 className="text-lg font-bold">{contactTitle}</h3>
                <ul className="mt-5 space-y-4">
                  {contactRows.map((d) => {
                    const Icon = contactIcons[d.id];
                    const isLink = d.href && !d.hrefLabel;
                    return (
                      <li key={d.id} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-tint)] text-[color:var(--brand-ink)]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        {isLink ? (
                          <a
                            href={d.href}
                            className="pt-1.5 text-base text-neutral-600 transition-colors hover:text-[color:var(--brand-ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
                          >
                            {d.value}
                          </a>
                        ) : (
                          <span className="pt-1.5 text-base text-neutral-600">{d.value}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            </motion.div>

            {/* Bottom bar */}
            <div className="mt-14 flex flex-col gap-5 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-neutral-600">
                &copy; {legal.year} {legal.name}. All rights reserved.
              </p>

              <div className="flex items-center gap-6">

                <motion.button
                  type="button"
                  onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}
                  aria-label="Back to top"
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--ink)] text-white transition-colors hover:bg-[var(--brand)] hover:text-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
                >
                  <ArrowUp className="h-5 w-5" aria-hidden="true" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </MotionConfig>
  );
}