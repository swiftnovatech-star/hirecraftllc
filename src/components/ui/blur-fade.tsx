"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function BlurFade({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={
        reducedMotion
          ? undefined
          : {
              opacity: [0.7, 1],
              y: [12, 0],
              filter: ["blur(3px)", "blur(0px)"],
            }
      }
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
