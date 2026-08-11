import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';

export const finalSlide: Slide = {
  id: 'final',
  title: 'вопросы',
  totalSteps: 1,
  render: ({ step }) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
        textAlign: 'center',
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
        финал · 35
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
        }}
      >
        вопросы?
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--display)',
          fontSize: 'clamp(18px, 1.8vw, 24px)',
          fontWeight: 300,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          color: 'var(--ink-soft)',
        }}
      >
        часть 1: что такое агенты и как их есть
      </motion.p>
      <Build step={step} appearAt={0} delay={0.6}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            color: 'var(--ink-mute)',
            fontFamily: 'var(--mono)',
            fontSize: 13,
            marginTop: 8,
          }}
        >
          <span style={{ width: 28, height: 1, background: 'var(--ink-mute)' }} />
          github.com/…/slides
          <span style={{ width: 28, height: 1, background: 'var(--ink-mute)' }} />
        </div>
      </Build>
    </div>
  ),
};
