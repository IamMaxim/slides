import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Pt = { x: number; y: number };

const W = 580;
const H = 500;

/** The spine the run travels down; the four blocks hang off it. */
const SPINE_X = 100;

const BLOCK_X = 150;
const BLOCK_W = 350;

const RING_C: Pt = { x: SPINE_X, y: 265 };
const RING_R = 38;

/** Where the spine meets each block. */
const TAP_Y = [73, 169, RING_C.y, 364];

const BLOCKS = [
  { y: 40, h: 66, label: 'цель', sub: 'что должно стать правдой', color: 'var(--accent)' },
  { y: 136, h: 66, label: 'ограничения', sub: 'что нельзя трогать', color: 'var(--warn)' },
  { y: 232, h: 66, label: 'цикл валидации', sub: 'пока не сойдётся', color: 'var(--ink-soft)' },
  { y: 336, h: 110, label: 'стоп-условие', sub: '', color: 'var(--cool)' },
];

const PILL_Y = 382;
const PILL_H = 40;
const PILL_CY = PILL_Y + PILL_H / 2;

const DONE_X = 180;
const DONE_W = 130;
/** The run parks here, just inside the green exit. */
const DONE_DOT_X = 200;

const BLOCKED_X = 326;
const BLOCKED_W = 150;

/** Tangential arrowhead on the validation ring — same glyph as 09 and 13. */
function RingArrow({ deg }: { deg: number }) {
  const rad = (deg * Math.PI) / 180;
  return (
    <polygon
      points="-6,-5 6,0 -6,5"
      fill="var(--ink-soft)"
      opacity="0.8"
      transform={`translate(${RING_C.x + Math.cos(rad) * RING_R} ${RING_C.y + Math.sin(rad) * RING_R}) rotate(${deg + 90})`}
    />
  );
}

/**
 * One full run of the assembled command: down the spine, twice around the
 * validation ring, out the bottom and into the green exit. Sampled at module
 * scope so the keyframe arrays are the same objects on every render.
 */
const RUN_PTS: Pt[] = (() => {
  const pts: Pt[] = [{ x: SPINE_X, y: TAP_Y[0] }];
  const seg = (x1: number, y1: number, x2: number, y2: number, n: number) => {
    for (let i = 1; i <= n; i++) pts.push({ x: x1 + ((x2 - x1) * i) / n, y: y1 + ((y2 - y1) * i) / n });
  };
  seg(SPINE_X, TAP_Y[0], SPINE_X, RING_C.y - RING_R, 12);
  const TURNS = 2.5;
  const RING_N = 140;
  for (let i = 1; i <= RING_N; i++) {
    const th = -Math.PI / 2 + (i / RING_N) * TURNS * Math.PI * 2;
    pts.push({ x: RING_C.x + Math.cos(th) * RING_R, y: RING_C.y + Math.sin(th) * RING_R });
  }
  seg(SPINE_X, RING_C.y + RING_R, SPINE_X, TAP_Y[3], 5);
  seg(SPINE_X, TAP_Y[3], SPINE_X, PILL_CY, 4);
  seg(SPINE_X, PILL_CY, DONE_DOT_X, PILL_CY, 14);
  return pts;
})();

/** Arc-length proportional times ⇒ the dot travels at one speed throughout. */
const RUN_T = (() => {
  const cum = [0];
  for (let i = 1; i < RUN_PTS.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(RUN_PTS[i].x - RUN_PTS[i - 1].x, RUN_PTS[i].y - RUN_PTS[i - 1].y));
  }
  const total = cum[cum.length - 1];
  return cum.map((c) => c / total);
})();
const RUN_X = RUN_PTS.map((p) => p.x);
const RUN_Y = RUN_PTS.map((p) => p.y);
const RUN_DURATION = 7;

/** The exit lights only once the run actually reaches it. */
const EXIT_OPACITY = [0, 0, 1, 1];
const EXIT_TIMES = [0, 0.94, 0.985, 1];

