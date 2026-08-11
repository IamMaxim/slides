import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

/** Wider than 580: the ladder from slide 8 plus a labelled validation meter. */
const W = 640;
const H = 500;

const RUNGS = [
  { level: 'L0', label: 'подсказки', sub: 'решение всегда твоё' },
  { level: 'L1', label: 'правки под присмотром', sub: 'ты видишь каждый диф' },
  { level: 'L2', label: 'агент открывает MR', sub: 'работает сам, мержишь ты' },
  { level: 'L3', label: 'авто-мерж для low-risk', sub: 'зависимости, типовой CRUD' },
];

const RUNG_H = 68;
const RUNG_GAP = 10;
const RUNG_X = 32;
const RUNG_W = 356;
const LADDER_BOTTOM = 398;
/** L0 sits at the bottom; the index climbs. */
const rungY = (i: number) => LADDER_BOTTOM - RUNG_H - i * (RUNG_H + RUNG_GAP);

const RAIL_L = 20;
const RAIL_R = 400;
const LADDER_TOP = rungY(RUNGS.length - 1);

const LOCK_CX = 356;

const METER_X = 430;
const METER_W = 42;
const METER_TOP = LADDER_TOP;
const METER_BOTTOM = LADDER_BOTTOM;
const METER_H = METER_BOTTOM - METER_TOP;

/** What has to be true before the next lock can open. Slide 8's ladder, stacked. */
const STACK = ['типы', 'линтеры', 'тесты', 'адверсариальное ревью'];
const NOTCH = METER_H / STACK.length;

/** A padlock: body plus a shackle that swings open on its right foot. */
function Lock({ cy, open }: { cy: number; open: boolean }) {
  const color = open ? 'var(--cool)' : 'var(--ink-mute)';
  return (
    <g>
      {/* The shackle has to swing on its right foot, but framer pivots SVG on the
          element's own fill-box centre. The unpainted circle is a counterweight:
          it makes the group's bounding box symmetric about that foot. */}
      <motion.g
        initial={false}
        animate={{ rotate: open ? -34 : 0, y: open ? -3 : 0 }}
        transition={{ duration: 0.5, ease: [0.34, 1.35, 0.64, 1] }}
      >
        <circle cx={LOCK_CX + 7} cy={cy} r={14} fill="none" stroke="none" />
        <motion.path
          d={`M ${LOCK_CX - 7} ${cy} L ${LOCK_CX - 7} ${cy - 7} A 7 7 0 0 1 ${LOCK_CX + 7} ${cy - 7} L ${LOCK_CX + 7} ${cy}`}
          fill="none"
          strokeWidth="1.6"
          strokeLinecap="round"
          initial={false}
          animate={{ stroke: color }}
          transition={{ duration: 0.5 }}
        />
      </motion.g>
      <motion.rect
        x={LOCK_CX - 11}
        y={cy}
        width={22}
        height={17}
        rx={3}
        fill="var(--bg-elev)"
        strokeWidth="1.5"
        initial={false}
        animate={{ stroke: color }}
        transition={{ duration: 0.5 }}
      />
    </g>
  );
}

