"use client";

import * as React from "react";
import { useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { motion } from "framer-motion";

type Props = {
  to: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
};

export function CountUp({
  to,
  decimals = 0,
  suffix = "",
  prefix = "",
  duration = 1.2,
}: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });

  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) =>
    decimals === 0 ? Math.round(v).toString() : v.toFixed(decimals),
  );

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(value, to, { duration, ease: "easeOut" });
    return () => controls.stop();
  }, [inView, to, duration, value]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}
