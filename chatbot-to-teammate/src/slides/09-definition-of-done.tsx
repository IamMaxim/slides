import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const LOOP_C = { x: 156, y: 176 };
const LOOP_R = 84;

const EXIT_Y = LOOP_C.y;
const EXIT_FROM = LOOP_C.x + LOOP_R;
const EXIT_TO = 458;

const GATE_X = 352;
const GATE_W = 52;
const GATE_H = 88;

const DONE_X = 462;
const DONE_W = 96;
const DONE_H = 40;

const CARD_X = 172;
const CARD_W = 380;
const CARD_Y = 288;
const CARD_H = 126;

const CHECKS = ['тесты зелёные', 'lint чистый', 'сценарий X работает'];

/** A counter that ticks without state: a column of numbers scrolled behind a
 *  one-line window, holding on each value then snapping to the next. */
const TICK_H = 22;
const TICK_VALUES = ['47', '48', '49', '50', '51', '52'];
const TICK = (() => {
  const y: number[] = [];
  const t: number[] = [];
  const n = TICK_VALUES.length;
  for (let i = 0; i < n; i++) {
    y.push(-i * TICK_H, -i * TICK_H);
    t.push(i / n, (i + 1) / n - 0.004);
  }
  y.push(-n * TICK_H);
  t.push(1);
  return { y, t };
})();

/** Tangential arrowhead on the loop, pointing the way the dot travels. */
function LoopArrow({ deg }: { deg: number }) {
  const rad = (deg * Math.PI) / 180;
  const x = LOOP_C.x + Math.cos(rad) * LOOP_R;
  const y = LOOP_C.y + Math.sin(rad) * LOOP_R;
  return <polygon points="-6,-5 6,0 -6,5" fill="var(--ink-soft)" transform={`translate(${x} ${y}) rotate(${deg + 90})`} />;
}

