import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Pt = { x: number; y: number };

const W = 580;
const H = 500;

/** Deterministic control flow is square and hard-edged — the part-1 idiom for
 *  "this is code". Judgement is round. The whole slide is that one contrast. */
const SQ_W = 150;
const SQ_H = 46;

const CODE: { at: Pt; label: string; sub: string }[] = [
  { at: { x: 290, y: 60 }, label: 'for', sub: 'по каждому файлу' },
  { at: { x: 290, y: 146 }, label: 'fan-out', sub: '10 параллельно' },
  { at: { x: 290, y: 352 }, label: 'merge', sub: 'сводим находки' },
  { at: { x: 290, y: 438 }, label: 'if', sub: 'есть блокеры?' },
];

const AGENT_R = 36;
const AGENT_CY = 250;
const AGENTS = [104, 290, 476];

/** Coins ride beside a round node: the only place tokens are actually spent. */
const COINS: Pt[] = [
  { x: 30, y: -30 },
  { x: 43, y: -18 },
];

function CodeBlock({ at, label, sub }: { at: Pt; label: string; sub: string }) {
  return (
    <g>
      <rect
        x={at.x - SQ_W / 2}
        y={at.y - SQ_H / 2}
        width={SQ_W}
        height={SQ_H}
        fill="var(--bg-elev)"
        stroke="var(--cool)"
        strokeWidth="1.6"
      />
      <text
        x={at.x}
        y={at.y - 3}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="15"
        fill="var(--cool)"
        letterSpacing="0.06em"
      >
        {label}
      </text>
      <text
        x={at.x}
        y={at.y + 15}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--ink-mute)"
        letterSpacing="0.04em"
      >
        {sub}
      </text>
    </g>
  );
}

function OrchestrationDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- step 0: the skeleton. Solid strokes, no ambiguity. ---- */}
      <text
        x={W / 2}
        y={20}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--cool)"
        letterSpacing="0.08em"
      >
        это код — он детерминирован
      </text>

      <line x1={290} y1={83} x2={290} y2={123} stroke="var(--cool)" strokeWidth="1.4" />
      {AGENTS.map((cx) => (
        <line
          key={`in-${cx}`}
          x1={290}
          y1={169}
          x2={cx}
          y2={AGENT_CY - AGENT_R - 6}
          stroke="var(--cool)"
          strokeWidth="1.4"
        />
      ))}
      {AGENTS.map((cx) => (
        <line
          key={`out-${cx}`}
          x1={cx}
          y1={AGENT_CY + AGENT_R + 6}
          x2={290}
          y2={329}
          stroke="var(--cool)"
          strokeWidth="1.4"
        />
      ))}
      <line x1={290} y1={375} x2={290} y2={415} stroke="var(--cool)" strokeWidth="1.4" />

      {CODE.map((c) => (
        <CodeBlock key={c.label} at={c.at} label={c.label} sub={c.sub} />
      ))}

      {/* the empty slots: the graph has holes shaped like judgement */}
      {AGENTS.map((cx) => (
        <circle
          key={`slot-${cx}`}
          cx={cx}
          cy={AGENT_CY}
          r={AGENT_R}
          fill="none"
          stroke="var(--line)"
          strokeWidth="1.2"
          strokeDasharray="4 5"
        />
      ))}

      {/* ---- step 1: judgement drops into the slots ---- */}
      {AGENTS.map((cx, i) => (
        <motion.g
          key={`agent-${cx}`}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.72 }}
          transition={{ duration: 0.45, delay: step >= 1 ? i * 0.09 : 0, ease: [0.34, 1.4, 0.64, 1] }}
          style={{ transformOrigin: `${cx}px ${AGENT_CY}px` }}
        >
          {/* ambient: the stochastic half never sits still */}
          <motion.circle
            cx={cx}
            cy={AGENT_CY}
            r={AGENT_R + 9}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="1"
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ opacity: 0.45, scale: 1 }}
            animate={{ opacity: [0.45, 0.1, 0.45], scale: [1, 1.14, 1] }}
            transition={{ duration: 2.6, delay: i * 0.45, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${cx}px ${AGENT_CY}px` }}
          />
          <circle cx={cx} cy={AGENT_CY} r={AGENT_R} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.5" />
          <text
            x={cx}
            y={AGENT_CY - 2}
            textAnchor="middle"
            fontFamily="var(--display)"
            fontStyle="italic"
            fontSize="16"
            fill="var(--accent)"
          >
            агент
          </text>
          <text
            x={cx}
            y={AGENT_CY + 16}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="9"
            fill="var(--ink-mute)"
            letterSpacing="0.04em"
          >
            суждение
          </text>
        </motion.g>
      ))}

      {/* ---- step 2: the cost overlay. Coins only where thinking happens. ---- */}
      {AGENTS.map((cx, i) => (
        <motion.g
          key={`coins-${cx}`}
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 6 }}
          transition={{ duration: 0.4, delay: step >= 2 ? i * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          {COINS.map((c, j) => (
            <g key={j}>
              <circle
                cx={cx + c.x}
                cy={AGENT_CY + c.y}
                r={8}
                fill="var(--accent-soft)"
                stroke="var(--accent)"
                strokeWidth="1.2"
              />
              <circle cx={cx + c.x} cy={AGENT_CY + c.y} r={3} fill="none" stroke="var(--accent)" strokeWidth="1" />
            </g>
          ))}
        </motion.g>
      ))}

      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: step >= 2 ? 0.24 : 0 }}
      >
        <circle cx={34} cy={440} r={8} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.2" />
        <circle cx={34} cy={440} r={3} fill="none" stroke="var(--accent)" strokeWidth="1" />
        <text x={48} y={444} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.06em">
          токены — только здесь
        </text>
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -8 }}
        transition={{ duration: 0.4, delay: step >= 2 ? 0.3 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <text
          x={W / 2}
          y={484}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          маршрутизация бесплатна, мышление — нет
        </text>
      </motion.g>
    </svg>
  );
}

export const determinismSplitSlide: Slide = {
  id: 'determinism-split',
  title: 'код оркеструет, агенты судят',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия графов · 18</Eyebrow>
          <SlideTitle size="md">Код оркеструет, агенты судят</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Оркестрация — это обычный код: циклы, условия, fan-out.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Агенты — только там, где нужно суждение.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Токены тратим на мышление, не на маршрутизацию. Детерминизм — где можно…
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <OrchestrationDiagram step={step} />
        </div>
      }
    />
  ),
};
