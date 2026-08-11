import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  step: number;
  appearAt: number;
  disappearAt?: number;
  children: ReactNode;
  y?: number;
  x?: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function Build({
  step,
  appearAt,
  disappearAt,
  children,
  y = 8,
  x = 0,
  duration = 0.4,
  delay = 0,
  className,
  style,
}: Props) {
  const visible = step >= appearAt && (disappearAt === undefined || step < disappearAt);
  // Stay mounted at all times so the element keeps reserving its layout height.
  // Hidden steps sit at opacity 0 (still in flow), then fade + slide into place.
  // This freezes the surrounding layout, so revealing a step never reflows or
  // re-centers the rest of the slide.
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      animate={visible ? { opacity: 1, y: 0, x: 0 } : { opacity: 0, y, x }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!visible}
      className={className}
      style={{ pointerEvents: visible ? undefined : 'none', ...style }}
    >
      {children}
    </motion.div>
  );
}
