import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { EraTimeline } from '../ui/EraTimeline';

export const titleSlide: Slide = {
  id: 'title',
  title: 'обложка',
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
        часть 2 · agent-driven development
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
        От чатбота
        <br />
        до тиммейта
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: 'var(--display)',
          fontSize: 'clamp(19px, 2vw, 26px)',
          fontWeight: 300,
          lineHeight: 1.3,
          letterSpacing: '-0.01em',
          color: 'var(--ink-soft)',
          maxWidth: '32ch',
        }}
      >
        инженерия циклов, графов и агентно-нативных команд
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
          <span
            style={{
              width: 28,
              height: 1,
              background: 'var(--ink-mute)',
            }}
          />
          Maxim Stepanov · 2026 · навигация ← / → / пробел
        </div>
      </Build>

      {/* the deck's map, planted on slide one: six eras, no era yet */}
      <Build
        step={step}
        appearAt={0}
        delay={0.9}
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        <div style={{ width: '100%', maxWidth: 760 }}>
          <EraTimeline revealed={6} />
        </div>
      </Build>
    </div>
  ),
};
