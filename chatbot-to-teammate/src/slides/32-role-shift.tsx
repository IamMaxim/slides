import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const LOOP = { cx: 110, cy: 120, r: 66 };

/** Inside the loop, then outside it and twice the size. */
const INSIDE = { x: LOOP.cx, y: LOOP.cy, s: 0.85 };
const OUTSIDE = { x: 86, y: 330, s: 1.5 };

const PANEL = { x: 176, y: 258, w: 386, h: 146 };
const DIAL_CY = 322;
const DIAL_R = 30;
const DIALS = [
  { cx: 224, label: ['обратная', 'связь'], base: -46, swing: 12, period: 6.4 },
  { cx: 320, label: ['гейты'], base: 8, swing: 9, period: 7.8 },
  { cx: 416, label: ['бюджет'], base: -14, swing: 15, period: 5.6 },
  { cx: 512, label: ['граф'], base: 38, swing: 10, period: 8.6 },
];

/** A person, drawn around its own origin so it can be moved and scaled whole. */
function Figure({ color }: { color: string }) {
  return (
    <g>
      <circle cx={0} cy={-14} r={11} fill="none" stroke={color} strokeWidth="1.5" />
      <path d="M -19 16 A 19 19 0 0 1 19 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function RoleDiagram({ step }: { step: number }) {
  const out = step >= 1;
  const pos = out ? OUTSIDE : INSIDE;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s32-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
      </defs>

      {/* ---- the loop ---- */}
      <text
        x={LOOP.cx}
        y={LOOP.cy - LOOP.r - 16}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        цикл агента
      </text>
      {/* The ring rides inside the rotating group: framer builds its own
          transform-origin for SVG (fill-box, 50% 50%), so a group holding only
          the dot would spin it on its own centre instead of orbiting. With the
          ring inside, the bounding box — and the pivot — is the ring itself. */}
      <motion.g
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'linear' }}
      >
        <circle cx={LOOP.cx} cy={LOOP.cy} r={LOOP.r} fill="none" stroke="var(--ink-soft)" strokeWidth="1.3" opacity="0.8" />
        <circle cx={LOOP.cx} cy={LOOP.cy - LOOP.r} r={6} fill="var(--accent)" />
      </motion.g>
      <motion.text
        x={LOOP.cx}
        y={LOOP.cy + 5}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="17"
        fill="var(--ink-soft)"
        initial={false}
        animate={{ opacity: out ? 1 : 0 }}
        transition={{ duration: 0.5, delay: out ? 0.5 : 0 }}
      >
        крутится сам
      </motion.text>

      {/* ---- the panel of dials: the new working surface ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: out ? 1 : 0, y: out ? 0 : 16 }}
        transition={{ duration: 0.55, delay: out ? 0.35 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={PANEL.x}
          y={PANEL.y}
          width={PANEL.w}
          height={PANEL.h}
          rx={8}
          fill="var(--bg-elev)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text x={PANEL.x + 18} y={PANEL.y + 24} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.12em">
          ПАНЕЛЬ СРЕДЫ
        </text>
        <line
          x1={OUTSIDE.x + 30}
          y1={OUTSIDE.y}
          x2={PANEL.x - 6}
          y2={OUTSIDE.y}
          stroke="var(--ink-soft)"
          strokeWidth="1.2"
          strokeDasharray="4 5"
          opacity="0.7"
          markerEnd="url(#s32-arr)"
        />

        {DIALS.map((d) => (
          <g key={d.label.join(' ')}>
            {/* face and needle rotate together so the group's bounding box — and
                therefore framer's fill-box pivot — is the dial's own centre. */}
            <motion.g
              // ambient: initial = first keyframe, else a prod build never starts the loop
              initial={{ rotate: d.base - d.swing }}
              animate={{ rotate: [d.base - d.swing, d.base + d.swing, d.base - d.swing] }}
              transition={{ duration: d.period, repeat: Infinity, ease: 'easeInOut' }}
            >
              <circle cx={d.cx} cy={DIAL_CY} r={DIAL_R} fill="var(--bg)" stroke="var(--line)" strokeWidth="1.2" />
              <line
                x1={d.cx}
                y1={DIAL_CY}
                x2={d.cx}
                y2={DIAL_CY - DIAL_R + 8}
                stroke="var(--accent)"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </motion.g>
            {[-120, -60, 0, 60, 120].map((a) => {
              const th = ((a - 90) * Math.PI) / 180;
              return (
                <line
                  key={a}
                  x1={d.cx + Math.cos(th) * (DIAL_R - 6)}
                  y1={DIAL_CY + Math.sin(th) * (DIAL_R - 6)}
                  x2={d.cx + Math.cos(th) * (DIAL_R - 2)}
                  y2={DIAL_CY + Math.sin(th) * (DIAL_R - 2)}
                  stroke="var(--line)"
                  strokeWidth="1"
                />
              );
            })}
            <circle cx={d.cx} cy={DIAL_CY} r={3} fill="var(--accent)" />
            {d.label.map((ln, k) => (
              <text
                key={ln}
                x={d.cx}
                y={DIAL_CY + DIAL_R + 18 + k * 13}
                textAnchor="middle"
                fontFamily="var(--mono)"
                fontSize="10"
                fill="var(--ink-soft)"
                letterSpacing="0.04em"
              >
                {ln}
              </text>
            ))}
          </g>
        ))}
      </motion.g>

      {/* ---- the engineer, stepping out ---- */}
      {/* drawn around its own origin, so framer's fill-box centre is the figure */}
      <motion.g
        initial={false}
        animate={{ x: pos.x, y: pos.y, scale: pos.s }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <Figure color={out ? 'var(--accent)' : 'var(--ink-soft)'} />
      </motion.g>

      {/* ---- step 2: the whole talk in one line ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 220}
          y={430}
          width={440}
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
          ты больше не пишешь код
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
          ты проектируешь систему, которая его пишет
        </text>
      </motion.g>
    </svg>
  );
}

export const roleShiftSlide: Slide = {
  id: 'role-shift',
  title: 'инженер среды',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>агентная команда · 32</Eyebrow>
          <SlideTitle size="md">Инженер среды</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>В старой роли ты — внутри цикла: каждое изменение проходит через твои руки.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>В новой — снаружи: ты проектируешь среду, циклы и гейты.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Ты больше не пишешь код. Ты проектируешь систему, которая его пишет.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RoleDiagram step={step} />
        </div>
      }
    />
  ),
};
