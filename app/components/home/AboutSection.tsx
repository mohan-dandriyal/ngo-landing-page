"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import {
    MotionConfig,
    animate,
    motion,
    useInView,
    useReducedMotion,
    type Variants,
} from "framer-motion";
import {
    Award,
    GraduationCap,
    HeartHandshake,
    ImageOff,
    Phone,
    School,
    ShieldCheck,
    Users,
    Utensils,
    type LucideIcon,
} from "lucide-react";
import data from "@/app/data/about.json";

const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { tagline, heading, description, images, badge, features, stats, contact } = data;

/* Icons that can be chosen by name from about.json */
const iconMap: Record<string, LucideIcon> = {
    utensils: Utensils,
    "graduation-cap": GraduationCap,
    "shield-check": ShieldCheck,
    school: School,
    users: Users,
    award: Award,
    "heart-handshake": HeartHandshake,
};

/* Fallback if a stat has no "icon" field in the JSON: pick by the stat's id */
const statIconById: Record<string, LucideIcon> = {
    meals: Utensils,
    schools: School,
    volunteers: Users,
    years: Award,
};

function getStatIcon(s: { id: string; icon?: string }): LucideIcon {
    return (s.icon && iconMap[s.icon]) || statIconById[s.id] || HeartHandshake;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const rise: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/* Tagline rule draws itself */
const drawLine: Variants = {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.8, ease: EASE } },
};

/* Feature rows slide in from the right */
const row: Variants = {
    hidden: { opacity: 0, x: 40 },
    show: { opacity: 1, x: 0, transition: { duration: 0.6, ease: EASE } },
};

/* Counts up once, when it scrolls into view */
function CountUp({ value }: { value: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    const reduce = useReducedMotion();
    const [n, setN] = useState(0);

    useEffect(() => {
        if (!inView || reduce) return;
        const controls = animate(0, value, {
            duration: 2,
            ease: EASE,
            onUpdate: (v) => setN(Math.round(v)),
        });
        return () => controls.stop();
    }, [inView, value, reduce]);

    const shown = reduce && inView ? value : n;
    return <span ref={ref}>{shown.toLocaleString("en-US")}</span>;
}

/* Photo that wipes in when scrolled to.
   The observed wrapper is never clipped, so the reveal can't get stuck,
   and a missing file shows a visible placeholder instead of an empty box. */
function RevealImage({
    src,
    alt,
    sizes,
    delay = 0,
    className = "",
}: {
    src: string;
    alt: string;
    sizes: string;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.15 });
    const [failed, setFailed] = useState(false);

    return (
        <div ref={ref} className={`group overflow-hidden bg-neutral-200 ${className}`}>
            {failed ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-3 text-center text-neutral-500">
                    <ImageOff className="h-8 w-8" aria-hidden="true" />
                    {process.env.NODE_ENV !== "production" && (
                        <span className="break-all text-xs">Missing file: public{src}</span>
                    )}
                </div>
            ) : (
                <motion.div
                    className="absolute inset-0"
                    initial={{ clipPath: "inset(0 0 100% 0)" }}
                    animate={{ clipPath: inView ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)" }}
                    transition={{ duration: 1, ease: EASE, delay }}
                >
                    <motion.div
                        className="absolute inset-0"
                        initial={{ scale: 1.25 }}
                        animate={{ scale: inView ? 1 : 1.25 }}
                        transition={{ duration: 1.6, ease: EASE, delay }}
                    >
                        <Image
                            src={src}
                            alt={alt}
                            fill
                            sizes={sizes}
                            onError={() => setFailed(true)}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

/* Slowly turning ring of text around a heart */
function Badge() {
    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, ease: "easeInOut", repeat: Infinity }}
            whileHover={{ scale: 1.08 }}
            className="relative h-32 w-32 rounded-full bg-[var(--brand)] shadow-[0_20px_40px_-12px_rgba(254,110,65,0.5)]"
        >
            <motion.svg
                viewBox="0 0 120 120"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 22, ease: "linear", repeat: Infinity }}
            >
                <defs>
                    <path id="about-badge-path" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0" />
                </defs>
                <text className="fill-[color:var(--ink)] text-[10px] font-bold">
                    <textPath href="#about-badge-path" textLength="280" lengthAdjust="spacing">
                        {badge.text}
                    </textPath>
                </text>
            </motion.svg>
            <span className="absolute inset-0 flex items-center justify-center">
                <motion.span
                    animate={{ scale: [1, 1.14, 1, 1.1, 1] }}
                    transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.6 }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[color:var(--brand)] shadow-sm"
                >
                    <HeartHandshake className="h-8 w-8" strokeWidth={2.25} aria-hidden="true" />
                </motion.span>
            </span>
        </motion.div>
    );
}

