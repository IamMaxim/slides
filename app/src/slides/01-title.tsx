import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';

export const titleSlide: Slide = {
  id: 'title',
  title: 'cover',
  totalSteps: 1,
  render: ({ step }) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: 24,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
        }}
      >
        a field guide for engineers · 2026
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--display)',
          fontSize: 'clamp(72px, 9vw, 152px)',
          fontWeight: 300,
          lineHeight: 0.95,
          letterSpacing: '-0.035em',
          fontVariationSettings: "'opsz' 144, 'SOFT' 70, 'WONK' 1",
          color: 'var(--ink)',
          maxWidth: '14ch',
        }}
      >
        How LLMs,{' '}
        <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>agents,</span>
        <br />
        and harnesses
        <br />
        actually work.
      </motion.h1>
      <Build step={step} appearAt={0} delay={0.5}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: 'var(--ink-mute)',
            fontFamily: 'var(--mono)',
            fontSize: 13,
            marginTop: 16,
          }}
        >
          <span
            style={{
              width: 28,
              height: 1,
              background: 'var(--ink-mute)',
            }}
          />
          21 slides · use ← / → / space to navigate
        </div>
      </Build>
    </div>
  ),
};
