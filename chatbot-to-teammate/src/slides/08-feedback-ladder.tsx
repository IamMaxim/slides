import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

/** Bottom-up: cheapest, fastest signal first. One rung per step. */
const RUNGS: { label: string; tag: string }[] = [
  { label: 'компилятор', tag: 'есть/нет' },
  { label: 'типы', tag: 'форма' },
  { label: 'линтер', tag: 'стиль' },
  { label: 'unit-тесты', tag: 'поведение' },
  { label: 'integration', tag: 'сборка' },
  { label: 'телеметрия', tag: 'прод' },
];

const RUNG_H = 58;
const RUNG_GAP = 8;
const RUNG_X = 38;
const RUNG_W = 368;
const LADDER_BOTTOM = 478;
/** Rung 0 sits at the bottom; index grows upward. */
const rungY = (i: number) => LADDER_BOTTOM - RUNG_H - i * (RUNG_H + RUNG_GAP);

const RAIL_L = 26;
const RAIL_R = 418;
const LADDER_TOP = rungY(RUNGS.length - 1);

const METER_X = 476;
const METER_W = 60;
const METER_TOP = LADDER_TOP;
const METER_BOTTOM = LADDER_BOTTOM;
const METER_H = METER_BOTTOM - METER_TOP;
const NOTCH = METER_H / RUNGS.length;

const TAG_SIZE = 12;
const TAG_CH = TAG_SIZE * 0.66;
const TAG_H = 24;
const TAG_RIGHT = RUNG_X + RUNG_W - 20;

function LadderDiagram({ step }: { step: number }) {
  const filled = Math.min(step + 1, RUNGS.length);
  const fillH = filled * NOTCH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* rails: the ladder exists whether or not you climbed it */}
      <line x1={RAIL_L} y1={LADDER_TOP - 12} x2={RAIL_L} y2={LADDER_BOTTOM + 12} stroke="var(--line)" strokeWidth="1" />
      <line x1={RAIL_R} y1={LADDER_TOP - 12} x2={RAIL_R} y2={LADDER_BOTTOM + 12} stroke="var(--line)" strokeWidth="1" />

      {RUNGS.map((r, i) => {
        const y = rungY(i);
        const shown = step >= i;
        const current = step === i;
        const tagW = r.tag.length * TAG_CH + 20;
        return (
          <motion.g
            key={r.label}
            initial={false}
            animate={{ opacity: shown ? 1 : 0, x: shown ? 0 : -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.rect
              x={RUNG_X}
              y={y}
              width={RUNG_W}
              height={RUNG_H}
              rx={6}
              fill="var(--bg-elev)"
              strokeWidth="1.2"
              initial={false}
              animate={{ stroke: current ? 'var(--accent)' : 'var(--line)' }}
              transition={{ duration: 0.4 }}
            />
            <motion.text
              x={RUNG_X + 24}
              y={y + RUNG_H / 2 + 6}
              fontFamily="var(--mono)"
              fontSize="16"
              letterSpacing="0.04em"
              initial={false}
              animate={{ fill: current ? 'var(--accent)' : 'var(--ink)' }}
              transition={{ duration: 0.4 }}
            >
              {r.label}
            </motion.text>
            <rect
              x={TAG_RIGHT - tagW}
              y={y + (RUNG_H - TAG_H) / 2}
              width={tagW}
              height={TAG_H}
              rx={4}
              fill="none"
              stroke="var(--line)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <text
              x={TAG_RIGHT - tagW / 2}
              y={y + RUNG_H / 2 + 4}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize={TAG_SIZE}
              fill="var(--ink-mute)"
              letterSpacing="0.04em"
            >
              {r.tag}
            </text>
          </motion.g>
        );
      })}

      {/* ---- the autonomy meter: one notch per rung the agent can reach ---- */}
      <rect
        x={METER_X}
        y={METER_TOP}
        width={METER_W}
        height={METER_H}
        rx={5}
        fill="var(--bg-elev)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <motion.rect
        x={METER_X + 1}
        width={METER_W - 2}
        rx={4}
        fill="var(--accent)"
        opacity="0.72"
        initial={false}
        animate={{ y: METER_BOTTOM - fillH - 1, height: fillH }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      />
      {RUNGS.slice(1).map((_, i) => (
        <line
          key={i}
          x1={METER_X}
          y1={METER_BOTTOM - (i + 1) * NOTCH}
          x2={METER_X + METER_W}
          y2={METER_BOTTOM - (i + 1) * NOTCH}
          stroke="var(--bg)"
          strokeWidth="1.2"
          opacity="0.7"
        />
      ))}
      <text
        x={556}
        y={(METER_TOP + METER_BOTTOM) / 2}
        transform={`rotate(-90 556 ${(METER_TOP + METER_BOTTOM) / 2})`}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-mute)"
        letterSpacing="0.18em"
      >
        АВТОНОМИЯ
      </text>
      <text
        x={METER_X + METER_W / 2}
        y={METER_TOP - 14}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="13"
        fill="var(--accent)"
        letterSpacing="0.06em"
      >
        {filled}/{RUNGS.length}
      </text>
    </svg>
  );
}

export const feedbackLadderSlide: Slide = {
  id: 'feedback-ladder',
  title: 'лестница обратной связи',
  totalSteps: 6,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия циклов · 8</Eyebrow>
          <SlideTitle size="md">Лестница обратной связи</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Каждая ступень — сигнал, который агент видит сам.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Нетипизированный код и медленные тесты — это гандикап для агента, а не просто техдолг.
              </BodyText>
            </Build>
            <Build step={step} appearAt={5}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Сколько ступеней доступно агенту — столько автономии ты можешь ему дать.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LadderDiagram step={step} />
        </div>
      }
    />
  ),
};
