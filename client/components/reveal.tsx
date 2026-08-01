import { ReactNode } from "react";
import { motion } from "framer-motion";

export const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

/**
 * Fade + rise reveal on scroll into view
 */
export function Reveal({
  children,
  delay = 0,
  y = 24,
  className = "",
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: EASE,
      }}
    >
      {children}
    </motion.div>
  );
}

interface LineRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

/**
 * Masked line-by-line reveal (used in hero)
 */
export function LineReveal({
  children,
  delay = 0,
  className = "",
}: LineRevealProps) {
  return (
    <span className="reveal-mask">
      <motion.span
        className={`block ${className}`}
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{
          duration: 1,
          delay,
          ease: EASE,
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}
