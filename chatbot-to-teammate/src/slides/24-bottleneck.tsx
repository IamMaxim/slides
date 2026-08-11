import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

/** The pipe runs left to right on one axis; only its *height* is throughput. */
const CY = 176;

const X0 = 30;
const A1 = 180;
const B0 = 212;
const B1 = 368;
const C0 = 400;
const X1 = 550;

const H_BASE = 44;
/** Agents widened exactly one section of the pipe. */
const H_WIDE = 96;

type Sec = 'A' | 'B' | 'C';

/** Five segments per edge: write, taper, review, taper, merge. */
const SEGMENTS: { x1: number; x2: number; a: Sec; b: Sec }[] = [
  { x1: X0, x2: A1, a: 'A', b: 'A' },
  { x1: A1, x2: B0, a: 'A', b: 'B' },
  { x1: B0, x2: B1, a: 'B', b: 'B' },
  { x1: B1, x2: C0, a: 'B', b: 'C' },
  { x1: C0, x2: X1, a: 'C', b: 'C' },
];

const LABEL_Y = 300;
const SUB_Y = 320;

/** The queue backs up *from* the constriction: densest against the wall. */
const PILE = (() => {
  const pts: { x: number; y: number }[] = [];
  const cols = [122, 146, 170, 194];
  const counts = [3, 4, 5, 6];
  cols.forEach((x, i) => {
    const n = counts[i];
    for (let k = 0; k < n; k++) pts.push({ x, y: CY - ((n - 1) * 16) / 2 + k * 16 });
  });
  return pts;
})();

/** Ambient flow: dots enter, cross, leave. Keyframes live at module scope so a
 *  step change never restarts them. */
const FLOW_OPACITY = [0, 0.9, 0.9, 0];
const FLOW_TIMES = [0, 0.08, 0.9, 1];
const EVEN_LANES = [-26, -9, 8, 25];
/** Once the write section balloons, the inflow spreads over its full height. */
const WIDE_LANES = [-66, -33, 0, 33, 66];

