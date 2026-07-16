"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { scrollToId } from "@/lib";
import { NAV_LINKS } from "@/lib/constants";
import Image from "next/image";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4"
      data-testid="navbar"
    >
      <nav
        className={`flex w-full max-w-6xl items-center justify-between rounded-full px-5 py-3 transition-all duration-300 ${
          scrolled
            ? "border border-white/10 bg-black/80 backdrop-blur-xl"
            : "border border-transparent bg-transparent"
        }`}
      >
        <button
          onClick={() => go("top")}
          data-testid="nav-logo"
          className="flex items-center gap-2 text-white"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ccff00]">
            <span className="h-2 w-2 rounded-full bg-[#0a0a0a]" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Daily Sync
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <button
              key={l.id}
              onClick={() => go(l.id)}
              data-testid={`nav-link-${l.id}`}
              className="text-sm text-neutral-300 transition-colors hover:text-white"
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="hidden md:block">
          <button
            onClick={() => go("cta")}
            data-testid="nav-cta-btn"
            className="rounded-full flex items-center gap-2 cursor-pointer bg-[#ccff00] px-5 py-2 text-sm font-semibold text-[#0a0a0a] transition-colors hover:bg-[#b3e600]"
          >
            <Image src={"slack_logo.svg"} alt="slack" height={20} width={20} />
            Get Started
          </button>
        </div>

        <button
          className="text-white md:hidden"
          onClick={() => setOpen((o) => !o)}
          data-testid="nav-menu-toggle"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute left-4 right-4 top-20 rounded-3xl border border-white/10 bg-black/95 p-6 backdrop-blur-xl md:hidden"
            data-testid="nav-mobile-menu"
          >
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => go(l.id)}
                  className="text-left text-base text-neutral-200"
                  data-testid={`nav-mobile-link-${l.id}`}
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => go("cta")}
                className="mt-2 rounded-full bg-[#ccff00] px-5 py-2.5 text-sm font-semibold text-[#0a0a0a]"
                data-testid="nav-mobile-cta"
              >
                Get early access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
