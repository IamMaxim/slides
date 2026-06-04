import { AnimatePresence, motion } from 'framer-motion';
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
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="build"
          initial={{ opacity: 0, y, x }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -y, x: -x }}
          transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
          className={className}
          style={style}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