function GateDiagram({ step }: { step: number }) {
  const gateOn = step >= 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s9-exit-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
        <clipPath id="s9-tick-clip">
          <rect x={169} y={38} width={22} height={TICK_H} />
        </clipPath>
      </defs>

      {/* ---- the counter that never stops ---- */}
      <motion.g initial={false} animate={{ opacity: gateOn ? 0.35 : 1 }} transition={{ duration: 0.4 }}>
        <text x={94} y={55} fontFamily="var(--mono)" fontSize="13" fill="var(--ink-mute)" letterSpacing="0.06em">
          итерация
        </text>
        <g clipPath="url(#s9-tick-clip)">
          <motion.g
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ y: TICK.y[0] }}
            animate={{ y: TICK.y }}
            transition={{ duration: 9, times: TICK.t, repeat: Infinity, ease: 'linear' }}
          >
            {[...TICK_VALUES, TICK_VALUES[0]].map((v, i) => (
              <text
                key={i}
                x={169}
                y={55 + i * TICK_H}
                fontFamily="var(--mono)"
                fontSize="13"
                fill="var(--warn)"
                letterSpacing="0.06em"
              >
                {v}
              </text>
            ))}
          </motion.g>
        </g>
        <text x={191} y={55} fontFamily="var(--mono)" fontSize="13" fill="var(--ink-mute)">
          …
        </text>
      </motion.g>

      {/* ---- the loop itself ---- */}
      <circle
        cx={LOOP_C.x}
        cy={LOOP_C.y}
        r={LOOP_R}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.2"
        opacity="0.75"
      />
      <LoopArrow deg={270} />
      <LoopArrow deg={90} />
      <text
        x={LOOP_C.x}
        y={LOOP_C.y + 1}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="19"
        fill="var(--ink-soft)"
      >
        цикл
      </text>
      <text
        x={LOOP_C.x}
        y={LOOP_C.y + 21}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        агент
      </text>
      {/* ambient: the loop turns regardless of which step we are on */}
      <motion.g
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${LOOP_C.x}px ${LOOP_C.y}px` }}
      >
        <circle cx={LOOP_C.x} cy={LOOP_C.y - LOOP_R} r={6} fill="var(--accent)" />
      </motion.g>

      {/* ---- step 1: the exit, and the gate standing on it ---- */}
      <motion.g initial={false} animate={{ opacity: gateOn ? 1 : 0 }} transition={{ duration: 0.45 }}>
        <line
          x1={EXIT_FROM + 8}
          y1={EXIT_Y}
          x2={EXIT_TO}
          y2={EXIT_Y}
          stroke="var(--cool)"
          strokeWidth="1.2"
          opacity="0.6"
          markerEnd="url(#s9-exit-arr)"
        />

        <text
          x={GATE_X}
          y={118}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--cool)"
          letterSpacing="0.06em"
        >
          критерии приёмки
        </text>
        <rect
          x={GATE_X - GATE_W / 2}
          y={EXIT_Y - GATE_H / 2}
          width={GATE_W}
          height={GATE_H}
          rx={3}
          fill="var(--bg-elev)"
          stroke="var(--cool)"
          strokeWidth="1.5"
        />
        {/* turnstile rotor: the gate turns, one release at a time */}
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10.4, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: `${GATE_X}px ${EXIT_Y}px` }}
        >
          {[0, 120, 240].map((a) => (
            <line
              key={a}
              x1={GATE_X}
              y1={EXIT_Y}
              x2={GATE_X + Math.cos((a * Math.PI) / 180) * 21}
              y2={EXIT_Y + Math.sin((a * Math.PI) / 180) * 21}
              stroke="var(--cool)"
              strokeWidth="1.4"
              opacity="0.8"
            />
          ))}
          <circle cx={GATE_X} cy={EXIT_Y} r={3} fill="var(--cool)" />
        </motion.g>

        <rect
          x={DONE_X}
          y={EXIT_Y - DONE_H / 2}
          width={DONE_W}
          height={DONE_H}
          rx={6}
          fill="var(--bg-elev)"
          stroke="var(--cool)"
          strokeWidth="1.3"
        />
        <text
          x={DONE_X + DONE_W / 2}
          y={EXIT_Y + 5}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="14"
          fill="var(--cool)"
          letterSpacing="0.06em"
        >
          готово
        </text>

        {/* one result leaving the loop, over and over */}
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ x: EXIT_FROM + 10, opacity: 0 }}
          animate={{ x: [EXIT_FROM + 10, DONE_X - 6], opacity: [0, 1, 1, 0] }}
          transition={{
            x: { duration: 2.6, repeat: Infinity, repeatDelay: 1, ease: 'linear' },
            opacity: {
              duration: 2.6,
              times: [0, 0.1, 0.86, 1],
              repeat: Infinity,
              repeatDelay: 1,
              ease: 'linear',
            },
          }}
        >
          <circle cx={0} cy={EXIT_Y} r={5} fill="var(--cool)" />
        </motion.g>
      </motion.g>

      {/* ---- step 2: the gate, zoomed ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.9 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${GATE_X}px ${EXIT_Y + GATE_H / 2}px` }}
      >
        <line
          x1={GATE_X}
          y1={EXIT_Y + GATE_H / 2}
          x2={GATE_X}
          y2={CARD_Y}
          stroke="var(--line)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />
        <rect
          x={CARD_X}
          y={CARD_Y}
          width={CARD_W}
          height={CARD_H}
          rx={8}
          fill="var(--bg-elev)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text
          x={CARD_X + 24}
          y={CARD_Y + 28}
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--accent)"
          letterSpacing="0.1em"
        >
          done =
        </text>
        {CHECKS.map((c, i) => {
          const y = CARD_Y + 58 + i * 28;
          return (
            <g key={c}>
              <path
                d={`M ${CARD_X + 26} ${y - 5} l 4.5 5 l 8 -10`}
                fill="none"
                stroke="var(--cool)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text x={CARD_X + 50} y={y + 5} fontFamily="var(--mono)" fontSize="14" fill="var(--ink)" letterSpacing="0.04em">
                {c}
              </text>
            </g>
          );
        })}
      </motion.g>

      {/* ---- step 3: where those criteria actually come from ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 100}
          y={438}
          width={200}
          height={38}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={462}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.08em"
        >
          тикет = промпт
        </text>
      </motion.g>
    </svg>
  );
}

export const definitionOfDoneSlide: Slide = {
  id: 'definition-of-done',
  title: 'машинно-проверяемое done',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия циклов · 9</Eyebrow>
          <SlideTitle size="md">Машинно-проверяемое done</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Без стоп-условия цикл или крутится вечно, или выходит рано.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Выход — это машинно-проверяемое определение „готово“.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Критерии приёмки из тикета — это буквально промпт агента.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>Качество тикетов — теперь инженерный артефакт.</span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GateDiagram step={step} />
        </div>
      }
    />
  ),
};
