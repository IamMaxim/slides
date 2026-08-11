import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const AX_L = 26;
const AX_R = 554;
const CURVE_TOP = 76;
const CURVE_BOT = 244;
const Q_HIGH = 100;

const BAR_Y = 296;
const BAR_H = 48;
const TASK_X = 132;
const RESTART_X = 410;

/** One shared x-axis: how far the session has run. The bar below says what is
 *  in the context at that point; the curve above says what it is worth. */
const DEBRIS: { label: string; x0: number; x1: number }[] = [
  { label: 'старые диффы', x0: TASK_X, x1: 244 },
  { label: 'логи', x0: 244, x1: 330 },
  { label: 'тупики', x0: 330, x1: RESTART_X },
];

const CURVE_FLAT = `M ${AX_L} ${Q_HIGH} L ${TASK_X} 104`;
const CURVE_DECAY = `M ${TASK_X} 104 C 232 110, 320 158, ${RESTART_X} 204`;
/** The vertical leg is the restart: quality does not recover, it is reset. */
const CURVE_RESET = `M ${RESTART_X} 204 L ${RESTART_X} 102 L ${AX_R} 106`;

function ContextDiagram({ step }: { step: number }) {
  const restarted = step >= 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- the quality curve ---- */}
      <text x={AX_L} y={62} fontFamily="var(--mono)" fontSize="11" fill="var(--ink-mute)" letterSpacing="0.18em">
        КАЧЕСТВО
      </text>
      <line x1={AX_L} y1={CURVE_TOP} x2={AX_L} y2={CURVE_BOT} stroke="var(--line)" strokeWidth="1" />
      <line
        x1={AX_L}
        y1={Q_HIGH}
        x2={AX_R}
        y2={Q_HIGH}
        stroke="var(--line)"
        strokeWidth="1"
        strokeDasharray="2 6"
      />
      <line x1={AX_L} y1={CURVE_BOT} x2={AX_R} y2={CURVE_BOT} stroke="var(--line)" strokeWidth="1" />

      <path d={CURVE_FLAT} fill="none" stroke="var(--accent)" strokeWidth="1.8" strokeLinecap="round" />
      <motion.path
        d={CURVE_DECAY}
        fill="none"
        stroke="var(--warn)"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: step >= 1 ? 1 : 0, opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.path
        d={CURVE_RESET}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        initial={false}
        animate={{ pathLength: restarted ? 1 : 0, opacity: restarted ? 1 : 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* ---- the context window ---- */}
      <rect
        x={AX_L}
        y={BAR_Y}
        width={AX_R - AX_L}
        height={BAR_H}
        rx={5}
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
      />

      <rect
        x={AX_L}
        y={BAR_Y}
        width={TASK_X - AX_L}
        height={BAR_H}
        rx={5}
        fill="var(--accent-soft)"
        stroke="var(--accent-line)"
        strokeWidth="1"
      />
      <text
        x={(AX_L + TASK_X) / 2}
        y={BAR_Y + BAR_H / 2 + 4}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--accent)"
        letterSpacing="0.06em"
      >
        задача
      </text>

      {DEBRIS.map((d, i) => (
        <motion.g
          key={d.label}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: step >= 1 ? i * 0.1 : 0 }}
        >
          <rect
            x={d.x0}
            y={BAR_Y}
            width={d.x1 - d.x0}
            height={BAR_H}
            fill="var(--line-soft)"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <text
            x={(d.x0 + d.x1) / 2}
            y={BAR_Y + BAR_H / 2 + 4}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="11"
            fill="var(--ink-mute)"
            letterSpacing="0.06em"
          >
            {d.label}
          </text>
        </motion.g>
      ))}

      {/* ---- step 2: the restart ---- */}
      <motion.g initial={false} animate={{ opacity: restarted ? 1 : 0 }} transition={{ duration: 0.45 }}>
        <line
          x1={RESTART_X}
          y1={CURVE_TOP}
          x2={RESTART_X}
          y2={BAR_Y + BAR_H + 8}
          stroke="var(--accent)"
          strokeWidth="1"
          strokeDasharray="4 5"
          opacity="0.8"
        />
        <text
          x={RESTART_X}
          y={62}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          перезапуск
        </text>
        <rect
          x={RESTART_X}
          y={BAR_Y}
          width={AX_R - RESTART_X}
          height={BAR_H}
          rx={5}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={(RESTART_X + AX_R) / 2}
          y={BAR_Y + BAR_H / 2 + 4}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          задача + выжимка
        </text>
      </motion.g>

      <text x={AX_L} y={BAR_Y + BAR_H + 26} fontFamily="var(--mono)" fontSize="11" fill="var(--ink-mute)" letterSpacing="0.08em">
        контекстное окно
      </text>

      {/* ---- step 3: the rule ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 146}
          y={418}
          width={292}
          height={40}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={443}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          одна задача = один контекст
        </text>
      </motion.g>
    </svg>
  );
}

export const contextHygieneSlide: Slide = {
  id: 'context-hygiene',
  title: 'гигиена контекста',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия циклов · 11</Eyebrow>
          <SlideTitle size="md">Гигиена контекста</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Длинная сессия накапливает мусор: тупики, старые логи, отменённые планы.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Мусор — это тоже промпт. Качество едет вниз.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Перезапуск с чистым контекстом дешевле, чем героическая сессия-марафон.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Помнишь compaction из первой части? Вот зачем он был нужен.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ContextDiagram step={step} />
        </div>
      }
    />
  ),
};
