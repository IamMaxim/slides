import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 660;
const H = 540;
const CX = 330;

/* ---------------- the knob ---------------- */
const TRACK_L = 150;
const TRACK_R = 520;
const TRACK_Y = 34;
const KNOB_LO = TRACK_L + 24;
const KNOB_HI = TRACK_R - 24;

/* ---------------- the graph ---------------- */
const SRC = { y: 116, w: 150, h: 38 };
const FINDER_CY = 196;
const FINDER_R = 18;
const SKEPTIC_CY = 290;
const SKEPTIC_R = 10;
const JUDGE = { x: 110, y: 340, w: 440, h: 36 };
const RESULT = { y: 424, w: 176, h: 38 };

/** Six slots. Turned down, four of them collapse into the middle and vanish,
 *  so the small graph is the big graph with the knob rolled back — not a
 *  different picture. */
const FINDERS = [0, 1, 2, 3, 4, 5];
const finderBig = (i: number) => 110 + i * 88;
/** The pair that survives a small budget stays centred on the spine. */
const SMALL_PAIR: Record<number, number> = { 2: 286, 3: 374 };
const finderSmall = (i: number) => SMALL_PAIR[i] ?? CX;

const SKEPTICS = [0, 1, 2];
const skepticBig = (i: number, j: number) => finderBig(i) + (j - 1) * 26;
/** Turned down there is exactly one reviewer: the two live slots sit on top of
 *  each other on the spine, so both surviving finders feed the same node. */
const skepticVisible = (i: number, j: number) => SMALL_PAIR[i] !== undefined && j === 1;

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SPRING = { duration: 0.75, ease: EASE_OUT };

