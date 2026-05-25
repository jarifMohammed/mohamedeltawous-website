"use client";

import { useInView, useReducedMotion } from "framer-motion";
import React from "react";

type CountUpProps = {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  fromTop?: boolean;
  fromTopMultiplier?: number;
};

function formatNumber(value: number, decimals: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export default function CountUp({
  end,
  start,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  fromTop = false,
  fromTopMultiplier = 1.35,
}: CountUpProps) {
  const resolvedStart = React.useMemo(() => {
    if (typeof start === "number") return start;
    if (fromTop) return end * fromTopMultiplier;
    return 0;
  }, [start, fromTop, end, fromTopMultiplier]);

  const ref = React.useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = React.useState(resolvedStart);

  React.useEffect(() => {
    if (!isInView) return;
    if (reduceMotion) {
      setValue(end);
      return;
    }

    let frame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 2.6);
      const current = resolvedStart + (end - resolvedStart) * eased;
      setValue(current);

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, reduceMotion, resolvedStart, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatNumber(value, decimals)}
      {suffix}
    </span>
  );
}
