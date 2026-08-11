import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const CARD_Y = 60;
const CARD_H = 340;
const CARD_W = 266;
const LEFT_X = 10;
const RIGHT_X = 302;

/** A number that only ever goes up, because nothing stops it. Same stateless
 *  ticker idiom as slide 9: a column scrolled behind a one-line window. */
const TICK_H = 34;
const LOC_VALUES = ['340', '352', '361', '374', '388', '395'];
const TICK = (() => {
  const y: number[] = [];
  const t: number[] = [];
  const n = LOC_VALUES.length;
  for (let i = 0; i < n; i++) {
    y.push(-i * TICK_H, -i * TICK_H);
    t.push(i / n, (i + 1) / n - 0.004);
  }
  y.push(-n * TICK_H);
  t.push(1);
  return { y, t };
})();

const SPARKS = [
  { x: 214, y: 150 },
  { x: 238, y: 196 },
  { x: 206, y: 232 },
];

/** The rising line everyone screenshots for the all-hands. */
const SPARKLINE = 'M 30 372 L 68 358 L 106 362 L 144 336 L 182 318 L 220 288 L 250 258';

const TRUTH = [
  { name: 'cycle time', value: '4.2 → 4.6 дня', warn: false },
  { name: 'итерации ревью на MR', value: '2.1 → 3.4', warn: false },
  { name: 'revert rate', value: '1.8% → 4.6%', warn: true },
  { name: 'escaped defects', value: '7 → 11 за квартал', warn: false },
];