function PipeDiagram({ step }: { step: number }) {
  const wide = step >= 1;
  const h: Record<Sec, number> = { A: wide ? H_WIDE : H_BASE, B: H_BASE, C: H_BASE };
  const edge = { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] };

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- the review section, tinted the moment it becomes the constraint ---- */}
      <motion.rect
        x={B0}
        y={CY - H_BASE}
        width={B1 - B0}
        height={H_BASE * 2}
        fill="var(--warn-soft)"
        initial={false}
        animate={{ opacity: wide ? 1 : 0 }}
        transition={{ duration: 0.5 }}
      />

      {/* ---- the pipe walls ---- */}
      {[-1, 1].map((sign) =>
        SEGMENTS.map((s, i) => (
          <motion.line
            key={`${sign}-${i}`}
            x1={s.x1}
            x2={s.x2}
            stroke="var(--ink-soft)"
            strokeWidth="1.4"
            opacity="0.85"
            initial={false}
            animate={{ y1: CY + sign * h[s.a], y2: CY + sign * h[s.b] }}
            transition={edge}
          />
        ))
      )}
      <motion.line
        x1={X0}
        x2={X0}
        stroke="var(--ink-soft)"
        strokeWidth="1.4"
        opacity="0.5"
        initial={false}
        animate={{ y1: CY - h.A, y2: CY + h.A }}
        transition={edge}
      />
      <line x1={X1} y1={CY - H_BASE} x2={X1} y2={CY + H_BASE} stroke="var(--ink-soft)" strokeWidth="1.4" opacity="0.5" />

      {/* ---- steady flow: one river, one speed ---- */}
      <motion.g initial={false} animate={{ opacity: step === 0 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        {EVEN_LANES.map((lane, i) => (
          <motion.g
            key={lane}
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ x: X0 + 8, opacity: FLOW_OPACITY[0] }}
            animate={{ x: [X0 + 8, X1 - 8], opacity: FLOW_OPACITY }}
            transition={{
              x: { duration: 4.4, repeat: Infinity, delay: i * 0.55, ease: 'linear' },
              opacity: {
                duration: 4.4,
                times: FLOW_TIMES,
                repeat: Infinity,
                delay: i * 0.55,
                ease: 'linear',
              },
            }}
          >
            <circle cy={CY + lane} r={5} fill="var(--ink-soft)" />
          </motion.g>
        ))}
      </motion.g>

      {/* ---- step 1: a torrent in, a trickle out ---- */}
      <motion.g initial={false} animate={{ opacity: wide ? 1 : 0 }} transition={{ duration: 0.4 }}>
        {WIDE_LANES.map((lane, i) => (
          <motion.g
            key={lane}
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ x: X0 + 8, opacity: FLOW_OPACITY[0] }}
            animate={{ x: [X0 + 8, 112], opacity: FLOW_OPACITY }}
            transition={{
              x: { duration: 1.5, repeat: Infinity, delay: i * 0.22, ease: 'linear' },
              opacity: {
                duration: 1.5,
                times: FLOW_TIMES,
                repeat: Infinity,
                delay: i * 0.22,
                ease: 'linear',
              },
            }}
          >
            <circle cy={CY + lane} r={5} fill="var(--accent)" />
          </motion.g>
        ))}

        {/* the queue itself */}
        {PILE.map((p, i) => (
          <motion.circle
            key={`${p.x}-${p.y}`}
            cx={p.x}
            cy={p.y}
            r={6}
            fill="var(--warn)"
            opacity="0.72"
            initial={false}
            animate={{ scale: wide ? 1 : 0 }}
            transition={{ duration: 0.35, delay: wide ? 0.15 + i * 0.03 : 0, ease: [0.34, 1.4, 0.64, 1] }}
            style={{ transformOrigin: `${p.x}px ${p.y}px` }}
          />
        ))}

        {/* and what actually gets through */}
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ x: B0, opacity: FLOW_OPACITY[0] }}
          animate={{ x: [B0, X1 - 8], opacity: FLOW_OPACITY }}
          transition={{
            x: { duration: 6.5, repeat: Infinity, repeatDelay: 2.4, ease: 'linear' },
            opacity: {
              duration: 6.5,
              times: FLOW_TIMES,
              repeat: Infinity,
              repeatDelay: 2.4,
              ease: 'linear',
            },
          }}
        >
          <circle cy={CY} r={5} fill="var(--ink-soft)" />
        </motion.g>
      </motion.g>

      {/* ---- the callback: this is the MR from slide 2 ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: wide ? 1 : 0, y: wide ? 0 : -8 }}
        transition={{ duration: 0.45, delay: wide ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <line x1={302} y1={84} x2={198} y2={136} stroke="var(--warn)" strokeWidth="1" strokeDasharray="3 4" opacity="0.7" />
        <rect
          x={300}
          y={52}
          width={230}
          height={32}
          rx={5}
          fill="color-mix(in srgb, var(--warn) 12%, var(--bg-elev))"
          stroke="var(--warn)"
          strokeWidth="1.2"
        />
        <text
          x={415}
          y={73}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--warn)"
          letterSpacing="0.04em"
        >
          тот самый MR на 700 строк
        </text>
      </motion.g>

      {/* ---- section labels ---- */}
      <motion.text
        x={(X0 + A1) / 2}
        y={LABEL_Y}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="14"
        letterSpacing="0.06em"
        initial={false}
        animate={{ fill: wide ? 'var(--accent)' : 'var(--ink)' }}
        transition={{ duration: 0.45 }}
      >
        написать
      </motion.text>
      <motion.text
        x={(B0 + B1) / 2}
        y={LABEL_Y}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="14"
        letterSpacing="0.06em"
        initial={false}
        animate={{ fill: wide ? 'var(--warn)' : 'var(--ink)' }}
        transition={{ duration: 0.45 }}
      >
        отревьюить
      </motion.text>
      <text
        x={(C0 + X1) / 2}
        y={LABEL_Y}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="14"
        fill="var(--ink)"
        letterSpacing="0.06em"
      >
        смержить
      </text>

      <motion.text
        x={(X0 + A1) / 2}
        y={SUB_Y}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--accent)"
        letterSpacing="0.04em"
        initial={false}
        animate={{ opacity: wide ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      >
        ×5 быстрее
      </motion.text>
      <motion.text
        x={(B0 + B1) / 2}
        y={SUB_Y}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--warn)"
        letterSpacing="0.04em"
        initial={false}
        animate={{ opacity: wide ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      >
        ровно столько же
      </motion.text>

      {/* ---- step 3: where widening would actually help ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -6 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <path
          d={`M ${B0} 336 l 0 8 l ${(B1 - B0) / 2 - 6} 0 l 6 8 l 6 -8 l ${(B1 - B0) / 2 - 6} 0 l 0 -8`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <text
          x={(B0 + B1) / 2}
          y={370}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          расширять здесь
        </text>
      </motion.g>

      {/* ---- step 2: the formula ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 214}
          y={400}
          width={428}
          height={42}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={426}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          скорость команды = пропускная способность ревью
        </text>
      </motion.g>
    </svg>
  );
}

export const bottleneckSlide: Slide = {
  id: 'bottleneck',
  title: 'бутылочное горлышко переехало',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>агентная команда · 24</Eyebrow>
          <SlideTitle size="md">Бутылочное горлышко переехало</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Раньше труба была ровной: писали, ревьюили, мержили — примерно с одной скоростью.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Агенты расширили написание в разы. Ревью осталось прежним — и перед ним выросла очередь.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Скорость команды = пропускная способность ревью. Всё остальное — цифры для отчёта.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Расширять надо не написание. Его уже расширили за нас.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <PipeDiagram step={step} />
        </div>
      }
    />
  ),
};