/* Impact counters: each card has its own icon, matched to its label */
function ImpactNumber() {
    return (
        <MotionConfig reducedMotion="user">
            <section aria-label="Our impact in numbers" className="mt-20">
                <motion.ul
                    variants={stagger}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.25 }}
                    className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-neutral-200 bg-neutral-200 shadow-[0_30px_60px_-30px_rgba(45,45,50,0.45)] lg:grid-cols-4"
                >
                    {stats.map((s) => {
                        const Icon = getStatIcon(s);
                        return (
                            <motion.li
                                key={s.id}
                                variants={rise}
                                className="group relative bg-white p-6 sm:p-8 lg:p-10"
                            >
                                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand-tint)] text-[color:var(--brand-ink)] ring-1 ring-[#fe6e41]/25 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-[var(--brand)] group-hover:text-[color:var(--ink)]">
                                    <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden="true" />
                                </span>

                                <p className="mt-6 text-[clamp(2.4rem,4.6vw,3.75rem)] font-extrabold leading-none tracking-tight">
                                    <CountUp value={s.value} />
                                    <span className="text-[color:var(--brand-ink)]">{s.suffix}</span>
                                </p>

                                {/* Short line that draws in under the number */}
                                <motion.span
                                    aria-hidden="true"
                                    variants={{
                                        hidden: { scaleX: 0 },
                                        show: { scaleX: 1, transition: { duration: 0.8, ease: EASE, delay: 0.3 } },
                                    }}
                                    className="mt-4 block h-0.5 w-12 origin-left bg-[var(--brand)] transition-[width] duration-300 group-hover:w-20"
                                />

                                <p className="mt-4 text-sm leading-snug text-neutral-600 sm:text-base">{s.label}</p>
                            </motion.li>
                        );
                    })}
                </motion.ul>
            </section>
        </MotionConfig>
    );
}

export default function AboutSection() {
    return (
        <MotionConfig reducedMotion="user">
            <section
                id="about"
                className={`${sans.className} relative scroll-mt-16 overflow-hidden bg-white py-20 text-[color:var(--ink)] lg:py-28`}
            >
                {/* Slowly drifting background glow */}
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-40 top-10 h-[28rem] w-[28rem] rounded-full bg-[var(--brand)] opacity-[0.08] blur-3xl"
                    animate={{ x: [0, -50, 0], y: [0, 40, 0], scale: [1, 1.15, 1] }}
                    transition={{ duration: 16, ease: "easeInOut", repeat: Infinity }}
                />
                <motion.div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-32 bottom-0 h-96 w-96 rounded-full bg-[var(--brand)] opacity-[0.06] blur-3xl"
                    animate={{ x: [0, 50, 0], y: [0, -40, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
                />

                <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
                    <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-20">
                        {/* Photo collage */}
                        <div className="relative isolate mx-auto w-full max-w-lg pb-14 lg:max-w-none">
                            {/* Offset colour block: grows out from the top-left corner */}
                            <motion.div
                                aria-hidden="true"
                                initial={{ opacity: 0, scale: 0.6, x: 24, y: 24 }}
                                whileInView={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.9, ease: EASE }}
                                style={{ originX: 0, originY: 0 }}
                                className="absolute -left-4 -top-4 -z-10 h-[88%] w-[80%] rounded-[2rem] bg-[var(--brand)]"
                            />

                            <RevealImage
                                src={images.main.src}
                                alt={images.main.alt}
                                sizes="(min-width: 1024px) 40vw, 80vw"
                                className="relative aspect-[4/5] w-[82%] rounded-[2rem]"
                            />

                            <RevealImage
                                src={images.secondary.src}
                                alt={images.secondary.alt}
                                sizes="(min-width: 1024px) 20vw, 40vw"
                                delay={0.35}
                                className="absolute bottom-0 right-0 aspect-square w-[48%] rounded-2xl border-8 border-white"
                            />

                            <motion.div
                                initial={{ opacity: 0, scale: 0.6, rotate: -40 }}
                                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.8 }}
                                className="absolute right-2 top-8 sm:right-6"
                            >
                                <Badge />
                            </motion.div>
                        </div>

                        {/* Copy */}
                        <motion.div
                            variants={stagger}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
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

                            <div className="mt-6 max-w-xl space-y-4 text-base leading-relaxed text-neutral-600">
                                {description.map((p, i) => (
                                    <motion.p key={i} variants={rise}>
                                        {p}
                                    </motion.p>
                                ))}
                            </div>

                            {/* Feature rows stagger in one by one */}
                            <motion.ul
                                variants={stagger}
                                className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200"
                            >
                                {features.map((f) => {
                                    const Icon = iconMap[f.icon] ?? HeartHandshake;
                                    return (
                                        <motion.li
                                            key={f.id}
                                            variants={row}
                                            whileHover={{ x: 6 }}
                                            className="group flex items-start gap-4 py-5"
                                        >
                                            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-[color:var(--brand)] transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-110">
                                                <Icon className="h-5 w-5" aria-hidden="true" />
                                            </span>
                                            <div>
                                                <h3 className="text-lg font-bold">{f.title}</h3>
                                                <p className="mt-0.5 text-sm leading-relaxed text-neutral-600">
                                                    {f.description}
                                                </p>
                                            </div>
                                        </motion.li>
                                    );
                                })}
                            </motion.ul>

                            <motion.div variants={rise} className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
                                <a
                                    href={contact.href}
                                    className="group flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
                                >
                                    {/* Phone icon rings on hover */}
                                    <motion.span
                                        whileHover={{ rotate: [0, -18, 18, -12, 12, 0] }}
                                        transition={{ duration: 0.6 }}
                                        className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-300 transition-colors group-hover:border-[color:var(--brand)] group-hover:bg-[var(--brand)]"
                                    >
                                        <Phone className="h-5 w-5" aria-hidden="true" />
                                    </motion.span>
                                    <span>
                                        <span className="block text-xs text-neutral-500">{contact.label}</span>
                                        <span className="block text-base font-bold">{contact.phone}</span>
                                    </span>
                                </a>
                            </motion.div>
                        </motion.div>
                    </div>

                    <ImpactNumber />
                </div>
            </section>
        </MotionConfig>
    );
}