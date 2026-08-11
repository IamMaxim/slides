import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { Slide } from './types';
import { Stage } from './Stage';
import { Caption } from './Caption';
import { StepHint } from './StepHint';
import { ProgressBar } from './ProgressBar';

type Props = {
  slides: Slide[];
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function readHash(slides: Slide[]) {
  const m = /#?(\d+)\/(\d+)/.exec(window.location.hash);
  if (!m) return { slideIndex: 0, stepIndex: 0 };
  const slideIndex = clamp(parseInt(m[1], 10), 0, slides.length - 1);
  const stepIndex = clamp(parseInt(m[2], 10), 0, slides[slideIndex].totalSteps - 1);
  return { slideIndex, stepIndex };
}

export function Deck({ slides }: Props) {
  const [slideIndex, setSlideIndex] = useState(() => readHash(slides).slideIndex);
  const [stepIndex, setStepIndex] = useState(() => readHash(slides).stepIndex);

  useEffect(() => {
    const onHash = () => {
      const next = readHash(slides);
      setSlideIndex(next.slideIndex);
      setStepIndex(next.stepIndex);
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, [slides]);

  // write hash on change
  useEffect(() => {
    const desired = `#${slideIndex}/${stepIndex}`;
    if (window.location.hash !== desired) {
      window.history.replaceState(null, '', desired);
    }
  }, [slideIndex, stepIndex]);

  const slide = slides[slideIndex];

  const advance = useCallback(
    (dir: 1 | -1) => {
      const current = slides[slideIndex];
      if (dir === 1) {
        if (stepIndex < current.totalSteps - 1) {
          setStepIndex((s) => s + 1);
        } else if (slideIndex < slides.length - 1) {
          setSlideIndex((s) => s + 1);
          setStepIndex(0);
        }
      } else {
        if (stepIndex > 0) {
          setStepIndex((s) => s - 1);
        } else if (slideIndex > 0) {
          const prev = slides[slideIndex - 1];
          setSlideIndex((s) => s - 1);
          setStepIndex(prev.totalSteps - 1);
        }
      }
    },
    [slideIndex, stepIndex, slides]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        advance(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        advance(-1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setSlideIndex(0);
        setStepIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setSlideIndex(slides.length - 1);
        setStepIndex(slides[slides.length - 1].totalSteps - 1);
      } else if (/^[0-9]$/.test(e.key)) {
        const idx = parseInt(e.key, 10);
        if (idx < slides.length) {
          setSlideIndex(idx);
          setStepIndex(0);
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [advance, slides]);

  const rendered = useMemo(
    () => slide.render({ step: stepIndex }),
    [slide, stepIndex]
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <Caption index={slideIndex} total={slides.length} title={slide.title} />
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <Stage>{rendered}</Stage>
        </motion.div>
      </AnimatePresence>
      <StepHint step={stepIndex} total={slide.totalSteps} />
      <ProgressBar index={slideIndex} total={slides.length} />
    </div>
  );
}
