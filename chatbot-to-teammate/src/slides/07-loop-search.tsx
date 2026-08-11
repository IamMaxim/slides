import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Pt = { x: number; y: number };

const W = 580;
const H = 500;

/** Two identical solution spaces. Same start, same target — the only
 *  difference between the panels is how the dot is allowed to move. */
const PANEL = 250;
const PANEL_Y = 56;
const LEFT_X = 14;
const RIGHT_X = 316;

/** Panel-local coordinates. The target sits slightly off centre so the spiral
 *  reads as homing rather than as a decorative rosette. */
const TARGET: Pt = { x: 132, y: 110 };
const SPIRAL_A0 = (130 * Math.PI) / 180;
/** Chosen so that no point of the spiral leaves the panel: the target's
 *  smallest distance to an edge is 110, this radius is 96. */
const SPIRAL_R0 = 96;
const START: Pt = {
  x: TARGET.x + SPIRAL_R0 * Math.cos(SPIRAL_A0),
  y: TARGET.y + SPIRAL_R0 * Math.sin(SPIRAL_A0),
};

/** Deterministic PRNG: the walk must be identical on every render, otherwise
 *  the keyframe arrays change identity and framer restarts the animation. */
function mulberry32(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A bounded random walk that is never allowed to stumble onto the target. */
function makeWalk(seed: number, n: number): Pt[] {
  const rnd = mulberry32(seed);
  const pad = 22;
  const pts: Pt[] = [{ ...START }];
  let x = START.x;
  let y = START.y;
  for (let i = 1; i < n; i++) {
    let nx = x;
    let ny = y;
    let ok = false;
    for (let a = 0; a < 40 && !ok; a++) {
      const ang = rnd() * Math.PI * 2;
      const len = 34 + rnd() * 46;
      nx = x + Math.cos(ang) * len;
      ny = y + Math.sin(ang) * len;
      ok =
        nx > pad &&
        nx < PANEL - pad &&
        ny > pad &&
        ny < PANEL - pad &&
        Math.hypot(nx - TARGET.x, ny - TARGET.y) > 38;
    }
    if (!ok) {
      // Guaranteed non-zero fallback step, back toward the middle.
      const dx = PANEL / 2 - x;
      const dy = PANEL / 2 - y;
      const d = Math.hypot(dx, dy);
      nx = d < 1 ? x + 40 : x + (dx / d) * 40;
      ny = d < 1 ? y : y + (dy / d) * 40;
    }
    x = nx;
    y = ny;
    pts.push({ x, y });
  }
  return pts;
}

/** Radius decays as the angle sweeps: a spiral that lands exactly on target. */
function makeSpiral(n: number, turns: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const u = i / n;
    const ang = SPIRAL_A0 + u * turns * Math.PI * 2;
    const rad = SPIRAL_R0 * Math.pow(1 - u, 1.35);
    pts.push({ x: TARGET.x + Math.cos(ang) * rad, y: TARGET.y + Math.sin(ang) * rad });
  }
  return pts;
}

