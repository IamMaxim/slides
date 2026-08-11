import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

type Pt = { x: number; y: number };

const MODEL: Pt = { x: 290, y: 104 };
const MODEL_R = 50;

const TOOLS: { label: string; at: Pt }[] = [
  { label: 'edit', at: { x: 118, y: 206 } },
  { label: 'run', at: { x: 290, y: 206 } },
  { label: 'read', at: { x: 462, y: 206 } },
];
const PILL_W = 104;
const PILL_H = 34;

/** The loop, as a triangle the dot can actually travel: straight sides only,
 *  so the circulating dot never cuts a corner. */
const A: Pt = { x: 290, y: 288 }; // предложил
const B: Pt = { x: 448, y: 412 }; // посмотрел
const C: Pt = { x: 132, y: 412 }; // поправил
const SIDES: [Pt, Pt][] = [
  [A, B],
  [B, C],
  [C, A],
];
const LEN = SIDES.map(([p, q]) => Math.hypot(q.x - p.x, q.y - p.y));
const TOTAL = LEN[0] + LEN[1] + LEN[2];
/** Keyframe times proportional to side length ⇒ constant speed around the loop. */
const DOT_TIMES = [0, LEN[0] / TOTAL, (LEN[0] + LEN[1]) / TOTAL, 1];

/** Shorten a segment at both ends so the arrowhead never sits on a vertex dot. */
function trim([p, q]: [Pt, Pt], by: number) {
  const ux = (q.x - p.x) / Math.hypot(q.x - p.x, q.y - p.y);
  const uy = (q.y - p.y) / Math.hypot(q.x - p.x, q.y - p.y);
  return {
    x1: p.x + ux * by,
    y1: p.y + uy * by,
    x2: q.x - ux * by,
    y2: q.y - uy * by,
    mx: (p.x + q.x) / 2,
    my: (p.y + q.y) / 2,
    angle: (Math.atan2(uy, ux) * 180) / Math.PI,
  };
}

