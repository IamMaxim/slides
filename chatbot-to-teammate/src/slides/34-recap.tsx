import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Eyebrow, SlideTitle } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

/** One engineering principle per era, in the order the talk earned them.
 *  Read together with the era label above it, each chip is one sentence:
 *  «чатбот → человек-harness», «автокомплит → один выстрел без проверки», … */
const PRINCIPLES = [
  'человек-harness',
  'один выстрел без проверки',
  'генерация = поиск',
  'среда в цикле, рельсы',
  'промпт стал артефактом',
  'независимое суждение, детерминизм где можно',
];

/** The last era; the glyph parks here and stays for the takeaway. */
const LAST_ERA = PRINCIPLES.length - 1;

/** The timeline is the deck's spine — on the closing slide it gets the full
 *  stage. Base width stays modest so the scaled result (≈1050px) still clears
 *  the stage padding at 1280×720; the wrapper scales the whole block, so the
 *  chips keep their column alignment with the era dots for free. */
const TL_W = 940;
const TL_SCALE = 1.18;
/** Chip box width inside a 156px column: the rest is the gap that keeps six
 *  chips reading as six stamps instead of one bar. */
const CHIP_W = 124;
/** transform: scale() does not grow the layout box — this pays back the overflow. */
const TL_GROWTH = 26;

const CONNECTOR_H = 26;

function EraChip({ text, state }: { text: string; state: 'hidden' | 'current' | 'settled' }) {
  const on = state !== 'hidden';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
      {/* the tick that drops from the era dot onto its principle */}
      <div style={{ position: 'relative', height: CONNECTOR_H, width: 1 }}>
        <motion.div
          initial={false}
          animate={{ scaleY: on ? 1 : 0, opacity: on ? 1 : 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'var(--line)',
            transformOrigin: 'top center',
          }}
        />
      </div>

      {/* the principle, stamped */}
      <motion.div
        initial={false}
        animate={{
          opacity: on ? 1 : 0,
          scale: on ? 1 : 1.18,
          y: on ? 0 : -6,
          borderColor: state === 'current' ? 'var(--accent-line)' : 'var(--line)',
          backgroundColor: state === 'current' ? 'var(--accent-soft)' : 'var(--bg-elev)',
        }}
        transition={{ duration: 0.42, ease: [0.34, 1.45, 0.64, 1] }}
        style={{
          width: '100%',
          maxWidth: CHIP_W,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '10px 11px',
          borderRadius: 8,
          borderWidth: 1,
          borderStyle: 'solid',
          fontFamily: 'var(--mono)',
          fontSize: 11.5,
          lineHeight: 1.45,
          letterSpacing: '0.02em',
          color: 'var(--ink)',
          textAlign: 'center',
        }}
      >
        <div>
          <span style={{ color: 'var(--accent)' }}>→ </span>
          {text}
        </div>
      </motion.div>
    </div>
  );
}

export const recapSlide: Slide = {
  id: 'recap',
  title: 'вся дуга',
  totalSteps: 7,
  render: ({ step }) => {
    const era = Math.min(step, LAST_ERA);
    const takeaway = step >= LAST_ERA + 1;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Stack gap={0} align="center" style={{ textAlign: 'center' }}>
          <Eyebrow>финал · 34</Eyebrow>
          <SlideTitle size="sm" align="center">
            Вся дуга
          </SlideTitle>
        </Stack>

        {/* ---- the spine, replaying its migration, with a principle per stop ---- */}
        <motion.div
          initial={false}
          animate={{ opacity: takeaway ? 0.42 : 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            marginTop: 34,
            marginBottom: TL_GROWTH,
            width: TL_W,
            transform: `scale(${TL_SCALE})`,
            transformOrigin: 'top center',
          }}
        >
          <EraTimeline current={era} revealed={PRINCIPLES.length} />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${PRINCIPLES.length}, 1fr)`,
              alignItems: 'stretch',
            }}
          >
            {PRINCIPLES.map((p, i) => (
              <EraChip
                key={p}
                text={p}
                state={step < i ? 'hidden' : step === i ? 'current' : 'settled'}
              />
            ))}
          </div>
        </motion.div>

        {/* ---- the last thing anyone reads. Its room is reserved from step 0,
                so arriving at it never moves the timeline. ---- */}
        <div
          style={{
            marginTop: 40,
            height: 116,
            width: '100%',
            maxWidth: 900,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: 22,
          }}
        >
          <motion.div
            initial={false}
            animate={{ opacity: takeaway ? 1 : 0, width: takeaway ? 72 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: 1, background: 'var(--accent)' }}
          />
          <motion.p
            initial={false}
            animate={{ opacity: takeaway ? 1 : 0, y: takeaway ? 0 : 12 }}
            transition={{ duration: 0.6, delay: takeaway ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
            style={{
              fontFamily: 'var(--display)',
              fontWeight: 300,
              fontSize: 'clamp(21px, 2.3vw, 33px)',
              lineHeight: 1.3,
              letterSpacing: '-0.015em',
              color: 'var(--ink-soft)',
              textAlign: 'center',
              margin: 0,
            }}
          >
            Скорость даёт не модель.{' '}
            <span style={{ color: 'var(--ink)' }}>
              Скорость даёт{' '}
              <span style={{ color: 'var(--accent)' }}>цикл обратной связи</span>, который ты
              построил вокруг неё.
            </span>
          </motion.p>
        </div>
      </div>
    );
  },
};