function pathOf(pts: Pt[], ox: number, oy: number) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${(p.x + ox).toFixed(1)} ${(p.y + oy).toFixed(1)}`).join(' ');
}

/** Keyframe times proportional to segment length ⇒ constant travel speed. */
function timesOf(pts: Pt[]) {
  const cum: number[] = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
  }
  const total = cum[cum.length - 1] || 1;
  return cum.map((c) => c / total);
}

const WALK = makeWalk(0x5eed17, 27);
const WALK_PATH = pathOf(WALK, LEFT_X, PANEL_Y);
const WALK_X = WALK.map((p) => p.x + LEFT_X);
const WALK_Y = WALK.map((p) => p.y + PANEL_Y);
const WALK_T = timesOf(WALK);

const SPIRAL = makeSpiral(64, 2.35);
const SPIRAL_PATH = pathOf(SPIRAL, RIGHT_X, PANEL_Y);
/** The last 22% of the cycle is a hold on the target — arrival, then a pulse. */
const SPIRAL_X = [...SPIRAL.map((p) => p.x + RIGHT_X), TARGET.x + RIGHT_X];
const SPIRAL_Y = [...SPIRAL.map((p) => p.y + PANEL_Y), TARGET.y + PANEL_Y];
const SPIRAL_T = [...timesOf(SPIRAL).map((t) => t * 0.78), 1];

/* ---- the formula strip ---- */

const F_SIZE = 13;
const F_CH = F_SIZE * 0.66; // IBM Plex Mono advance + 0.06em tracking
const F_PAD = 13;
const F_H = 34;
const F_GAP = 14;
const F_Y = 372;

type FBox = { text: string; x: number; w: number; op: boolean };

const F_BOXES: FBox[] = (() => {
  const items: { text: string; op: boolean }[] = [
    { text: 'качество агента', op: false },
    { text: '=', op: true },
    { text: 'модель', op: false },
    { text: '×', op: true },
    { text: 'обратная связь', op: false },
  ];
  const widths = items.map((it) => (it.op ? 16 : it.text.length * F_CH + 2 * F_PAD));
  const total = widths.reduce((a, b) => a + b, 0) + F_GAP * (items.length - 1);
  let x = W / 2 - total / 2;
  return items.map((it, i) => {
    const box: FBox = { text: it.text, x, w: widths[i], op: it.op };
    x += widths[i] + F_GAP;
    return box;
  });
})();

const F_LAST = F_BOXES[F_BOXES.length - 1];
const F_LAST_CX = F_LAST.x + F_LAST.w / 2;

function PanelFrame({ x, opacity }: { x: number; opacity: number }) {
  return (
    <motion.rect
      x={x}
      y={PANEL_Y}
      width={PANEL}
      height={PANEL}
      rx={8}
      fill="var(--bg-elev)"
      stroke="var(--line)"
      strokeWidth="1"
      initial={false}
      animate={{ opacity }}
      transition={{ duration: 0.4 }}
    />
  );
}

/** The goal: same spot in both panels, so the comparison is about the path. */
function TargetMark({ ox }: { ox: number }) {
  const x = TARGET.x + ox;
  const y = TARGET.y + PANEL_Y;
  return (
    <g>
      <circle cx={x} cy={y} r={13} fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.45" />
      <line x1={x - 7} y1={y - 7} x2={x + 7} y2={y + 7} stroke="var(--accent)" strokeWidth="1.6" />
      <line x1={x + 7} y1={y - 7} x2={x - 7} y2={y + 7} stroke="var(--accent)" strokeWidth="1.6" />
    </g>
  );
}

function SearchDiagram({ step }: { step: number }) {
  const leftCx = LEFT_X + PANEL / 2;
  const rightCx = RIGHT_X + PANEL / 2;
  const tx = TARGET.x + RIGHT_X;
  const ty = TARGET.y + PANEL_Y;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- left: no feedback ---- */}
      <text
        x={leftCx}
        y={40}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="12"
        fill="var(--warn)"
        letterSpacing="0.08em"
      >
        без обратной связи
      </text>
      <PanelFrame x={LEFT_X} opacity={1} />
      <TargetMark ox={LEFT_X} />
      <path d={WALK_PATH} fill="none" stroke="var(--warn)" strokeWidth="1" opacity="0.22" />
      {/* ambient: the walk never stops, and it reverses instead of teleporting */}
      <motion.g
        initial={false}
        animate={{ x: WALK_X, y: WALK_Y }}
        transition={{
          duration: 17,
          times: WALK_T,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
      >
        <circle r={5.5} fill="var(--warn)" />
        <circle r={11} fill="none" stroke="var(--warn)" strokeWidth="1" opacity="0.3" />
      </motion.g>

      {/* ---- right: with tests ---- */}
      <motion.text
        x={rightCx}
        y={40}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="12"
        fill="var(--cool)"
        letterSpacing="0.08em"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        с тестами
      </motion.text>
      <PanelFrame x={RIGHT_X} opacity={step >= 1 ? 1 : 0.28} />

      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <TargetMark ox={RIGHT_X} />
        {/* the target keeps breathing: arrival is the steady state here */}
        <motion.circle
          cx={tx}
          cy={ty}
          r={13}
          fill="none"
          stroke="var(--cool)"
          strokeWidth="1.2"
          initial={false}
          animate={{ scale: [1, 2.1, 1], opacity: [0.55, 0, 0.55] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
          style={{ transformOrigin: `${tx}px ${ty}px` }}
        />
      </motion.g>

      <motion.path
        d={SPIRAL_PATH}
        fill="none"
        stroke="var(--cool)"
        strokeWidth="1.1"
        initial={false}
        animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 0.32 : 0 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />

      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <motion.g
          initial={false}
          animate={{ x: SPIRAL_X, y: SPIRAL_Y, opacity: [0, 1, 1, 1, 0] }}
          transition={{
            x: { duration: 5.6, times: SPIRAL_T, repeat: Infinity, repeatDelay: 0.4, ease: 'linear' },
            y: { duration: 5.6, times: SPIRAL_T, repeat: Infinity, repeatDelay: 0.4, ease: 'linear' },
            opacity: {
              duration: 5.6,
              times: [0, 0.05, 0.5, 0.93, 1],
              repeat: Infinity,
              repeatDelay: 0.4,
              ease: 'linear',
            },
          }}
        >
          <circle r={5.5} fill="var(--cool)" />
          <circle r={11} fill="none" stroke="var(--cool)" strokeWidth="1" opacity="0.3" />
        </motion.g>
      </motion.g>

      {/* ---- step 2: the formula the whole talk hangs on ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        {F_BOXES.map((b, i) => {
          const hot = step >= 3 && i === F_BOXES.length - 1;
          if (b.op) {
            return (
              <text
                key={i}
                x={b.x + b.w / 2}
                y={F_Y + F_H / 2 + 6}
                textAnchor="middle"
                fontFamily="var(--mono)"
                fontSize="15"
                fill="var(--ink-mute)"
              >
                {b.text}
              </text>
            );
          }
          return (
            <g key={i}>
              <motion.rect
                x={b.x}
                y={F_Y}
                width={b.w}
                height={F_H}
                rx={6}
                initial={false}
                animate={{
                  fill: hot ? 'var(--accent-soft)' : 'var(--bg-elev)',
                  stroke: hot ? 'var(--accent-line)' : 'var(--line)',
                }}
                transition={{ duration: 0.4 }}
                strokeWidth="1"
              />
              <motion.text
                x={b.x + b.w / 2}
                y={F_Y + F_H / 2 + 5}
                textAnchor="middle"
                fontFamily="var(--mono)"
                fontSize={F_SIZE}
                letterSpacing="0.06em"
                initial={false}
                animate={{ fill: hot ? 'var(--accent)' : 'var(--ink)' }}
                transition={{ duration: 0.4 }}
              >
                {b.text}
              </motion.text>
            </g>
          );
        })}
      </motion.g>

      {/* ---- step 3: whose factor it is ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -6 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <line
          x1={F_LAST_CX}
          y1={F_Y + F_H + 3}
          x2={F_LAST_CX}
          y2={F_Y + F_H + 19}
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={F_LAST_CX}
          y={F_Y + F_H + 34}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          второй множитель — твой
        </text>
      </motion.g>
    </svg>
  );
}

export const loopSearchSlide: Slide = {
  id: 'loop-search',
  title: 'генерация → поиск',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия циклов · 7</Eyebrow>
          <SlideTitle size="md">Генерация → поиск</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Без проверки агент — это случайное блуждание, которое быстро печатает.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Дай ему тесты — блуждание превращается в сходимость.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Модель ты не контролируешь. Обратную связь — полностью.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SearchDiagram step={step} />
        </div>
      }
    />
  ),
};