function MetricsDiagram({ step }: { step: number }) {
  const stamped = step >= 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <clipPath id="s29-tick">
          <rect x={56} y={160} width={62} height={TICK_H} />
        </clipPath>
      </defs>

      {/* ================= the card everyone likes to show ================= */}
      <motion.g initial={false} animate={{ opacity: stamped ? 0.34 : 1 }} transition={{ duration: 0.55 }}>
        <rect
          x={LEFT_X}
          y={CARD_Y}
          width={CARD_W}
          height={CARD_H}
          rx={10}
          fill="var(--bg-elev)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text x={LEFT_X + 20} y={CARD_Y + 28} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.1em">
          ДАШБОРД ДЛЯ НАВЕРХ
        </text>
        <line
          x1={LEFT_X + 20}
          y1={CARD_Y + 40}
          x2={LEFT_X + CARD_W - 20}
          y2={CARD_Y + 40}
          stroke="var(--line)"
          strokeWidth="1"
        />

        <text x={30} y={144} fontFamily="var(--mono)" fontSize="12" fill="var(--ink-mute)" letterSpacing="0.08em">
          LOC
        </text>
        <text x={30} y={186} fontFamily="var(--mono)" fontSize="28" fill="var(--cool)" letterSpacing="0.02em">
          ↑
        </text>
        <g clipPath="url(#s29-tick)">
          <motion.g
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ y: TICK.y[0] }}
            animate={{ y: TICK.y }}
            transition={{ duration: 12, times: TICK.t, repeat: Infinity, ease: 'linear' }}
          >
            {[...LOC_VALUES, LOC_VALUES[0]].map((v, i) => (
              <text
                key={i}
                x={56}
                y={186 + i * TICK_H}
                fontFamily="var(--mono)"
                fontSize="28"
                fill="var(--cool)"
                letterSpacing="0.02em"
              >
                {v}
              </text>
            ))}
          </motion.g>
        </g>
        <text x={120} y={186} fontFamily="var(--mono)" fontSize="28" fill="var(--cool)" letterSpacing="0.02em">
          %
        </text>

        <text x={30} y={234} fontFamily="var(--mono)" fontSize="12" fill="var(--ink-mute)" letterSpacing="0.08em">
          PRs
        </text>
        <text x={30} y={276} fontFamily="var(--mono)" fontSize="28" fill="var(--cool)" letterSpacing="0.02em">
          ↑ 210 %
        </text>

        <path d={SPARKLINE} fill="none" stroke="var(--cool)" strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />

        {/* confetti-adjacent, and just as informative */}
        {SPARKS.map((s, i) => (
          <motion.path
            key={`${s.x}-${s.y}`}
            d={`M ${s.x} ${s.y - 5} L ${s.x + 4} ${s.y} L ${s.x} ${s.y + 5} L ${s.x - 4} ${s.y} Z`}
            fill="var(--cool)"
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ opacity: 0.15, scale: 0.7 }}
            animate={{ opacity: [0.15, 0.85, 0.15], scale: [0.7, 1.15, 0.7] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: i * 0.7, ease: 'easeInOut' }}
            style={{ transformOrigin: `${s.x}px ${s.y}px` }}
          />
        ))}
      </motion.g>

      {/* ---- step 2: what that card actually is ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: stamped ? 1 : 0, scale: stamped ? 1 : 1.35, rotate: stamped ? -14 : -22 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${LEFT_X + CARD_W / 2}px ${CARD_Y + CARD_H / 2}px` }}
      >
        <rect
          x={LEFT_X + CARD_W / 2 - 90}
          y={CARD_Y + CARD_H / 2 - 30}
          width={180}
          height={60}
          rx={6}
          fill="var(--warn-soft)"
          stroke="var(--warn)"
          strokeWidth="2"
        />
        <text
          x={LEFT_X + CARD_W / 2}
          y={CARD_Y + CARD_H / 2 + 12}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="30"
          fill="var(--warn)"
          letterSpacing="0.12em"
        >
          театр
        </text>
      </motion.g>

      {/* ================= step 1: the card nobody screenshots ================= */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0, x: step >= 1 ? 0 : 24 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={RIGHT_X}
          y={CARD_Y}
          width={CARD_W}
          height={CARD_H}
          rx={10}
          fill="var(--bg-elev)"
          stroke="var(--accent-line)"
          strokeWidth="1.2"
        />
        <text x={RIGHT_X + 20} y={CARD_Y + 28} fontFamily="var(--mono)" fontSize="10" fill="var(--accent)" letterSpacing="0.1em">
          ЧТО ПРОИСХОДИТ НА САМОМ ДЕЛЕ
        </text>
        <line
          x1={RIGHT_X + 20}
          y1={CARD_Y + 40}
          x2={RIGHT_X + CARD_W - 20}
          y2={CARD_Y + 40}
          stroke="var(--line)"
          strokeWidth="1"
        />
        {TRUTH.map((m, i) => {
          const y = 130 + i * 68;
          return (
            <g key={m.name}>
              <text
                x={RIGHT_X + 20}
                y={y}
                fontFamily="var(--mono)"
                fontSize="11"
                fill="var(--ink-mute)"
                letterSpacing="0.04em"
              >
                {m.name}
              </text>
              <text
                x={RIGHT_X + 20}
                y={y + 26}
                fontFamily="var(--mono)"
                fontSize="16"
                fill={m.warn ? 'var(--warn)' : 'var(--ink)'}
                letterSpacing="0.02em"
              >
                {m.value}
              </text>
              {i < TRUTH.length - 1 && (
                <line
                  x1={RIGHT_X + 20}
                  y1={y + 42}
                  x2={RIGHT_X + CARD_W - 20}
                  y2={y + 42}
                  stroke="var(--line-soft)"
                  strokeWidth="1"
                />
              )}
            </g>
          );
        })}
      </motion.g>

      {/* ---- step 3: the only test that matters ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 208}
          y={424}
          width={416}
          height={42}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={450}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.02em"
        >
          правая не улучшилась — значит, не ускорили
        </text>
      </motion.g>
    </svg>
  );
}

export const metricsSlide: Slide = {
  id: 'metrics',
  title: 'метрики, которые не врут',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>агентная команда · 29</Eyebrow>
          <SlideTitle size="md">Метрики, которые не врут</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Слева — дашборд, который приятно показывать наверх. LOC растут, PR-ы растут.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Справа — те, что не врут: время цикла, итерации ревью на MR, откаты, дефекты в проде.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Левая карточка растёт даже тогда, когда команда замедляется. Это театр.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Если правая карточка не улучшилась — агенты не ускорили команду. Что бы ни говорила левая.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <MetricsDiagram step={step} />
        </div>
      }
    />
  ),
};
