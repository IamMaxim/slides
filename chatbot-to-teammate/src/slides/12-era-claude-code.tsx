import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

type Pt = { x: number; y: number };

const W = 580;
const H = 500;

const CORE: Pt = { x: 290, y: 218 };
const CORE_R = 62;

const ORBIT_R = 150;
const PILL_W = 104;
const PILL_H = 34;

/** The development environment, arranged around the terminal it now serves. */
const ENV: { label: string; deg: number }[] = [
  { label: 'тесты', deg: -90 },
  { label: 'MCP', deg: -18 },
  { label: 'суб-агенты', deg: 54 },
  { label: 'файлы', deg: 126 },
  { label: 'git', deg: 198 },
];

const ENV_POS: Pt[] = ENV.map((n) => ({
  x: CORE.x + Math.cos((n.deg * Math.PI) / 180) * ORBIT_R,
  y: CORE.y + Math.sin((n.deg * Math.PI) / 180) * ORBIT_R,
}));

/** Sized so every node pill sits inside: the loop encloses the whole environment. */
const RX = 232;
const RY = 178;

const LOOP_N = 72;
const LOOP_PTS: Pt[] = Array.from({ length: LOOP_N + 1 }, (_, i) => {
  const th = (i / LOOP_N) * Math.PI * 2;
  return { x: CORE.x + Math.cos(th) * RX, y: CORE.y + Math.sin(th) * RY };
});

/** Keyframe times proportional to arc length ⇒ the dot travels at one speed. */
const LOOP_T = (() => {
  const cum = [0];
  for (let i = 1; i < LOOP_PTS.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(LOOP_PTS[i].x - LOOP_PTS[i - 1].x, LOOP_PTS[i].y - LOOP_PTS[i - 1].y));
  }
  const total = cum[cum.length - 1];
  return cum.map((c) => c / total);
})();
const LOOP_X = LOOP_PTS.map((p) => p.x);
const LOOP_Y = LOOP_PTS.map((p) => p.y);

/** Tangent direction of the ellipse, for the direction arrowheads. */
function tangentDeg(deg: number) {
  const th = (deg * Math.PI) / 180;
  return (Math.atan2(RY * Math.cos(th), -RX * Math.sin(th)) * 180) / Math.PI;
}

function EnvironmentDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- step 2: the loop, redrawn around everything ---- */}
      <motion.ellipse
        cx={CORE.x}
        cy={CORE.y}
        rx={RX}
        ry={RY}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        initial={false}
        animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 0.85 : 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 0.85 : 0 }} transition={{ duration: 0.4, delay: step >= 2 ? 0.7 : 0 }}>
        {[0, 180].map((d) => {
          const th = (d * Math.PI) / 180;
          return (
            <polygon
              key={d}
              points="-6,-5 6,0 -6,5"
              fill="var(--accent)"
              transform={`translate(${CORE.x + Math.cos(th) * RX} ${CORE.y + Math.sin(th) * RY}) rotate(${tangentDeg(d)})`}
            />
          );
        })}
      </motion.g>
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4, delay: step >= 2 ? 0.8 : 0 }}>
        <motion.g
          initial={false}
          animate={{ x: LOOP_X, y: LOOP_Y }}
          transition={{ duration: 11, times: LOOP_T, repeat: Infinity, ease: 'linear' }}
        >
          <circle r={6} fill="var(--accent)" />
          <circle r={12} fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.3" />
        </motion.g>
      </motion.g>

      {/* ---- step 1: the environment reaches the terminal ---- */}
      {ENV_POS.map((p, i) => {
        const dx = p.x - CORE.x;
        const dy = p.y - CORE.y;
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;
        return (
          <motion.line
            key={ENV[i].label}
            x1={CORE.x + ux * (CORE_R + 3)}
            y1={CORE.y + uy * (CORE_R + 3)}
            x2={p.x - ux * 26}
            y2={p.y - uy * 26}
            stroke="var(--cool)"
            strokeWidth="1.2"
            initial={false}
            animate={{ opacity: step >= 1 ? 0.55 : 0 }}
            transition={{ duration: 0.35, delay: step >= 1 ? i * 0.06 : 0 }}
          />
        );
      })}

      {ENV_POS.map((p, i) => (
        <motion.g
          key={ENV[i].label}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.86 }}
          transition={{ duration: 0.4, delay: step >= 1 ? i * 0.06 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        >
          <rect
            x={p.x - PILL_W / 2}
            y={p.y - PILL_H / 2}
            width={PILL_W}
            height={PILL_H}
            rx={6}
            fill="var(--bg-elev)"
            stroke="var(--cool)"
            strokeWidth="1.3"
          />
          <text
            x={p.x}
            y={p.y + 5}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="14"
            fill="var(--cool)"
            letterSpacing="0.06em"
          >
            {ENV[i].label}
          </text>
        </motion.g>
      ))}

      {/* ---- the terminal, always there ---- */}
      <motion.circle
        cx={CORE.x}
        cy={CORE.y}
        r={CORE_R + 12}
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1"
        strokeDasharray="3 7"
        opacity="0.5"
        initial={false}
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${CORE.x}px ${CORE.y}px` }}
      />
      <circle cx={CORE.x} cy={CORE.y} r={CORE_R} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.6" />
      <text
        x={CORE.x}
        y={CORE.y - 2}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="19"
        fill="var(--accent)"
      >
        терминал
      </text>
      <text
        x={CORE.x}
        y={CORE.y + 18}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        claude code
      </text>

      {/* ---- step 3: the callback to part one ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 170}
          y={416}
          width={340}
          height={62}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={441}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          harness — из первой части.
        </text>
        <text
          x={W / 2}
          y={464}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          Теперь это поверхность инженерии.
        </text>
      </motion.g>
    </svg>
  );
}

export const eraClaudeCodeSlide: Slide = {
  id: 'era-claude-code',
  title: 'эра 4 · цикл размером со среду',
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Split
          ratio="1fr 1.2fr"
          left={
            <Stack gap={20}>
              <Eyebrow>история · 12</Eyebrow>
              <SlideTitle size="md">Эра 4: цикл размером со среду</SlideTitle>
              <Stack gap={14} style={{ marginTop: 12 }}>
                <Build step={step} appearAt={0}>
                  <BodyText>Claude Code и родня: агент живёт в терминале.</BodyText>
                </Build>
                <Build step={step} appearAt={1}>
                  <BodyText>Весь твой тулинг — его органы чувств.</BodyText>
                </Build>
                <Build step={step} appearAt={2}>
                  <BodyText>Цикл теперь проходит через всю среду разработки.</BodyText>
                </Build>
                <Build step={step} appearAt={3}>
                  <BodyText>
                    <span style={{ color: 'var(--ink)' }}>
                      Дальше вопрос не „умная ли модель“, а „что мы встроили в её цикл“.
                    </span>
                  </BodyText>
                </Build>
              </Stack>
            </Stack>
          }
          right={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EnvironmentDiagram step={step} />
            </div>
          }
        />
      </div>
      {/* deck spine: same footer slot on every era slide */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <EraTimeline compact current={3} />
      </div>
    </div>
  ),
};
