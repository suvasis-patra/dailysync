"use client";
import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Sparkles, CheckCircle2, Hash } from "lucide-react";

import WaitlistForm from "./waitlist";
import { EASE, LineReveal } from "@/components/reveal";

export default function HeroKinetic() {
  const ref = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const cardY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2]);

  // Mouse tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 120,
    damping: 14,
  });

  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), {
    stiffness: 120,
    damping: 14,
  });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <section
      id="top"
      ref={ref}
      className="grain relative overflow-hidden bg-[#0a0a0a] pb-28 pt-36 md:pb-40 md:pt-44"
      data-testid="hero-section"
    >
      {/* Glow accents */}
      <div className="pointer-events-none absolute -left-40 top-20 h-105 w-105 rounded-full bg-[#ccff00]/10 blur-[120px]" />
      <div className="pointer-events-none absolute right-0 top-1/2 h-95 w-95 rounded-full bg-[#3b82f6]/10 blur-[140px]" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 md:px-12 lg:grid-cols-12">
        {/* Left copy */}
        <div className="lg:col-span-7">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/4 px-3.5 py-1.5 text-xs text-neutral-300"
            data-testid="hero-badge"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-[#ccff00]" />
            Now in private beta
          </motion.div>

          <h1 className="font-display text-5xl font-semibold leading-[0.95] tracking-tighter text-white sm:text-6xl lg:text-7xl">
            <LineReveal delay={0.25}>Async standups.</LineReveal>

            <LineReveal delay={0.4} className="text-neutral-500">
              Zero friction.
            </LineReveal>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.65 }}
            className="mt-7 max-w-lg text-base leading-relaxed text-neutral-400 md:text-lg"
          >
            Daily Sync DMs your team three questions every morning, collects the
            replies, and posts one clean AI summary to your channel. No more
            chasing people for updates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
            className="mt-9"
            id="cta"
          >
            <WaitlistForm variant="dark" source="hero" testid="hero-waitlist" />

            <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
              <div className="flex -space-x-2">
                {["#ccff00", "#60a5fa", "#f472b6", "#fbbf24"].map((c) => (
                  <span
                    key={c}
                    className="h-6 w-6 rounded-full border-2 border-[#0a0a0a]"
                    style={{ background: c }}
                  />
                ))}
              </div>

              <span data-testid="hero-social-proof">
                {(count ?? 2417).toLocaleString()}+ teams on the waitlist
              </span>
            </div>
          </motion.div>
        </div>

        {/* Right product mockup */}
        <motion.div
          style={{
            y: cardY,
            opacity: cardOpacity,
            perspective: 1200,
          }}
          className="lg:col-span-5"
          onMouseMove={onMouseMove}
          onMouseLeave={() => {
            mx.set(0);
            my.set(0);
          }}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 40,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 1,
              ease: EASE,
              delay: 0.5,
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
            }}
            className="relative rounded-3xl border border-white/10 bg-[#141414] p-5 shadow-2xl"
            data-testid="hero-mockup"
          >
            {/* Channel header */}
            <div className="mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
              <Hash className="h-4 w-4 text-neutral-500" />

              <span className="text-sm font-medium text-neutral-200">
                standup
              </span>

              <span className="ml-auto flex items-center gap-1.5 rounded-full bg-[#ccff00]/10 px-2.5 py-1 text-[11px] font-medium text-[#ccff00]">
                <Sparkles className="h-3 w-3" />
                AI Summary
              </span>
            </div>

            <div className="mb-3 flex items-start gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ccff00] text-[11px] font-bold text-[#0a0a0a]">
                DS
              </span>

              <div>
                <p className="text-sm font-semibold text-white">Daily Sync</p>

                <p className="text-[11px] text-neutral-500">
                  Today, 9:00 AM · Team summary
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                {
                  label: "Shipped yesterday",
                  items: ["Checkout v2 rollout", "Fixed webhook retries"],
                },
                {
                  label: "Focus today",
                  items: ["Onboarding redesign", "SOC2 evidence"],
                },
                {
                  label: "Blockers",
                  items: ["Waiting on design QA"],
                },
              ].map((block) => (
                <div
                  key={block.label}
                  className="rounded-xl border border-white/5 bg-white/2 p-3.5"
                >
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                    {block.label}
                  </p>

                  <ul className="space-y-1.5">
                    {block.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2 text-[13px] text-neutral-300"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#ccff00]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <p className="mt-4 text-center text-[11px] text-neutral-600">
              9 of 9 members responded · generated in 4s
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
