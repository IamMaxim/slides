import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack, Row } from '../ui/Layout';
import { Token } from '../ui/Token';

/**
 * Abstract diff rows: a sign and a bar width (% of the code column).
 * Deliberately not real code — the point is volume, not content.
 */
const DIFF_ROWS: { sign: '+' | '-'; w: number }[] = [
  { sign: '+', w: 72 },
  { sign: '+', w: 54 },
  { sign: '-', w: 33 },
  { sign: '+', w: 66 },
  { sign: '+', w: 41 },
  { sign: '-', w: 22 },
  { sign: '+', w: 81 },
  { sign: '+', w: 57 },
  { sign: '+', w: 29 },
  { sign: '-', w: 47 },
  { sign: '+', w: 69 },
  { sign: '+', w: 37 },
  { sign: '+', w: 76 },
  { sign: '-', w: 26 },
];

const ROW_H = 18;
/** Exactly one full copy of the rows is visible, so the wrap is seamless. */
const VIEWPORT_H = DIFF_ROWS.length * ROW_H;

function DiffRow({ sign, w }: { sign: '+' | '-'; w: number }) {
  const color = sign === '+' ? 'var(--cool)' : 'var(--warn)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, height: ROW_H, padding: '0 18px' }}>
      <span
        style={{
          fontFamily: 'var(--mono)',
          fontSize: 12,
          lineHeight: 1,
          color,
          width: 8,
          flex: '0 0 8px',
          opacity: 0.85,
        }}
      >
        {sign}
      </span>
      <span
        style={{
          height: 6,
          borderRadius: 2,
          width: `${w}%`,
          background: color,
          opacity: 0.3,
        }}
      />
    </div>
  );
}

function MRPanel({ step }: { step: number }) {
  // The rows are rendered twice; the strip scrolls up by exactly one copy and
  // snaps back — an endless, step-independent crawl of incoming diff.
  const rows = (
    <>
      {DIFF_ROWS.map((r, i) => (
        <DiffRow key={i} sign={r.sign} w={r.w} />
      ))}
    </>
  );

  return (
    <div style={{ width: '100%', maxWidth: 560, margin: '0 auto' }}>
      {/* counters — appear at step 1, but always occupy their row */}
      <Build step={step} appearAt={1} style={{ marginBottom: 14 }}>
        <Row gap={12}>
          <Token variant="accent">+8 412 строк/нед ↑</Token>
          <Token
            variant="mute"
            style={{
              color: 'var(--warn)',
              borderColor: 'var(--warn)',
              borderStyle: 'solid',
              background: 'color-mix(in srgb, var(--warn) 12%, transparent)',
            }}
          >
            velocity ↓
          </Token>
        </Row>
      </Build>

      {/* the merge request itself */}
      <div
        style={{
          position: 'relative',
          background: 'var(--bg-elev)',
          border: '1px solid var(--line)',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            padding: '11px 18px',
            borderBottom: '1px solid var(--line)',
            fontFamily: 'var(--mono)',
            fontSize: 12,
            letterSpacing: '0.04em',
          }}
        >
          <span style={{ color: 'var(--ink-soft)' }}>refactor_everything.diff</span>
          <span style={{ color: 'var(--ink-mute)' }}>+8 412 / −1 176</span>
        </div>

        <div style={{ position: 'relative', height: VIEWPORT_H, overflow: 'hidden' }}>
          <motion.div
            initial={false}
            animate={{ y: [0, -VIEWPORT_H] }}
            transition={{ duration: 16, ease: 'linear', repeat: Infinity }}
            style={{ willChange: 'transform' }}
          >
            {rows}
            {rows}
          </motion.div>

          {/* soften the cut at both edges of the viewport */}
          <div
            style={{
              position: 'absolute',
              inset: '0 0 auto 0',
              height: 24,
              background: 'linear-gradient(var(--bg-elev), transparent)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 'auto 0 0 0',
              height: 24,
              background: 'linear-gradient(transparent, var(--bg-elev))',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* step 3: the stamp */}
        <motion.div
          initial={false}
          animate={{
            opacity: step >= 3 ? 1 : 0,
            scale: step >= 3 ? 1 : 1.3,
            rotate: step >= 3 ? -6 : -13,
          }}
          transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', right: 20, bottom: 18, transformOrigin: 'center' }}
        >
          <Token
            variant="mute"
            style={{
              color: 'var(--warn)',
              borderColor: 'var(--warn)',
              borderStyle: 'solid',
              borderWidth: 1.5,
              background: 'color-mix(in srgb, var(--warn) 12%, var(--bg-elev))',
              letterSpacing: '0.06em',
            }}
          >
            review: 6 дней
          </Token>
        </motion.div>
      </div>

      {/* the stack keeps going down — and someone is under it */}
      <div
        style={{
          height: 5,
          margin: '0 14px',
          background: 'var(--bg-elev)',
          borderLeft: '1px solid var(--line)',
          borderRight: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          borderRadius: '0 0 8px 8px',
        }}
      />
      <div
        style={{
          height: 5,
          margin: '0 30px',
          background: 'var(--bg-elev)',
          borderLeft: '1px solid var(--line)',
          borderRight: '1px solid var(--line)',
          borderBottom: '1px solid var(--line)',
          borderRadius: '0 0 8px 8px',
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.svg
          viewBox="0 0 120 48"
          width={112}
          height={45}
          fill="none"
          aria-hidden
          initial={false}
          animate={{ y: step >= 2 ? 5 : 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.circle
            cx={60}
            cy={17}
            r={8.5}
            strokeWidth={1.4}
            initial={false}
            animate={{ stroke: step >= 2 ? 'var(--warn)' : 'var(--ink-mute)' }}
            transition={{ duration: 0.45 }}
          />
          <motion.path
            d="M 38 42 A 22 22 0 0 1 82 42"
            strokeWidth={1.4}
            strokeLinecap="round"
            initial={false}
            animate={{ stroke: step >= 2 ? 'var(--warn)' : 'var(--ink-mute)' }}
            transition={{ duration: 0.45 }}
          />
        </motion.svg>
      </div>
    </div>
  );
}

export const horrorSlide: Slide = {
  id: 'horror',
  title: 'mr на 700 строк',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>пролог · 2</Eyebrow>
          <SlideTitle size="md">MR на 700 строк</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Команда подключила агентов. Код пошёл рекой.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>LOC растут. Скорость команды — падает.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Ревьюер — новое бутылочное горлышко: агент пишет за минуты, человек читает часами.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Этот доклад — про то, как получить тиммейта, а не генератор шиткода.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={<MRPanel step={step} />}
    />
  ),
};