function BudgetDiagram({ step }: { step: number }) {
  const big = step >= 1;
  const fx = (i: number) => (big ? finderBig(i) : finderSmall(i));
  const sx = (i: number, j: number) => (big ? skepticBig(i, j) : CX);
  const spring = SPRING;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 720 }}>
      <defs>
        <marker id="s23-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--line)" />
        </marker>
      </defs>

      {/* ================= the knob ================= */}
      <text x={20} y={TRACK_Y + 5} fontFamily="var(--mono)" fontSize="11" fill="var(--ink-mute)" letterSpacing="0.1em">
        БЮДЖЕТ
      </text>
      <line x1={TRACK_L} y1={TRACK_Y} x2={TRACK_R} y2={TRACK_Y} stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
      <motion.line
        x1={TRACK_L}
        y1={TRACK_Y}
        y2={TRACK_Y}
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
        initial={false}
        animate={{ x2: big ? KNOB_HI : KNOB_LO }}
        transition={spring}
      />
      <text
        x={TRACK_L - 14}
        y={TRACK_Y + 5}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize="12"
        fill="var(--ink-soft)"
      >
        50k
      </text>
      <text x={TRACK_R + 14} y={TRACK_Y + 5} fontFamily="var(--mono)" fontSize="12" fill="var(--ink-soft)">
        500k
      </text>

      <motion.g initial={false} animate={{ x: big ? KNOB_HI : KNOB_LO }} transition={spring}>
        {/* ambient: a knob that is asking to be turned */}
        <motion.circle
          cy={TRACK_Y}
          r={11}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ scale: 1, opacity: 0.5 }}
          animate={{ scale: [1, 1.9, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          style={{ transformOrigin: `0px ${TRACK_Y}px` }}
        />
        <circle cy={TRACK_Y} r={9} fill="var(--accent)" stroke="var(--bg)" strokeWidth="2" />
      </motion.g>

      <motion.text
        y={TRACK_Y + 30}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--accent)"
        letterSpacing="0.06em"
        initial={false}
        animate={{ x: big ? KNOB_HI : KNOB_LO, opacity: big ? 0 : 1 }}
        transition={spring}
      >
        быстрая проверка
      </motion.text>
      <motion.text
        y={TRACK_Y + 30}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--accent)"
        letterSpacing="0.06em"
        initial={false}
        animate={{ x: big ? KNOB_HI : KNOB_LO, opacity: big ? 1 : 0 }}
        transition={spring}
      >
        глубокий аудит
      </motion.text>

      <line x1={20} y1={72} x2={W - 20} y2={72} stroke="var(--line)" strokeWidth="1" />

      {/* ================= the graph, one shape at two settings ================= */}
      <rect
        x={CX - SRC.w / 2}
        y={SRC.y}
        width={SRC.w}
        height={SRC.h}
        rx={5}
        fill="var(--bg-elev)"
        stroke="var(--cool)"
        strokeWidth="1.5"
      />
      <text
        x={CX}
        y={SRC.y + 24}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="13"
        fill="var(--cool)"
        letterSpacing="0.04em"
      >
        задача
      </text>

      {FINDERS.map((i) => (
        <motion.line
          key={`fe${i}`}
          x1={CX}
          y1={SRC.y + SRC.h}
          y2={FINDER_CY - FINDER_R - 4}
          stroke="var(--line)"
          strokeWidth="1.2"
          markerEnd="url(#s23-arr)"
          initial={false}
          animate={{ x2: fx(i), opacity: big || SMALL_PAIR[i] !== undefined ? 1 : 0 }}
          transition={spring}
        />
      ))}

      {FINDERS.map((i) =>
        SKEPTICS.map((j) => (
          <motion.line
            key={`se${i}-${j}`}
            y1={FINDER_CY + FINDER_R}
            y2={SKEPTIC_CY - SKEPTIC_R - 3}
            stroke="var(--line)"
            strokeWidth="1"
            initial={false}
            animate={{
              x1: fx(i),
              x2: sx(i, j),
              opacity: big ? 0.9 : skepticVisible(i, j) ? 0.9 : 0,
            }}
            transition={spring}
          />
        ))
      )}

      {FINDERS.map((i) => (
        <motion.g
          key={`f${i}`}
          initial={false}
          animate={{ x: fx(i), opacity: big || SMALL_PAIR[i] !== undefined ? 1 : 0 }}
          transition={spring}
        >
          <circle cy={FINDER_CY} r={FINDER_R} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.5" />
          <circle cy={FINDER_CY} r={5} fill="var(--accent)" opacity="0.8" />
        </motion.g>
      ))}

      {FINDERS.map((i) =>
        SKEPTICS.map((j) => (
          <motion.g
            key={`s${i}-${j}`}
            initial={false}
            animate={{ x: sx(i, j), opacity: big || skepticVisible(i, j) ? 1 : 0 }}
            transition={spring}
          >
            <circle cy={SKEPTIC_CY} r={SKEPTIC_R} fill="var(--bg-elev)" stroke="var(--ink-soft)" strokeWidth="1.3" />
          </motion.g>
        ))
      )}

      {/* row labels: the same rows, different populations */}
      <text x={20} y={FINDER_CY + 4} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.06em">
        поиск
      </text>
      <text x={20} y={SKEPTIC_CY + 4} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.06em">
        проверка
      </text>
      <motion.text
        x={W - 20}
        y={FINDER_CY + 4}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--accent)"
        initial={false}
        animate={{ opacity: big ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        ×2
      </motion.text>
      <motion.text
        x={W - 20}
        y={FINDER_CY + 4}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--accent)"
        initial={false}
        animate={{ opacity: big ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        ×6
      </motion.text>
      <motion.text
        x={W - 20}
        y={SKEPTIC_CY + 4}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-soft)"
        initial={false}
        animate={{ opacity: big ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      >
        ×1
      </motion.text>
      <motion.text
        x={W - 20}
        y={SKEPTIC_CY + 4}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-soft)"
        initial={false}
        animate={{ opacity: big ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        ×18
      </motion.text>

      {/* the judge stage only exists once there is something to judge */}
      <motion.g initial={false} animate={{ opacity: big ? 1 : 0 }} transition={spring}>
        {FINDERS.map((i) =>
          SKEPTICS.map((j) => (
            <line
              key={`je${i}-${j}`}
              x1={skepticBig(i, j)}
              y1={SKEPTIC_CY + SKEPTIC_R}
              x2={Math.min(Math.max(skepticBig(i, j), JUDGE.x + 10), JUDGE.x + JUDGE.w - 10)}
              y2={JUDGE.y}
              stroke="var(--line)"
              strokeWidth="1"
            />
          ))
        )}
        <rect
          x={JUDGE.x}
          y={JUDGE.y}
          width={JUDGE.w}
          height={JUDGE.h}
          rx={5}
          fill="var(--bg-elev)"
          stroke="var(--cool)"
          strokeWidth="1.4"
        />
        <text
          x={CX}
          y={JUDGE.y + 23}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--cool)"
          letterSpacing="0.06em"
        >
          панель судей
        </text>
        <line
          x1={CX}
          y1={JUDGE.y + JUDGE.h}
          x2={CX}
          y2={RESULT.y - 4}
          stroke="var(--line)"
          strokeWidth="1.2"
          markerEnd="url(#s23-arr)"
        />
      </motion.g>

      <motion.line
        x1={CX}
        y1={SKEPTIC_CY + SKEPTIC_R}
        x2={CX}
        y2={RESULT.y - 4}
        stroke="var(--line)"
        strokeWidth="1.2"
        markerEnd="url(#s23-arr)"
        initial={false}
        animate={{ opacity: big ? 0 : 1 }}
        transition={{ duration: 0.35 }}
      />

      <rect
        x={CX - RESULT.w / 2}
        y={RESULT.y}
        width={RESULT.w}
        height={RESULT.h}
        rx={5}
        fill="var(--bg-elev)"
        stroke="var(--cool)"
        strokeWidth="1.5"
      />
      <text
        x={CX}
        y={RESULT.y + 24}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="13"
        fill="var(--cool)"
        letterSpacing="0.04em"
      >
        отчёт
      </text>

      {/* ================= step 2 ================= */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={CX - 214}
          y={488}
          width={428}
          height={42}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={CX}
          y={514}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          тщательность — параметр, а не переписывание
        </text>
      </motion.g>
    </svg>
  );
}

export const budgetSlide: Slide = {
  id: 'budget',
  title: 'ручка бюджета',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.4fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия графов · 23</Eyebrow>
          <SlideTitle size="md">Ручка бюджета</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Быстрая проверка и глубокий аудит — один и тот же граф.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Разница — положение ручки: сколько независимых взглядов купить.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Цена мышления впервые стала настраиваемой. Пользуйся.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <BudgetDiagram step={step} />
        </div>
      }
    />
  ),
};
