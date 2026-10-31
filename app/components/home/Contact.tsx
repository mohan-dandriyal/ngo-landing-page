"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Fraunces, Bricolage_Grotesque } from "next/font/google";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  type Variants,
} from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Clock,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Send,
  type LucideIcon,
} from "lucide-react";
import data from "@/app/data/contact.json";

const serif = Fraunces({ subsets: ["latin"], style: ["italic"], weight: ["300"] });
const sans = Bricolage_Grotesque({ subsets: ["latin"], weight: ["400", "500", "700", "800"] });

const { tagline, heading, intro, details, form } = data;

const iconMap: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  phone: Phone,
  mail: Mail,
  clock: Clock,
};

const EASE = [0.22, 1, 0.36, 1] as const;

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type Errors = Partial<Record<"name" | "email" | "message", string>>;
type Status = "idle" | "sending" | "success" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3.5 text-base text-[color:var(--ink)] placeholder:text-neutral-500 transition-colors focus:outline-none focus:ring-4 focus:ring-[rgba(254,110,65,0.22)]";
const inputOk = "border-neutral-300 focus:border-[color:var(--brand)]";
const inputBad = "border-red-500 focus:border-red-500";

function Field({
  id,
  label,
  required,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
        {required && <span className="text-[color:var(--brand-ink)]"> *</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const values = Object.fromEntries(fd.entries()) as Record<string, string>;

    const next: Errors = {};
    if (!values.name?.trim()) next.name = "Please enter your name.";
    if (!EMAIL_RE.test(values.email?.trim() ?? "")) next.email = "Please enter a valid email address.";
    if ((values.message?.trim().length ?? 0) < 10) next.message = "Please write at least 10 characters.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <section
        id="contact"
        className={`${sans.className} relative scroll-mt-16 overflow-hidden bg-[var(--ink)] py-16 text-white lg:py-18`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid items-start gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            {/* Left: copy + details */}
            <motion.div
              variants={stagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              <motion.div variants={rise} className="flex items-center gap-4">
                <span aria-hidden="true" className="h-px w-12 bg-[var(--brand)]" />
                <p className="text-lg font-semibold text-[color:var(--brand)]">{tagline}</p>
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

              <motion.p variants={rise} className="mt-6 max-w-md text-base leading-relaxed text-white/70">
                {intro}
              </motion.p>

              <motion.ul variants={rise} className="mt-10 divide-y divide-white/10 border-y border-white/10">
                {details.map((d) => {
                  const Icon = iconMap[d.icon] ?? MapPin;
                  const isExternal = d.href?.startsWith("http");
                  return (
                    <li key={d.id} className="group flex items-start gap-5 py-5">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-[color:var(--brand)] transition-colors duration-300 group-hover:bg-[var(--brand)] group-hover:text-[color:var(--ink)]">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm text-white/60">{d.label}</p>
                        {d.href && !d.hrefLabel ? (
                          <a
                            href={d.href}
                            className="text-lg font-semibold underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                          >
                            {d.value}
                          </a>
                        ) : (
                          <p className="text-lg font-semibold">{d.value}</p>
                        )}
                        {d.href && d.hrefLabel && (
                          <a
                            href={d.href}
                            target={isExternal ? "_blank" : undefined}
                            rel={isExternal ? "noopener noreferrer" : undefined}
                            className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-[color:var(--brand)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
                          >
                            {d.hrefLabel}
                            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </li>
                  );
                })}
              </motion.ul>
            </motion.div>

            {/* Right: form card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
              className="rounded-[2rem] bg-white p-6 text-[color:var(--ink)] shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] sm:p-10"
            >
              <AnimatePresence mode="wait" initial={false}>
                {status === "success" ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    role="status"
                    className="flex min-h-[420px] flex-col items-center justify-center text-center"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.15 }}
                      className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--brand)] text-[color:var(--ink)]"
                    >
                      <Check className="h-10 w-10" strokeWidth={3} aria-hidden="true" />
                    </motion.span>
                    <h3 className="mt-6 text-2xl font-extrabold">{form.successTitle}</h3>
                    <p className="mt-2 max-w-xs text-neutral-600">{form.successMessage}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setStatus("idle");
                        setErrors({});
                      }}
                      className="mt-8 rounded-full border border-neutral-300 px-6 py-3 text-sm font-bold transition-colors hover:border-[color:var(--ink)] hover:bg-[var(--ink)] hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)]"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={onSubmit}
                    noValidate
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-2xl font-extrabold sm:text-3xl">{form.title}</h3>
                    <p className="mt-1 text-sm text-neutral-600">{form.description}</p>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                      <Field id="contact-name" label="Full name" required error={errors.name}>
                        <input
                          id="contact-name"
                          name="name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          aria-invalid={!!errors.name}
                          aria-describedby={errors.name ? "contact-name-error" : undefined}
                          className={`${inputBase} ${errors.name ? inputBad : inputOk}`}
                        />
                      </Field>

                      <Field id="contact-email" label="Email" required error={errors.email}>
                        <input
                          id="contact-email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          aria-invalid={!!errors.email}
                          aria-describedby={errors.email ? "contact-email-error" : undefined}
                          className={`${inputBase} ${errors.email ? inputBad : inputOk}`}
                        />
                      </Field>

                      <Field id="contact-phone" label="Phone">
                        <input
                          id="contact-phone"
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="Optional"
                          className={`${inputBase} ${inputOk}`}
                        />
                      </Field>

                      <Field id="contact-subject" label="What is this about?">
                        <div className="relative">
                          <select
                            id="contact-subject"
                            name="subject"
                            defaultValue={form.subjects[0]}
                            className={`${inputBase} ${inputOk} appearance-none pr-11`}
                          >
                            {form.subjects.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-500"
                            aria-hidden="true"
                          />
                        </div>
                      </Field>

                      <Field
                        id="contact-message"
                        label="Message"
                        required
                        error={errors.message}
                        className="sm:col-span-2"
                      >
                        <textarea
                          id="contact-message"
                          name="message"
                          rows={5}
                          placeholder="How can we help?"
                          aria-invalid={!!errors.message}
                          aria-describedby={errors.message ? "contact-message-error" : undefined}
                          className={`${inputBase} ${errors.message ? inputBad : inputOk} resize-y`}
                        />
                      </Field>
                    </div>

                    {/* Honeypot: hidden from people, bots fill it in */}
                    <div className="absolute -left-[9999px]" aria-hidden="true">
                      <label htmlFor="contact-website">Website</label>
                      <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                    </div>

                    <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                      <button
                        type="submit"
                        disabled={status === "sending"}
                        className="group inline-flex items-center justify-center gap-2 rounded-full bg-[var(--brand)] px-8 py-4 text-sm font-bold text-[color:var(--ink)] transition-colors hover:bg-[var(--brand-soft)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--ink)] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {status === "sending" ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                            Sending...
                          </>
                        ) : (
                          <>
                            {form.submitLabel}
                            <Send
                              className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                              aria-hidden="true"
                            />
                          </>
                        )}
                      </button>

                      <p role="alert" className="min-h-5 text-sm text-red-600">
                        {status === "error" && "Something went wrong. Please try again or email us directly."}
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}