function AnatomyDiagram({ step }: { step: number }) {
  const running = step >= 4;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s15-tap" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--line)" />
        </marker>
      </defs>

      {/* ---- the spine, laid one segment per step as the pipeline assembles ---- */}
      <motion.line
        x1={SPINE_X}
        y1={TAP_Y[0]}
        x2={SPINE_X}
        y2={TAP_Y[1]}
        stroke="var(--line)"
        strokeWidth="1.4"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.line
        x1={SPINE_X}
        y1={TAP_Y[1]}
        x2={SPINE_X}
        y2={RING_C.y - RING_R}
        stroke="var(--line)"
        strokeWidth="1.4"
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />
      <motion.line
        x1={SPINE_X}
        y1={RING_C.y + RING_R}
        x2={SPINE_X}
        y2={TAP_Y[3]}
        stroke="var(--line)"
        strokeWidth="1.4"
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* ---- the validation ring sits *on* the spine: the flow goes through it ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        <circle
          cx={RING_C.x}
          cy={RING_C.y}
          r={RING_R}
          fill="none"
          stroke="var(--ink-soft)"
          strokeWidth="1.3"
          opacity="0.9"
        />
        <RingArrow deg={0} />
        <RingArrow deg={180} />
        <text
          x={RING_C.x}
          y={RING_C.y - 3}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--ink-soft)"
          letterSpacing="0.04em"
        >
          правь
        </text>
        <text
          x={RING_C.x}
          y={RING_C.y + 15}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--ink-soft)"
          letterSpacing="0.04em"
        >
          проверяй
        </text>
      </motion.g>

      {/* ambient: the ring turns on its own until the real run takes it over */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 && step < 4 ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5.6, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${RING_C.x}px ${RING_C.y}px` }}
        >
          <circle cx={RING_C.x} cy={RING_C.y - RING_R} r={5} fill="var(--accent)" />
        </motion.g>
      </motion.g>

      {/* ---- the four blocks, one per step, snapping in from the right ---- */}
      {BLOCKS.map((b, i) => (
        <motion.g
          key={b.label}
          initial={false}
          animate={{ opacity: step >= i ? 1 : 0, x: step >= i ? 0 : 44 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* the tap off the spine */}
          <line
            x1={i === 2 ? RING_C.x + RING_R : SPINE_X}
            y1={TAP_Y[i]}
            x2={BLOCK_X - 4}
            y2={TAP_Y[i]}
            stroke="var(--line)"
            strokeWidth="1.4"
            markerEnd="url(#s15-tap)"
          />
          {i !== 2 && <circle cx={SPINE_X} cy={TAP_Y[i]} r={4} fill="var(--line)" />}

          <rect
            x={BLOCK_X}
            y={b.y}
            width={BLOCK_W}
            height={b.h}
            rx={6}
            fill="var(--bg-elev)"
            stroke={b.color}
            strokeWidth="1.4"
          />
          <text
            x={BLOCK_X + 22}
            y={b.y + 28}
            fontFamily="var(--mono)"
            fontSize="15"
            fill={b.color}
            letterSpacing="0.06em"
          >
            {b.label}
          </text>
          {b.sub && (
            <text
              x={BLOCK_X + 22}
              y={b.y + 50}
              fontFamily="var(--mono)"
              fontSize="11"
              fill="var(--ink-mute)"
              letterSpacing="0.04em"
            >
              {b.sub}
            </text>
          )}
        </motion.g>
      ))}

      {/* ---- the stop condition's two honest outcomes ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, x: step >= 3 ? 0 : 44 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={DONE_X}
          y={PILL_Y}
          width={DONE_W}
          height={PILL_H}
          rx={6}
          fill="var(--bg-elev)"
          stroke="var(--cool)"
          strokeWidth="1.4"
        />
        <text
          x={DONE_X + DONE_W / 2 + 14}
          y={PILL_CY + 5}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="14"
          fill="var(--cool)"
          letterSpacing="0.06em"
        >
          готово
        </text>

        <rect
          x={BLOCKED_X}
          y={PILL_Y}
          width={BLOCKED_W}
          height={PILL_H}
          rx={6}
          fill="color-mix(in srgb, var(--warn) 12%, transparent)"
          stroke="var(--warn)"
          strokeWidth="1.2"
        />
        <text
          x={BLOCKED_X + BLOCKED_W / 2}
          y={PILL_Y + 17}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--warn)"
          letterSpacing="0.04em"
        >
          заблокирован —
        </text>
        <text
          x={BLOCKED_X + BLOCKED_W / 2}
          y={PILL_Y + 32}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--warn)"
          letterSpacing="0.04em"
        >
          зови человека
        </text>
      </motion.g>

      {/* ---- step 4: one full run of the thing we just assembled ---- */}
      <motion.rect
        x={DONE_X}
        y={PILL_Y}
        width={DONE_W}
        height={PILL_H}
        rx={6}
        fill="color-mix(in srgb, var(--cool) 20%, transparent)"
        stroke="var(--cool)"
        strokeWidth="1.6"
        // First keyframe of the running loop *is* the parked value (0), so this
        // initial is a no-op when the run is off and still lets the ambient loop
        // start when the slide is mounted straight onto the last step.
        initial={{ opacity: EXIT_OPACITY[0] }}
        animate={{ opacity: running ? EXIT_OPACITY : 0 }}
        transition={
          running
            ? { duration: RUN_DURATION, times: EXIT_TIMES, repeat: Infinity, repeatDelay: 1.4, ease: 'linear' }
            : { duration: 0.3 }
        }
      />
      <motion.g
        initial={false}
        animate={{ opacity: running ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.g
          // The run starts where it parks, so this initial is invisible off-step
          // and still gives the loop a mount animation to start from on step 4.
          initial={{ x: RUN_X[0], y: RUN_Y[0] }}
          animate={running ? { x: RUN_X, y: RUN_Y } : { x: SPINE_X, y: TAP_Y[0] }}
          transition={
            running
              ? { duration: RUN_DURATION, times: RUN_T, repeat: Infinity, repeatDelay: 1.4, ease: 'linear' }
              : { duration: 0.3 }
          }
        >
          <circle r={6} fill="var(--accent)" />
          <circle r={12} fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
        </motion.g>
      </motion.g>
    </svg>
  );
}

export const goalAnatomySlide: Slide = {
  id: 'goal-anatomy',
  title: 'анатомия goal-команды',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>process engineering · 15</Eyebrow>
          <SlideTitle size="md">Анатомия goal-команды</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Цель — что должно стать правдой после запуска.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Ограничения — что нельзя трогать по дороге.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Цикл валидации — правь и проверяй, пока не сойдётся.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Стоп-условие — зелёный выход или честное „заблокирован, зови человека“.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Запустил — и агент работает до „готово“ или до честного „не могу“. Это уже не
                  подсказка. Это делегирование.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <AnatomyDiagram step={step} />
        </div>
      }
    />
  ),
};
