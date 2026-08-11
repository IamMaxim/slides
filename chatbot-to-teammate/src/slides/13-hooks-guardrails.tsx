import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const RING_C = { x: 290, y: 216 };
const RING_R = 138;

const NODE_R = 56;
const MODEL = { x: RING_C.x, y: RING_C.y - RING_R };
const TOOL = { x: RING_C.x, y: RING_C.y + RING_R };

/** Hooks sit on the path itself, one before the tool call and one after.
 *  Square and hard-edged on purpose: the round nodes are the stochastic part. */
const HOOK_W = 150;
const HOOK_H = 52;
const PRE = { x: RING_C.x + RING_R, y: RING_C.y };
const POST = { x: RING_C.x - RING_R, y: RING_C.y };

const RING_ARROWS = [-45, 45, 135, 225];

function RoundNode({
  at,
  label,
  sub,
  color,
  size = 18,
}: {
  at: { x: number; y: number };
  label: string;
  sub: string;
  color: string;
  size?: number;
}) {
  return (
    <g>
      <circle cx={at.x} cy={at.y} r={NODE_R} fill="var(--bg-elev)" stroke={color} strokeWidth="1.5" />
      <text
        x={at.x}
        y={at.y - 2}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize={size}
        fill={color}
      >
        {label}
      </text>
      <text
        x={at.x}
        y={at.y + 17}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--ink-mute)"
        letterSpacing="0.06em"
      >
        {sub}
      </text>
    </g>
  );
}

/** A deterministic block clamped onto the loop. Squares, no radius, no doubt. */
function HookBlock({ at, label, sub }: { at: { x: number; y: number }; label: string; sub: string }) {
  return (
    <g>
      <rect
        x={at.x - HOOK_W / 2}
        y={at.y - HOOK_H / 2}
        width={HOOK_W}
        height={HOOK_H}
        fill="var(--bg-elev)"
        stroke="var(--cool)"
        strokeWidth="1.8"
      />
      <text
        x={at.x}
        y={at.y - 4}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="14"
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

function RailsDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* the loop, unchanged from the era slide — just simplified */}
      <circle
        cx={RING_C.x}
        cy={RING_C.y}
        r={RING_R}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.2"
        opacity="0.65"
      />
      {RING_ARROWS.map((d) => {
        const th = (d * Math.PI) / 180;
        return (
          <polygon
            key={d}
            points="-6,-5 6,0 -6,5"
            fill="var(--ink-soft)"
            opacity="0.75"
            transform={`translate(${RING_C.x + Math.cos(th) * RING_R} ${RING_C.y + Math.sin(th) * RING_R}) rotate(${d + 90})`}
          />
        );
      })}
      {/* ambient: the loop keeps turning whatever step we are on */}
      <motion.g
        initial={false}
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${RING_C.x}px ${RING_C.y}px` }}
      >
        <circle cx={RING_C.x} cy={RING_C.y - RING_R} r={6} fill="var(--accent)" />
      </motion.g>

      {/* the stochastic half: a soft, restless ring around the model */}
      <motion.circle
        cx={MODEL.x}
        cy={MODEL.y}
        r={NODE_R + 11}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeDasharray="3 7"
        opacity="0.5"
        initial={false}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${MODEL.x}px ${MODEL.y}px` }}
      />
      <RoundNode at={MODEL} label="модель" sub="стохастика" color="var(--accent)" />
      <RoundNode at={TOOL} label="инструмент" sub="правка, запуск" color="var(--ink-soft)" size={15} />

      {/* step 0: the pre-hook snaps onto the path, before the tool call */}
      <motion.g
        initial={{ opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.34, 1.5, 0.64, 1] }}
        style={{ transformOrigin: `${PRE.x}px ${PRE.y}px` }}
      >
        <HookBlock at={PRE} label="pre-hook" sub="запрет push в main" />
      </motion.g>

      {/* step 1: and the post-hook, after it */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.72 }}
        transition={{ duration: 0.45, ease: [0.34, 1.5, 0.64, 1] }}
        style={{ transformOrigin: `${POST.x}px ${POST.y}px` }}
      >
        <HookBlock at={POST} label="post-hook" sub="lint --fix" />
      </motion.g>

      {/* step 2: the principle the rest of the talk runs on */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 225}
          y={434}
          width={450}
          height={42}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={460}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          детерминизм — где можно, интеллект — где нужно
        </text>
      </motion.g>
    </svg>
  );
}

export const hooksGuardrailsSlide: Slide = {
  id: 'hooks-guardrails',
  title: 'детерминированные рельсы',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия циклов · 13</Eyebrow>
          <SlideTitle size="md">Детерминированные рельсы</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Хуки срабатывают всегда. Не „модель обычно слушается“, а „система не позволит иначе“.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Форматирование, запреты, авто-проверки — рельсы вокруг стохастической модели.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Это главный принцип всей второй половины доклада. Запомни его.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RailsDiagram step={step} />
        </div>
      }
    />
  ),
};