function ToolLoopDiagram({ step }: { step: number }) {
  const W = 580;
  const H = 500;
  const cx = W / 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* arms reaching down to the tools */}
      {TOOLS.map((t, i) => {
        const dx = t.at.x - MODEL.x;
        const dy = t.at.y - MODEL.y;
        const len = Math.hypot(dx, dy);
        const ux = dx / len;
        const uy = dy / len;
        return (
          <motion.line
            key={t.label}
            x1={MODEL.x + ux * (MODEL_R + 2)}
            y1={MODEL.y + uy * (MODEL_R + 2)}
            x2={t.at.x - ux * 30}
            y2={t.at.y - uy * 30}
            stroke="var(--cool)"
            strokeWidth="1.2"
            initial={false}
            animate={{ opacity: step >= 1 ? 0.6 : 0 }}
            transition={{ duration: 0.35, delay: step >= 1 ? i * 0.06 : 0 }}
          />
        );
      })}

      {TOOLS.map((t, i) => (
        <motion.g
          key={t.label}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.9 }}
          transition={{ duration: 0.35, delay: step >= 1 ? i * 0.06 : 0 }}
          style={{ transformOrigin: `${t.at.x}px ${t.at.y}px` }}
        >
          <rect
            x={t.at.x - PILL_W / 2}
            y={t.at.y - PILL_H / 2}
            width={PILL_W}
            height={PILL_H}
            rx={6}
            fill="var(--bg-elev)"
            stroke="var(--cool)"
            strokeWidth="1.3"
          />
          <text
            x={t.at.x}
            y={t.at.y + 5}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="14"
            fill="var(--cool)"
            letterSpacing="0.08em"
          >
            {t.label}
          </text>
        </motion.g>
      ))}

      {/* the model */}
      <circle cx={MODEL.x} cy={MODEL.y} r={MODEL_R} fill="var(--bg-elev)" stroke="var(--accent)" strokeWidth="1.5" />
      <text
        x={MODEL.x}
        y={MODEL.y - 2}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="19"
        fill="var(--accent)"
      >
        модель
      </text>
      <text
        x={MODEL.x}
        y={MODEL.y + 17}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        cursor
      </text>

      {/* step 2: the loop draws itself */}
      {SIDES.map((s, i) => {
        const t = trim(s, 16);
        return (
          <motion.line
            key={i}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--ink-soft)"
            strokeWidth="1.2"
            initial={false}
            animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 0.75 : 0 }}
            transition={{ duration: 0.45, delay: step >= 2 ? 0.12 * i : 0, ease: [0.22, 1, 0.36, 1] }}
          />
        );
      })}
      {SIDES.map((s, i) => {
        const t = trim(s, 16);
        return (
          <motion.g
            key={`h${i}`}
            initial={false}
            animate={{ opacity: step >= 2 ? 0.75 : 0 }}
            transition={{ duration: 0.3, delay: step >= 2 ? 0.12 * i + 0.35 : 0 }}
          >
            <polygon
              points="-6,-5 6,0 -6,5"
              fill="var(--ink-soft)"
              transform={`translate(${t.mx} ${t.my}) rotate(${t.angle})`}
            />
          </motion.g>
        );
      })}

      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4, delay: step >= 2 ? 0.2 : 0 }}>
        {[
          { p: A, label: 'предложил', dy: -18 },
          { p: B, label: 'посмотрел', dy: 30 },
          { p: C, label: 'поправил', dy: 30 },
        ].map((v) => (
          <g key={v.label}>
            <circle cx={v.p.x} cy={v.p.y} r={5} fill="var(--ink-soft)" />
            <text
              x={v.p.x}
              y={v.p.y + v.dy}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="12"
              fill="var(--ink-soft)"
              letterSpacing="0.08em"
            >
              {v.label}
            </text>
          </g>
        ))}

        {/* the dot never stops going round: ambient, step-independent */}
        <motion.g
          initial={false}
          animate={{ x: [A.x, B.x, C.x, A.x], y: [A.y, B.y, C.y, A.y] }}
          transition={{ duration: 4.2, times: DOT_TIMES, repeat: Infinity, ease: 'linear' }}
        >
          <circle r={6} fill="var(--accent)" />
          <circle r={11} fill="none" stroke="var(--accent)" strokeWidth="1" opacity="0.35" />
        </motion.g>
      </motion.g>

      {/* step 3: and a human watching every single turn */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.4 }}
      >
        <path
          d="M 268 366 Q 290 348 312 366 Q 290 384 268 366 Z"
          fill="var(--bg)"
          stroke="var(--cool)"
          strokeWidth="1.4"
        />
        <circle cx={290} cy={366} r={4.5} fill="var(--cool)" />
        <text
          x={cx}
          y={398}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--cool)"
          letterSpacing="0.08em"
        >
          апрув каждого шага
        </text>
      </motion.g>
    </svg>
  );
}

export const eraCursorSlide: Slide = {
  id: 'era-cursor',
  title: 'эра 3 · цикл появился',
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Split
          ratio="1fr 1.2fr"
          left={
            <Stack gap={20}>
              <Eyebrow>история · 6</Eyebrow>
              <SlideTitle size="md">Эра 3: цикл появился</SlideTitle>
              <Stack gap={14} style={{ marginTop: 12 }}>
                <Build step={step} appearAt={0}>
                  <BodyText>Cursor дал модели руки.</BodyText>
                </Build>
                <Build step={step} appearAt={1}>
                  <BodyText>Редактировать файлы, запускать команды, читать ошибки.</BodyText>
                </Build>
                <Build step={step} appearAt={2}>
                  <BodyText>
                    Впервые: предложил → посмотрел → поправил. Генерация стала поиском.
                  </BodyText>
                </Build>
                <Build step={step} appearAt={3}>
                  <BodyText>
                    <span style={{ color: 'var(--ink)' }}>
                      Но человек всё ещё нянчит каждый оборот цикла.
                    </span>
                  </BodyText>
                </Build>
              </Stack>
            </Stack>
          }
          right={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <ToolLoopDiagram step={step} />
            </div>
          }
        />
      </div>
      {/* deck spine: same footer slot on every era slide */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <EraTimeline compact current={2} />
      </div>
    </div>
  ),
};
