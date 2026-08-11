import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

const W = 580;
const H = 500;

/**
 * Slide 11's context bar, read the other way round: not "it fills up over a
 * long session" but "there is only one of it, and the work does not fit".
 */
const BAR = { x: 26, y: 34, w: 528, h: 58 };
const JAMMED: { label: string; x: number; w: number }[] = [
  { label: 'задача 1', x: 26, w: 150 },
  { label: 'задача 2', x: 176, w: 150 },
  { label: 'задача 3', x: 326, w: 150 },
  { label: 'мусор', x: 476, w: 78 },
];

const NODE_R = 48;
const NODE_CY = 200;
const NODE_TOP = NODE_CY - NODE_R;
const NODE_BOT = NODE_CY + NODE_R;

/** Three fresh contexts, each with its own loop. */
const FAN = [88, 222, 356];
/** The fourth node deliberately stands apart: no wire from the author's bar. */
const REVIEWER_CX = 490;

const MERGE = { cx: 290, cy: 352, r: 32 };

/** A context with its own loop turning around it. */
function LoopNode({
  cx,
  label,
  sub,
  color,
  spin,
}: {
  cx: number;
  label: string;
  sub: string;
  color: string;
  spin: number;
}) {
  return (
    <g>
      <motion.circle
        cx={cx}
        cy={NODE_CY}
        r={NODE_R + 10}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 7"
        opacity="0.55"
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: spin, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${cx}px ${NODE_CY}px` }}
      />
      <circle cx={cx} cy={NODE_CY} r={NODE_R} fill="var(--bg-elev)" stroke={color} strokeWidth="1.5" />
      <text
        x={cx}
        y={NODE_CY - 2}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="13"
        fill={color}
      >
        {label}
      </text>
      <text
        x={cx}
        y={NODE_CY + 17}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--ink-mute)"
        letterSpacing="0.04em"
      >
        {sub}
      </text>
    </g>
  );
}

function GraphBirthDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- step 0: one context, packed past the point of usefulness ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 0.3 : 1 }} transition={{ duration: 0.5 }}>
        <rect
          x={BAR.x}
          y={BAR.y}
          width={BAR.w}
          height={BAR.h}
          rx={5}
          fill="none"
          stroke="var(--warn)"
          strokeWidth="1.2"
        />
        {JAMMED.map((b) => (
          <g key={b.label}>
            <rect
              x={b.x}
              y={BAR.y}
              width={b.w}
              height={BAR.h}
              fill="var(--warn-soft)"
              stroke="var(--warn)"
              strokeWidth="1"
              opacity="0.75"
            />
            <text
              x={b.x + b.w / 2}
              y={BAR.y + BAR.h / 2 + 4}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="11"
              fill="var(--warn)"
              letterSpacing="0.06em"
            >
              {b.label}
            </text>
          </g>
        ))}
        <text
          x={BAR.x}
          y={BAR.y + BAR.h + 20}
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--ink-mute)"
          letterSpacing="0.08em"
        >
          один контекст на всё
        </text>
      </motion.g>

      {/* ---- step 1: it splits — three fresh contexts, three loops ---- */}
      {FAN.map((cx, i) => (
        <motion.line
          key={cx}
          x1={cx}
          y1={BAR.y + BAR.h}
          x2={cx}
          y2={NODE_TOP - 6}
          stroke="var(--accent)"
          strokeWidth="1.2"
          opacity="0.6"
          initial={false}
          animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 0.6 : 0 }}
          transition={{ duration: 0.45, delay: step >= 1 ? i * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}

      {FAN.map((cx, i) => (
        <motion.g
          key={cx}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.7 }}
          transition={{ duration: 0.45, delay: step >= 1 ? 0.14 + i * 0.08 : 0, ease: [0.34, 1.4, 0.64, 1] }}
          style={{ transformOrigin: `${cx}px ${NODE_CY}px` }}
        >
          <LoopNode cx={cx} label="агент" sub="свежий контекст" color="var(--accent)" spin={13 + i * 4} />
        </motion.g>
      ))}

      {/* ---- step 2: the reviewer, and the wire that is deliberately absent ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        <line
          x1={REVIEWER_CX}
          y1={BAR.y + BAR.h}
          x2={REVIEWER_CX}
          y2={NODE_TOP - 6}
          stroke="var(--line)"
          strokeWidth="1.2"
          strokeDasharray="3 6"
        />
        <g stroke="var(--warn)" strokeWidth="1.6" strokeLinecap="round">
          <line x1={REVIEWER_CX - 7} y1={116} x2={REVIEWER_CX + 7} y2={130} />
          <line x1={REVIEWER_CX + 7} y1={116} x2={REVIEWER_CX - 7} y2={130} />
        </g>
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.7 }}
        transition={{ duration: 0.45, ease: [0.34, 1.4, 0.64, 1] }}
        style={{ transformOrigin: `${REVIEWER_CX}px ${NODE_CY}px` }}
      >
        <LoopNode cx={REVIEWER_CX} label="проверяющий" sub="чистый лист" color="var(--cool)" spin={17} />
      </motion.g>

      <motion.text
        x={W / 2}
        y={282}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--cool)"
        letterSpacing="0.06em"
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: step >= 2 ? 0.25 : 0 }}
      >
        свежий контекст = независимое суждение
      </motion.text>

      {/* ---- step 3: the nodes stop being a list and become a graph ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.5 }}>
        {[...FAN, REVIEWER_CX].map((cx, i) => {
          const dx = MERGE.cx - cx;
          const dy = MERGE.cy - NODE_BOT;
          const len = Math.hypot(dx, dy);
          return (
            <motion.line
              key={cx}
              x1={cx}
              y1={NODE_BOT}
              x2={MERGE.cx - (dx / len) * MERGE.r}
              y2={MERGE.cy - (dy / len) * MERGE.r}
              stroke="var(--ink-soft)"
              strokeWidth="1.2"
              opacity="0.7"
              initial={false}
              animate={{ pathLength: step >= 3 ? 1 : 0 }}
              transition={{ duration: 0.5, delay: step >= 3 ? i * 0.07 : 0, ease: [0.22, 1, 0.36, 1] }}
            />
          );
        })}
        <circle
          cx={MERGE.cx}
          cy={MERGE.cy}
          r={MERGE.r}
          fill="var(--bg-elev)"
          stroke="var(--ink-soft)"
          strokeWidth="1.4"
        />
        <text
          x={MERGE.cx}
          y={MERGE.cy + 4}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--ink-soft)"
          letterSpacing="0.02em"
        >
          сведение
        </text>
      </motion.g>

      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.4, delay: step >= 3 ? 0.25 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 170}
          y={416}
          width={340}
          height={42}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={442}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          единица работы — граф циклов
        </text>
      </motion.g>
    </svg>
  );
}

export const eraGraphsSlide: Slide = {
  id: 'era-graphs',
  title: 'эра 6 · одного цикла мало',
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Split
          ratio="1fr 1.2fr"
          left={
            <Stack gap={20}>
              <Eyebrow>история · 17</Eyebrow>
              <SlideTitle size="md">Эра 6: одного цикла мало</SlideTitle>
              <Stack gap={14} style={{ marginTop: 12 }}>
                <Build step={step} appearAt={0}>
                  <BodyText>Контекст конечен, а задачи — нет.</BodyText>
                </Build>
                <Build step={step} appearAt={1}>
                  <BodyText>Параллелизм: десять свежих контекстов вместо одного уставшего.</BodyText>
                </Build>
                <Build step={step} appearAt={2}>
                  <BodyText>
                    Проверяющий, сидящий в контексте автора, наследует его слепые пятна.
                  </BodyText>
                </Build>
                <Build step={step} appearAt={3}>
                  <BodyText>
                    <span style={{ color: 'var(--ink)' }}>
                      Единица работы теперь — не цикл, а граф циклов.
                    </span>
                  </BodyText>
                </Build>
              </Stack>
            </Stack>
          }
          right={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GraphBirthDiagram step={step} />
            </div>
          }
        />
      </div>
      {/* deck spine: same footer slot on every era slide */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <EraTimeline compact current={5} />
      </div>
    </div>
  ),
};