function TrustDiagram({ step }: { step: number }) {
  const filled = Math.min(step + 1, STACK.length);
  const fillH = filled * NOTCH;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 700 }}>
      {/* rails: the whole ladder is visible from the start — you just cannot climb it yet */}
      <line x1={RAIL_L} y1={LADDER_TOP - 12} x2={RAIL_L} y2={LADDER_BOTTOM + 12} stroke="var(--line)" strokeWidth="1" />
      <line x1={RAIL_R} y1={LADDER_TOP - 12} x2={RAIL_R} y2={LADDER_BOTTOM + 12} stroke="var(--line)" strokeWidth="1" />

      {RUNGS.map((r, i) => {
        const y = rungY(i);
        const cy = y + RUNG_H / 2;
        const open = step >= i;
        const current = step === i;
        return (
          <g key={r.level}>
            <motion.rect
              x={RUNG_X}
              y={y}
              width={RUNG_W}
              height={RUNG_H}
              rx={6}
              fill="var(--bg-elev)"
              strokeWidth="1.2"
              initial={false}
              animate={{ stroke: current ? 'var(--accent)' : 'var(--line)', opacity: open ? 1 : 0.45 }}
              transition={{ duration: 0.45 }}
            />
            <motion.text
              x={RUNG_X + 22}
              y={cy + 5}
              fontFamily="var(--mono)"
              fontSize="15"
              letterSpacing="0.06em"
              initial={false}
              animate={{ fill: open ? 'var(--cool)' : 'var(--ink-mute)' }}
              transition={{ duration: 0.45 }}
            >
              {r.level}
            </motion.text>
            <motion.text
              x={RUNG_X + 62}
              y={cy - 4}
              fontFamily="var(--mono)"
              fontSize="15"
              letterSpacing="0.04em"
              initial={false}
              animate={{ fill: current ? 'var(--accent)' : open ? 'var(--ink)' : 'var(--ink-mute)' }}
              transition={{ duration: 0.45 }}
            >
              {r.label}
            </motion.text>
            <motion.text
              x={RUNG_X + 62}
              y={cy + 17}
              fontFamily="var(--mono)"
              fontSize="11"
              fill="var(--ink-mute)"
              letterSpacing="0.02em"
              initial={false}
              animate={{ opacity: open ? 1 : 0.4 }}
              transition={{ duration: 0.45 }}
            >
              {r.sub}
            </motion.text>
            <Lock cy={cy - 4} open={open} />
          </g>
        );
      })}

      {/* ---- what actually opens them ---- */}
      <text
        x={METER_X + METER_W / 2}
        y={METER_TOP - 30}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--ink-mute)"
        letterSpacing="0.1em"
      >
        СТЕК
      </text>
      <text
        x={METER_X + METER_W / 2}
        y={METER_TOP - 16}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--ink-mute)"
        letterSpacing="0.1em"
      >
        ПРОВЕРОК
      </text>
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
        fill="var(--cool)"
        opacity="0.62"
        initial={false}
        animate={{ y: METER_BOTTOM - fillH - 1, height: fillH }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      />
      {STACK.map((s, i) => {
        const notchY = METER_BOTTOM - i * NOTCH;
        return (
          <g key={s}>
            {i > 0 && (
              <line
                x1={METER_X}
                y1={notchY}
                x2={METER_X + METER_W}
                y2={notchY}
                stroke="var(--bg)"
                strokeWidth="1.2"
                opacity="0.7"
              />
            )}
            <motion.text
              x={METER_X + METER_W + 12}
              y={notchY - NOTCH / 2 + 4}
              fontFamily="var(--mono)"
              fontSize="10"
              letterSpacing="0.04em"
              initial={false}
              animate={{ fill: step >= i ? 'var(--cool)' : 'var(--ink-mute)', opacity: step >= i ? 1 : 0.45 }}
              transition={{ duration: 0.45 }}
            >
              {s}
            </motion.text>
          </g>
        );
      })}
      <text
        x={METER_X + METER_W / 2}
        y={METER_BOTTOM + 20}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="12"
        fill="var(--cool)"
        letterSpacing="0.06em"
      >
        {filled}/{STACK.length}
      </text>

      {/* ---- step 4: what the level is actually granted to ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 214}
          y={430}
          width={428}
          height={52}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={452}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.02em"
        >
          уровень выдаётся классу задач, а не агенту
        </text>
        <text
          x={W / 2}
          y={471}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.02em"
        >
          открывает его зрелость валидации, не вайбы
        </text>
      </motion.g>
    </svg>
  );
}

export const trustLadderSlide: Slide = {
  id: 'trust-ladder',
  title: 'лестница доверия',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.3fr"
      left={
        <Stack gap={20}>
          <Eyebrow>агентная команда · 28</Eyebrow>
          <SlideTitle size="md">Лестница доверия</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>L0 — агент подсказывает. Решение всегда твоё.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>L1 — правки под присмотром: ты видишь каждый диф до применения.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>L2 — агент работает сам и открывает MR. Мержишь по-прежнему ты.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                L3 — авто-мерж для low-risk: зависимости обновить, типовой CRUD — с прогоном полного стека
                проверок.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Уровень выдаётся классу задач, а не агенту вообще. Открывает его зрелость валидации, не вайбы.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <TrustDiagram step={step} />
        </div>
      }
    />
  ),
};
