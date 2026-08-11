import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

/** Wider than the deck's usual 580: two lanes on one shared time axis only
 *  reads if the time axis is long enough to see the gap between them. */
const W = 700;
const H = 540;

/** x = time. Everything on this slide is measured in the same unit. */
const X0 = 104;
const U = 39;

const STAGES = ['найти', 'проверить', 'оформить'];
/** The barrier's stage window: as long as the slowest task in that stage. */
const STAGE_LEN = 4;
const STAGE_START = [0, 4, 8];
const BARRIER_END = STAGE_LEN * STAGES.length;

/**
 * Four tasks, each slow in a different stage — which is the whole point: no
 * single task is "the slow one", so a barrier waits for a different task every
 * time and a pipeline waits for nobody.
 */
const ITEMS: { name: string; d: number[] }[] = [
  { name: '#1', d: [4, 1, 1] },
  { name: '#2', d: [1, 4, 2] },
  { name: '#3', d: [2, 1, 4] },
  { name: '#4', d: [2, 2, 2] },
];

type Span = { a: number; b: number; s: number };

const BARRIER = ITEMS.map((it) => ({
  work: it.d.map((d, s) => ({ a: STAGE_START[s], b: STAGE_START[s] + d, s })),
  idle: it.d
    .map((d, s) => ({ a: STAGE_START[s] + d, b: STAGE_START[s] + STAGE_LEN, s }))
    .filter((v) => v.b > v.a),
}));

const PIPELINE = ITEMS.map((it) => {
  const segs: Span[] = [];
  let t = 0;
  it.d.forEach((d, s) => {
    segs.push({ a: t, b: t + d, s });
    t += d;
  });
  return { segs, total: t };
});

const PIPE_END = Math.max(...PIPELINE.map((p) => p.total));
const IDLE_TOTAL = BARRIER.reduce((sum, b) => sum + b.idle.reduce((s, v) => s + (v.b - v.a), 0), 0);

const x = (t: number) => X0 + t * U;

/** Stage depth, so a bar reads as three stages and not one block. */
const STAGE_FILL = [0.8, 0.55, 0.34];

const ROW_H = 20;
const ROW_PITCH = 27;

const BAR_TOP = 80;
const PIPE_TOP = 292;
const rowY = (top: number, i: number) => top + i * ROW_PITCH;

/**
 * Ambient dots. Sampled on a fixed grid instead of hand-built keyframes: the
 * grid is coarse enough to stay cheap and fine enough that a work→idle switch
 * reads as instant, and it makes the "blink while waiting" free.
 */
const SAMPLES = 48;
const SAMPLE_TIMES = Array.from({ length: SAMPLES + 1 }, (_, k) => k / SAMPLES);

function sample(spans: Span[], mode: 'work' | 'blink') {
  return SAMPLE_TIMES.map((f, k) => {
    const t = f * BARRIER_END;
    const inside = spans.some((sp) => t >= sp.a && t < sp.b);
    if (!inside) return 0;
    if (mode === 'work') return 1;
    return Math.floor(k / 2) % 2 === 0 ? 0.9 : 0.12;
  });
}

const WORK_KEYS = BARRIER.map((b) => sample(b.work, 'work'));
const BLINK_KEYS = BARRIER.map((b) => sample(b.idle, 'blink'));

/** Idle accrued by time t, on the same grid: the hatched bar grows as the run
 *  runs, so the waste is watched being produced rather than just labelled. */
const IDLE_SCALE = 12;
const IDLE_W = SAMPLE_TIMES.map((f) => {
  const t = f * BARRIER_END;
  let acc = 0;
  BARRIER.forEach((b) => b.idle.forEach((sp) => (acc += Math.max(0, Math.min(t, sp.b) - sp.a))));
  return acc * IDLE_SCALE;
});

const RUN_DURATION = 6.6;
const RUN_DELAY = 1;

/** Pipeline dots run at the same speed and simply stop when they are done. */
const PIPE_KEYS = PIPELINE.map((p) => ({
  x: [x(0), x(p.total), x(p.total)],
  times: [0, p.total / BARRIER_END, 1],
}));

const CU = 30;

function LaneDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 760 }}>
      <defs>
        <pattern id="s19-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--warn)" strokeWidth="1.6" opacity="0.55" />
        </pattern>
      </defs>

      {/* ================= barrier lane ================= */}
      <text x={20} y={34} fontFamily="var(--mono)" fontSize="13" fill="var(--warn)" letterSpacing="0.08em">
        barrier
      </text>
      <text x={20} y={50} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.04em">
        стадия ждёт всех
      </text>

      {STAGES.map((s, i) => (
        <text
          key={s}
          x={x(STAGE_START[i] + STAGE_LEN / 2)}
          y={68}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--ink-mute)"
          letterSpacing="0.08em"
        >
          {s}
        </text>
      ))}

      {/* the fences themselves */}
      {[1, 2].map((k) => (
        <motion.line
          key={k}
          x1={x(k * STAGE_LEN)}
          y1={62}
          x2={x(k * STAGE_LEN)}
          y2={188}
          strokeWidth="1.4"
          strokeDasharray="5 4"
          initial={false}
          animate={{ stroke: step >= 3 && k === 2 ? 'var(--cool)' : 'var(--warn)', opacity: 0.85 }}
          transition={{ duration: 0.45 }}
        />
      ))}
      <line x1={x(BARRIER_END)} y1={62} x2={x(BARRIER_END)} y2={188} stroke="var(--warn)" strokeWidth="1.4" />
      <text
        x={x(BARRIER_END)}
        y={54}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--warn)"
        letterSpacing="0.06em"
      >
        финиш
      </text>

      {BARRIER.map((b, i) => (
        <g key={ITEMS[i].name}>
          <text
            x={X0 - 12}
            y={rowY(BAR_TOP, i) + 14}
            textAnchor="end"
            fontFamily="var(--mono)"
            fontSize="10"
            fill="var(--ink-mute)"
          >
            {ITEMS[i].name}
          </text>
          {b.work.map((sp) => (
            <rect
              key={`w${sp.s}`}
              x={x(sp.a)}
              y={rowY(BAR_TOP, i)}
              width={(sp.b - sp.a) * U}
              height={ROW_H}
              rx={2}
              fill="var(--accent)"
              opacity={STAGE_FILL[sp.s]}
            />
          ))}
          {b.idle.map((sp) => (
            <rect
              key={`i${sp.s}`}
              x={x(sp.a)}
              y={rowY(BAR_TOP, i)}
              width={(sp.b - sp.a) * U}
              height={ROW_H}
              rx={2}
              fill="url(#s19-hatch)"
              stroke="var(--warn)"
              strokeWidth="0.8"
              strokeOpacity="0.4"
            />
          ))}
        </g>
      ))}

      {/* the dots: full while working, blinking mute while parked at a fence */}
      {BARRIER.map((_, i) => (
        <motion.g
          key={`bd${i}`}
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ x: x(0) }}
          animate={{ x: [x(0), x(BARRIER_END)] }}
          transition={{ duration: RUN_DURATION, repeat: Infinity, repeatDelay: RUN_DELAY, ease: 'linear' }}
        >
          <motion.circle
            cy={rowY(BAR_TOP, i) + ROW_H / 2}
            r={5}
            fill="var(--ink)"
            initial={{ opacity: WORK_KEYS[i][0] }}
            animate={{ opacity: WORK_KEYS[i] }}
            transition={{
              duration: RUN_DURATION,
              times: SAMPLE_TIMES,
              repeat: Infinity,
              repeatDelay: RUN_DELAY,
              ease: 'linear',
            }}
          />
          <motion.circle
            cy={rowY(BAR_TOP, i) + ROW_H / 2}
            r={5}
            fill="none"
            stroke="var(--ink-mute)"
            strokeWidth="1.4"
            initial={{ opacity: BLINK_KEYS[i][0] }}
            animate={{ opacity: BLINK_KEYS[i] }}
            transition={{
              duration: RUN_DURATION,
              times: SAMPLE_TIMES,
              repeat: Infinity,
              repeatDelay: RUN_DELAY,
              ease: 'linear',
            }}
          />
        </motion.g>
      ))}

      {/* all that waiting, summed into one bar */}
      <rect
        x={X0}
        y={198}
        width={IDLE_TOTAL * IDLE_SCALE}
        height={14}
        rx={2}
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
        strokeDasharray="3 4"
      />
      <motion.rect
        x={X0}
        y={198}
        height={14}
        rx={2}
        fill="url(#s19-hatch)"
        stroke="var(--warn)"
        strokeWidth="0.8"
        strokeOpacity="0.5"
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ width: IDLE_W[0] }}
        animate={{ width: IDLE_W }}
        transition={{
          duration: RUN_DURATION,
          times: SAMPLE_TIMES,
          repeat: Infinity,
          repeatDelay: RUN_DELAY,
          ease: 'linear',
        }}
      />
      <text
        x={X0 + IDLE_TOTAL * IDLE_SCALE + 12}
        y={209}
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--warn)"
        letterSpacing="0.04em"
      >
        простой: {IDLE_TOTAL} — впустую
      </text>

      {/* ================= pipeline lane ================= */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <text x={20} y={256} fontFamily="var(--mono)" fontSize="13" fill="var(--cool)" letterSpacing="0.08em">
          pipeline
        </text>
        <text x={20} y={272} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.04em">
          каждая — своим темпом
        </text>

        <line x1={x(PIPE_END)} y1={278} x2={x(PIPE_END)} y2={400} stroke="var(--cool)" strokeWidth="1.4" />
        <text
          x={x(PIPE_END)}
          y={272}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--cool)"
          letterSpacing="0.06em"
        >
          финиш
        </text>

        {PIPELINE.map((p, i) => (
          <g key={ITEMS[i].name}>
            <text
              x={X0 - 12}
              y={rowY(PIPE_TOP, i) + 14}
              textAnchor="end"
              fontFamily="var(--mono)"
              fontSize="10"
              fill="var(--ink-mute)"
            >
              {ITEMS[i].name}
            </text>
            {p.segs.map((sp) => (
              <rect
                key={sp.s}
                x={x(sp.a)}
                y={rowY(PIPE_TOP, i)}
                width={(sp.b - sp.a) * U}
                height={ROW_H}
                rx={2}
                fill="var(--accent)"
                opacity={STAGE_FILL[sp.s]}
              />
            ))}
          </g>
        ))}

        <text x={X0} y={414} fontFamily="var(--mono)" fontSize="10" fill="var(--cool)" letterSpacing="0.04em">
          простой: 0 — никто никого не ждёт
        </text>
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: step >= 1 ? 0.3 : 0 }}
      >
        {PIPE_KEYS.map((k, i) => (
          <motion.g
            key={`pd${i}`}
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ x: k.x[0] }}
            animate={{ x: k.x }}
            transition={{
              duration: RUN_DURATION,
              times: k.times,
              repeat: Infinity,
              repeatDelay: RUN_DELAY,
              ease: 'linear',
            }}
          >
            <circle cy={rowY(PIPE_TOP, i) + ROW_H / 2} r={5} fill="var(--ink)" />
          </motion.g>
        ))}
      </motion.g>

      {/* ================= step 2: the wall clock ================= */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <text x={20} y={444} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
          ВРЕМЯ ДО РЕЗУЛЬТАТА
        </text>
        <rect x={X0} y={452} width={BARRIER_END * CU} height={16} rx={2} fill="var(--warn)" opacity="0.75" />
        <text
          x={X0 + BARRIER_END * CU + 12}
          y={464}
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--warn)"
          letterSpacing="0.04em"
        >
          barrier
        </text>
        <rect x={X0} y={478} width={PIPE_END * CU} height={16} rx={2} fill="var(--cool)" opacity="0.8" />
        <text
          x={X0 + PIPE_END * CU + 12}
          y={490}
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--cool)"
          letterSpacing="0.04em"
        >
          pipeline
        </text>
      </motion.g>

      {/* ================= step 3: when the fence is right ================= */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 268}
          y={504}
          width={536}
          height={34}
          rx={4}
          fill="color-mix(in srgb, var(--cool) 12%, transparent)"
          stroke="var(--cool)"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        <text
          x={W / 2}
          y={526}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--cool)"
          letterSpacing="0.02em"
        >
          стена нужна, только если стадии N нужно ВСЁ из N−1 — дедупликация
        </text>
      </motion.g>
    </svg>
  );
}

export const pipelineBarrierSlide: Slide = {
  id: 'pipeline-barrier',
  title: 'pipeline против barrier',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.5fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия графов · 19</Eyebrow>
          <SlideTitle size="sm">Pipeline против barrier</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Barrier: стадия не начнётся, пока все задачи не дойдут до стены.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Pipeline: каждая задача идёт до конца своим темпом.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Стены между стадиями — это простой быстрых задач.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Barrier нужен, только когда стадии N нужно ВСЁ из стадии N−1 — например,
                  дедупликация.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LaneDiagram step={step} />
        </div>
      }
    />
  ),
};
