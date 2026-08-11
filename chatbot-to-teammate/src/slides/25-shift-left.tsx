import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

/** Wider than the deck default: the whole point is the *distance* an MR travels
 *  before it ever reaches a person, so the belt needs room to be long. */
const W = 760;
const H = 500;

const BELT_Y = 264;
const BAND_TOP = 256;
const BAND_H = 16;

const AGENT = { cx: 92, cy: BELT_Y, r: 46 };
const BELT_X0 = 138;
const BELT_X1 = 604;

/** Square, hard-edged blocks — the deterministic half, in slide 13's language.
 *  Narrower and tighter-packed than a naive even spread: the row has to clear
 *  its own footprint well before CARD_DESK, or the parked card paints over
 *  the last gate instead of resting clean at the human's desk. */
const GATE_W = 72;
const GATE_TOP = 216;
const GATE_H = 96;
const GATES = [
  { cx: 196, label: 'lint', sub: 'стиль', at: 0 },
  { cx: 292, label: 'типы', sub: 'форма', at: 1 },
  { cx: 388, label: 'тесты', sub: 'поведение', at: 1 },
  { cx: 484, label: 'само-ревью', sub: 'свой диф', at: 2 },
];

const DESK_CX = 662;

/** Conveyor ticks: one spacing of travel, then wrap. */
const TICK_GAP = 26;
const TICKS = (() => {
  const xs: number[] = [];
  for (let x = BELT_X0 - TICK_GAP; x < BELT_X1 + TICK_GAP; x += TICK_GAP) xs.push(x);
  return xs;
})();

/* ---------------------------------------------------------------------------
 * One life of one merge request, on a loop:
 * roll out → rejected by `lint` → back to the agent → fixed → through every
 * gate → parked on the human's desk. Times are shared by every element that
 * takes part, so the card, the red flash and the colour swaps stay in step.
 * ------------------------------------------------------------------------- */
const RUN_DURATION = 11;
const RUN_TIMES = [0, 0.06, 0.12, 0.17, 0.3, 0.36, 0.44, 0.8, 0.86, 0.94, 1];
const CARD_START = 168;
const CARD_DESK = 580;
const RUN_X = [
  CARD_START,
  CARD_START,
  GATES[0].cx,
  GATES[0].cx,
  CARD_START,
  CARD_START,
  CARD_START,
  GATES[3].cx,
  CARD_DESK,
  CARD_DESK,
  CARD_DESK,
];
const RUN_OPACITY = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0];
/** Which skin of the card is showing: plain, rejected, machine-approved. */
const SKIN_PLAIN = [1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0];
const SKIN_WARN = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0];
const SKIN_COOL = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1];
/** The gate that says no, saying it. */
const FLASH = [0, 0, 0, 1, 0.55, 0, 0, 0, 0, 0, 0];

const runLoop = (times: number[]) => ({
  duration: RUN_DURATION,
  times,
  repeat: Infinity,
  ease: 'linear' as const,
});

function MRCardSkin({ stroke, fill }: { stroke: string; fill: string }) {
  return (
    <>
      <rect x={-28} y={-15} width={56} height={30} rx={4} fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x={-19} y={-8} width={26} height={3} rx={1.5} fill={stroke} opacity="0.75" />
      <rect x={-19} y={-1} width={38} height={3} rx={1.5} fill={stroke} opacity="0.55" />
      <rect x={-19} y={6} width={18} height={3} rx={1.5} fill={stroke} opacity="0.4" />
    </>
  );
}

function ConveyorDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 820 }}>
      <defs>
        <marker id="s25-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
        <clipPath id="s25-belt">
          <rect x={BELT_X0} y={BAND_TOP} width={BELT_X1 - BELT_X0} height={BAND_H} />
        </clipPath>
      </defs>

      {/* ---- the agent's own loop: where the validation now lives ---- */}
      <text
        x={AGENT.cx}
        y={AGENT.cy + 1}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="16"
        fill="var(--ink-soft)"
      >
        агент
      </text>
      <text
        x={AGENT.cx}
        y={AGENT.cy + 19}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        цикл
      </text>
      {/* The ring travels *inside* the rotating group on purpose: framer builds
          its own transform-origin for SVG (fill-box, 50% 50%), so a group that
          held only the dot would spin the dot on its own centre and never orbit.
          With the ring in the group the bounding box is the ring, so its centre
          is the pivot — and rotating a circle about its centre is invisible. */}
      <motion.g
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx={AGENT.cx} cy={AGENT.cy} r={AGENT.r} fill="none" stroke="var(--ink-soft)" strokeWidth="1.2" opacity="0.8" />
        <circle cx={AGENT.cx} cy={AGENT.cy - AGENT.r} r={5} fill="var(--accent)" />
      </motion.g>

      {/* ---- the belt ---- */}
      <rect
        x={BELT_X0}
        y={BAND_TOP}
        width={BELT_X1 - BELT_X0}
        height={BAND_H}
        fill="var(--bg-elev)"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <g clipPath="url(#s25-belt)">
        <motion.g
          // ambient: initial = first keyframe, else a prod build never starts the loop
          initial={{ x: 0 }}
          animate={{ x: TICK_GAP }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        >
          {TICKS.map((x) => (
            <line key={x} x1={x} y1={BAND_TOP} x2={x} y2={BAND_TOP + BAND_H} stroke="var(--line)" strokeWidth="1" />
          ))}
        </motion.g>
      </g>

      {/* ---- the gates, one (or two) per step ---- */}
      {GATES.map((g) => {
        const on = step >= g.at;
        return (
          <motion.g
            key={g.label}
            initial={false}
            animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.74 }}
            transition={{ duration: 0.45, ease: [0.34, 1.45, 0.64, 1] }}
            style={{ transformOrigin: `${g.cx}px ${BELT_Y}px` }}
          >
            <rect
              x={g.cx - GATE_W / 2}
              y={GATE_TOP}
              width={GATE_W}
              height={GATE_H}
              fill="var(--bg-elev)"
              stroke="var(--cool)"
              strokeWidth="1.8"
            />
            <text
              x={g.cx}
              y={GATE_TOP - 12}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="13"
              fill="var(--cool)"
              letterSpacing="0.04em"
            >
              {g.label}
            </text>
            <text
              x={g.cx}
              y={GATE_TOP + GATE_H + 22}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="10"
              fill="var(--ink-mute)"
              letterSpacing="0.04em"
            >
              {g.sub}
            </text>
          </motion.g>
        );
      })}

      {/* the first gate saying no, in sync with the card that it turns back */}
      <motion.rect
        x={GATES[0].cx - GATE_W / 2}
        y={GATE_TOP}
        width={GATE_W}
        height={GATE_H}
        fill="color-mix(in srgb, var(--warn) 12%, transparent)"
        stroke="var(--warn)"
        strokeWidth="1.8"
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ opacity: FLASH[0] }}
        animate={{ opacity: FLASH }}
        transition={runLoop(RUN_TIMES)}
      />

      {/* ---- rejected work goes back into the loop, not into a person ---- */}
      <path
        d={`M ${GATES[0].cx} ${GATE_TOP + GATE_H + 32} C ${GATES[0].cx - 16} 392, ${AGENT.cx + 34} 392, ${AGENT.cx} ${
          AGENT.cy + AGENT.r + 6
        }`}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.2"
        strokeDasharray="4 5"
        opacity="0.75"
        markerEnd="url(#s25-arr)"
      />
      <text x={152} y={404} fontFamily="var(--mono)" fontSize="11" fill="var(--ink-soft)" letterSpacing="0.04em">
        агент чинит и приходит снова
      </text>

      {/* ---- the merge request, living its whole life on a loop ---- */}
      <motion.g
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ x: RUN_X[0], opacity: RUN_OPACITY[0] }}
        animate={{ x: RUN_X, opacity: RUN_OPACITY }}
        transition={{ x: runLoop(RUN_TIMES), opacity: runLoop(RUN_TIMES) }}
      >
        <g transform={`translate(0 ${BAND_TOP - 15})`}>
          <motion.g initial={{ opacity: SKIN_PLAIN[0] }} animate={{ opacity: SKIN_PLAIN }} transition={runLoop(RUN_TIMES)}>
            <MRCardSkin stroke="var(--ink-soft)" fill="var(--bg-elev)" />
          </motion.g>
          <motion.g initial={{ opacity: SKIN_WARN[0] }} animate={{ opacity: SKIN_WARN }} transition={runLoop(RUN_TIMES)}>
            <MRCardSkin stroke="var(--warn)" fill="color-mix(in srgb, var(--warn) 12%, var(--bg-elev))" />
          </motion.g>
          <motion.g initial={{ opacity: SKIN_COOL[0] }} animate={{ opacity: SKIN_COOL }} transition={runLoop(RUN_TIMES)}>
            <MRCardSkin stroke="var(--cool)" fill="color-mix(in srgb, var(--cool) 14%, var(--bg-elev))" />
          </motion.g>
        </g>
      </motion.g>

      {/* ---- the desk at the end of the belt ---- */}
      <circle cx={DESK_CX} cy={168} r={15} fill="none" stroke="var(--ink-soft)" strokeWidth="1.4" />
      <path
        d={`M ${DESK_CX - 28} 210 A 28 28 0 0 1 ${DESK_CX + 28} 210`}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <rect x={DESK_CX - 52} y={216} width={104} height={48} rx={5} fill="var(--bg-elev)" stroke="var(--line)" strokeWidth="1" />
      <rect x={DESK_CX - 40} y={228} width={44} height={4} rx={2} fill="var(--ink-soft)" opacity="0.5" />
      <rect x={DESK_CX - 40} y={239} width={62} height={4} rx={2} fill="var(--ink-soft)" opacity="0.35" />
      <rect x={DESK_CX - 40} y={250} width={30} height={4} rx={2} fill="var(--ink-soft)" opacity="0.25" />
      <line x1={DESK_CX - 62} y1={272} x2={DESK_CX + 62} y2={272} stroke="var(--ink-soft)" strokeWidth="1.4" opacity="0.6" />

      {/* ---- step 3: what actually lands in front of the human ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -6 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={DESK_CX - 76}
          y={288}
          width={152}
          height={26}
          rx={13}
          fill="color-mix(in srgb, var(--cool) 18%, var(--bg-elev))"
          stroke="var(--cool)"
          strokeWidth="1.2"
        />
        <text
          x={DESK_CX}
          y={305}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--cool)"
          letterSpacing="0.04em"
        >
          ✓ проверено машиной
        </text>
        <text
          x={DESK_CX}
          y={336}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="9"
          fill="var(--ink-soft)"
          letterSpacing="0.04em"
        >
          архитектура · смысл · вкус
        </text>
      </motion.g>

      {/* ---- step 4: the rule ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 168}
          y={430}
          width={336}
          height={42}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={456}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          машина отклоняет — человек судит
        </text>
      </motion.g>
    </svg>
  );
}

export const shiftLeftSlide: Slide = {
  id: 'shift-left',
  title: 'валидация до человека',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.5fr"
      left={
        <Stack gap={20}>
          <Eyebrow>агентная команда · 25</Eyebrow>
          <SlideTitle size="md">Валидация до человека</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Валидацию — внутрь цикла агента, до MR.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Каждый гейт детерминирован: красный — агент чинит сам и приходит снова. Человек об этом даже
                не узнаёт.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Последний гейт — само-ревью: агент читает свой диф первым.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>Человеку достаётся суждение: архитектура, смысл, вкус.</BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Не трать человеческое ревью на то, что могла отклонить машина.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ConveyorDiagram step={step} />
        </div>
      }
    />
  ),
};
