import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const CARD_W = 268;
const CARD_H = 128;
const CARD_Y = 26;
const L_X = 14;
const R_X = 298;
const L_CX = L_X + CARD_W / 2;
const R_CX = R_X + CARD_W / 2;

const AGENT_Y = 252;
const AGENT_R = 30;

/** Retry counter that climbs without state: a column scrolled behind a
 *  one-line window, holding on each value then snapping to the next. */
const TICK_H = 20;
const TICK_VALUES = ['3', '4', '5', '6', '7'];
const TICK = (() => {
  const y: number[] = [];
  const t: number[] = [];
  const n = TICK_VALUES.length;
  for (let i = 0; i < n; i++) {
    y.push(-i * TICK_H, -i * TICK_H);
    t.push(i / n, (i + 1) / n - 0.005);
  }
  y.push(-n * TICK_H);
  t.push(1);
  return { y, t };
})();

/** Three question marks that never resolve — each on its own rhythm. */
const QUESTIONS = [
  { deg: 210, dur: 1.7, delay: 0 },
  { deg: 270, dur: 2.1, delay: 0.4 },
  { deg: 330, dur: 1.9, delay: 0.8 },
];

/** Attempts fired off in random directions, ending nowhere. */
const FLAILS = [120, 90, 60];

function TerminalCard({
  x,
  head,
  line1,
  line1Color,
  line2,
  line2Color,
}: {
  x: number;
  head: string;
  line1: string;
  line1Color: string;
  line2: string;
  line2Color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={CARD_Y}
        width={CARD_W}
        height={CARD_H}
        rx={8}
        fill="var(--bg-elev)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <text x={x + 18} y={CARD_Y + 24} fontFamily="var(--mono)" fontSize="11" fill="var(--ink-mute)" letterSpacing="0.04em">
        {head}
      </text>
      <line x1={x} y1={CARD_Y + 38} x2={x + CARD_W} y2={CARD_Y + 38} stroke="var(--line)" strokeWidth="1" />
      <text x={x + 18} y={CARD_Y + 70} fontFamily="var(--mono)" fontSize="12" fill={line1Color} letterSpacing="0.02em">
        {line1}
      </text>
      <text x={x + 18} y={CARD_Y + 94} fontFamily="var(--mono)" fontSize="12" fill={line2Color} letterSpacing="0.02em">
        {line2}
      </text>
    </g>
  );
}

function AgentNode({ cx, color, label }: { cx: number; color: string; label: string }) {
  return (
    <g>
      <circle cx={cx} cy={AGENT_Y} r={AGENT_R} fill="var(--bg-elev)" stroke={color} strokeWidth="1.4" />
      <text
        x={cx}
        y={AGENT_Y + 4}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill={color}
        letterSpacing="0.06em"
      >
        {label}
      </text>
    </g>
  );
}

function ErrorsDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s10-fix-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
        <clipPath id="s10-tick-clip">
          <rect x={161} y={356} width={22} height={TICK_H} />
        </clipPath>
      </defs>

      {/* ---- left: an error you cannot act on ---- */}
      <TerminalCard
        x={L_X}
        head="$ npm run build"
        line1="Error: something went wrong"
        line1Color="var(--warn)"
        line2="    at <anonymous>"
        line2Color="var(--ink-mute)"
      />

      {FLAILS.map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = L_CX + Math.cos(rad) * (AGENT_R + 2);
        const y1 = AGENT_Y + Math.sin(rad) * (AGENT_R + 2);
        const x2 = L_CX + Math.cos(rad) * 78;
        const y2 = AGENT_Y + Math.sin(rad) * 78;
        return (
          <g key={deg}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--warn)" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />
            <g opacity="0.45" stroke="var(--warn)" strokeWidth="1.3">
              <line x1={x2 - 4} y1={y2 - 4} x2={x2 + 4} y2={y2 + 4} />
              <line x1={x2 + 4} y1={y2 - 4} x2={x2 - 4} y2={y2 + 4} />
            </g>
          </g>
        );
      })}

      <AgentNode cx={L_CX} color="var(--warn)" label="агент" />

      {QUESTIONS.map((q) => {
        const rad = (q.deg * Math.PI) / 180;
        return (
          <motion.text
            key={q.deg}
            x={L_CX + Math.cos(rad) * 54}
            y={AGENT_Y + Math.sin(rad) * 54 + 6}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="19"
            fill="var(--warn)"
            initial={false}
            animate={{ opacity: [0.15, 1, 0.15] }}
            transition={{ duration: q.dur, delay: q.delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            ?
          </motion.text>
        );
      })}

      {/* retries piling up, jittering as they go */}
      <motion.g
        initial={false}
        animate={{ x: [0, -2, 2, -1, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
      >
        <text x={95} y={372} fontFamily="var(--mono)" fontSize="13" fill="var(--ink-mute)" letterSpacing="0.06em">
          попытка
        </text>
        <g clipPath="url(#s10-tick-clip)">
          <motion.g
            initial={false}
            animate={{ y: TICK.y }}
            transition={{ duration: 6, times: TICK.t, repeat: Infinity, ease: 'linear' }}
          >
            {[...TICK_VALUES, TICK_VALUES[0]].map((v, i) => (
              <text
                key={i}
                x={161}
                y={372 + i * TICK_H}
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
        <text x={174} y={372} fontFamily="var(--mono)" fontSize="13" fill="var(--ink-mute)">
          …
        </text>
      </motion.g>

      {/* ---- step 1: an error that names the file, the line and the expectation ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        <TerminalCard
          x={R_X}
          head="$ npm run build"
          line1="Error: expected «retries» ≥ 0"
          line1Color="var(--warn)"
          line2="  at config.ts:42"
          line2Color="var(--cool)"
        />

        <AgentNode cx={R_CX} color="var(--cool)" label="агент" />

        <motion.line
          x1={R_CX}
          y1={AGENT_Y + AGENT_R + 2}
          x2={R_CX}
          y2={324}
          stroke="var(--cool)"
          strokeWidth="1.4"
          markerEnd="url(#s10-fix-arr)"
          initial={false}
          animate={{ pathLength: step >= 1 ? 1 : 0 }}
          transition={{ duration: 0.45, delay: step >= 1 ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
        />

        <rect
          x={R_CX - 70}
          y={330}
          width={140}
          height={38}
          rx={5}
          fill="var(--bg-elev)"
          stroke="var(--cool)"
          strokeWidth="1.3"
        />
        <text
          x={R_CX}
          y={354}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--cool)"
          letterSpacing="0.04em"
        >
          config.ts:42
        </text>

        <motion.g
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.7 }}
          transition={{ duration: 0.35, delay: step >= 1 ? 0.4 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${R_CX}px 400px` }}
        >
          <circle cx={R_CX} cy={400} r={15} fill="none" stroke="var(--cool)" strokeWidth="1.4" />
          <path
            d={`M ${R_CX - 6} 400 l 4 5 l 8 -10`}
            fill="none"
            stroke="var(--cool)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <text
            x={R_CX}
            y={432}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="11"
            fill="var(--cool)"
            letterSpacing="0.06em"
          >
            одна правка
          </text>
        </motion.g>
      </motion.g>

      {/* ---- step 2: who reads your error strings now ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 236}
          y={452}
          width={472}
          height={38}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={476}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          текст ошибки — это API. Теперь у него два клиента.
        </text>
      </motion.g>
    </svg>
  );
}

export const agentErrorsSlide: Slide = {
  id: 'agent-errors',
  title: 'ошибки, понятные агенту',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия циклов · 10</Eyebrow>
          <SlideTitle size="md">Ошибки, понятные агенту</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>По этой ошибке нельзя действовать.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>По этой — можно: файл, строка, ожидание.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Ошибки читают уже не только люди. Пиши их как интерфейс.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ErrorsDiagram step={step} />
        </div>
      }
    />
  ),
};
