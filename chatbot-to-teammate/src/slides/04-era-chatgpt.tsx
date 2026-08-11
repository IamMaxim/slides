import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

type Pt = { x: number; y: number };

/** A one-way traffic lane between two nodes, pushed off-axis so the return
 *  lane never overlaps it. Reversing from/to flips the perpendicular too, so
 *  the same positive offset always lands on the opposite side. */
function lane(a: Pt, b: Pt, ra: number, rb: number, off: number) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const x1 = a.x + ux * ra + px * off;
  const y1 = a.y + uy * ra + py * off;
  const x2 = b.x - ux * rb + px * off;
  const y2 = b.y - uy * rb + py * off;
  return { x1, y1, x2, y2, mx: (x1 + x2) / 2, my: (y1 + y2) / 2, px, py };
}

type Lane = ReturnType<typeof lane>;

function Node({
  pos,
  label,
  sub,
  color,
  radius,
}: {
  pos: Pt;
  label: string;
  sub: string;
  color: string;
  radius: number;
}) {
  return (
    <g>
      <circle cx={pos.x} cy={pos.y} r={radius} fill="var(--bg-elev)" stroke={color} strokeWidth="1.5" />
      <text
        x={pos.x}
        y={pos.y - 3}
        textAnchor="middle"
        fontFamily="var(--display)"
        fontStyle="italic"
        fontSize="19"
        fill={color}
      >
        {label}
      </text>
      <text
        x={pos.x}
        y={pos.y + 18}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="11"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        {sub}
      </text>
    </g>
  );
}

/** A clipboard riding a lane end-to-end, forever. The crawl is ambient: only
 *  the wrapper's opacity is step-driven, so stepping back just hides it. */
function Packet({
  path,
  label,
  marker,
  color,
  visible,
  delay = 0,
}: {
  path: Lane;
  label: string;
  marker: string;
  color: string;
  visible: boolean;
  delay?: number;
}) {
  return (
    <motion.g initial={false} animate={{ opacity: visible ? 1 : 0 }} transition={{ duration: 0.35 }}>
      <line
        x1={path.x1}
        y1={path.y1}
        x2={path.x2}
        y2={path.y2}
        stroke={color}
        strokeWidth="1.1"
        opacity="0.5"
        markerEnd={`url(#${marker})`}
      />
      <text
        x={path.mx + path.px * 19}
        y={path.my + path.py * 19 + 4}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="12"
        fill={color}
        letterSpacing="0.08em"
      >
        {label}
      </text>
      <motion.g
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ x: path.x1, y: path.y1 }}
        animate={{ x: [path.x1, path.x2], y: [path.y1, path.y2] }}
        transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 0.6, ease: 'linear', delay }}
      >
        <rect x={-13} y={-9} width={26} height={19} rx={3} fill="var(--bg-elev)" stroke={color} strokeWidth="1.2" />
        <rect x={-5} y={-12} width={10} height={5} rx={1.5} fill={color} />
        <line x1={-7} y1={-2} x2={7} y2={-2} stroke="var(--ink-mute)" strokeWidth="1.2" />
        <line x1={-7} y1={4} x2={3} y2={4} stroke="var(--ink-mute)" strokeWidth="1.2" />
      </motion.g>
    </motion.g>
  );
}

function HandoffDiagram({ step }: { step: number }) {
  const W = 580;
  const H = 500;
  const cx = W / 2;

  const browser: Pt = { x: 106, y: 156 };
  const ide: Pt = { x: 474, y: 156 };
  const human: Pt = { x: cx, y: 338 };
  const R = 66;
  const HR = 58;

  const toBrowser = lane(human, browser, HR, R, 26);
  const toHuman = lane(browser, human, R, HR, 26);
  const fromIde = lane(ide, human, R, HR, 26);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s4-arr-accent" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
        <marker id="s4-arr-cool" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
        <marker id="s4-arr-warn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--warn)" />
        </marker>
      </defs>

      {/* step 2: the whole route, redrawn as one band that must pass through you */}
      <motion.path
        d={`M ${browser.x} ${browser.y} L ${human.x} ${human.y} L ${ide.x} ${ide.y}`}
        fill="none"
        stroke="var(--warn)"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 0.16 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      <Packet
        path={toBrowser}
        label="контекст"
        marker="s4-arr-accent"
        color="var(--accent)"
        visible={step >= 1}
      />
      <Packet path={toHuman} label="код" marker="s4-arr-cool" color="var(--cool)" visible={step >= 1} delay={1.5} />
      <Packet
        path={fromIde}
        label="ошибка"
        marker="s4-arr-warn"
        color="var(--warn)"
        visible={step >= 2}
        delay={0.8}
      />

      <Node pos={browser} label="браузер" sub="chatgpt" color="var(--cool)" radius={R} />
      <Node pos={ide} label="IDE" sub="твой проект" color="var(--ink-soft)" radius={R} />

      {/* the human sits in the middle of everything — and step 2 says so */}
      <motion.circle
        cx={human.x}
        cy={human.y}
        r={HR + 10}
        fill="none"
        stroke="var(--warn)"
        strokeWidth="1.2"
        strokeDasharray="4 6"
        initial={false}
        animate={{ opacity: step >= 2 ? 0.9 : 0, scale: step >= 2 ? 1 : 0.93 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ transformOrigin: `${human.x}px ${human.y}px` }}
      />
      <Node pos={human} label="человек" sub="ты" color="var(--accent)" radius={HR} />

      {/* step 3: the verdict */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <rect x={cx - 210} y={H - 62} width={420} height={38} rx={4} fill="var(--accent-soft)" stroke="var(--accent-line)" />
        <text
          x={cx}
          y={H - 38}
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--mono)"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          человек — это harness. и бутылочное горлышко.
        </text>
      </motion.g>
    </svg>
  );
}

export const eraChatgptSlide: Slide = {
  id: 'era-chatgpt',
  title: 'эра 1 · человек-harness',
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Split
          ratio="1fr 1.2fr"
          left={
            <Stack gap={20}>
              <Eyebrow>история · 4</Eyebrow>
              <SlideTitle size="md">Эра 1: человек-harness</SlideTitle>
              <Stack gap={14} style={{ marginTop: 12 }}>
                <Build step={step} appearAt={0}>
                  <BodyText>2022. Модель умная, но заперта в чате.</BodyText>
                </Build>
                <Build step={step} appearAt={1}>
                  <BodyText>Ты носишь контекст туда, код обратно. Вручную.</BodyText>
                </Build>
                <Build step={step} appearAt={2}>
                  <BodyText>Каждая итерация цикла проходит через твой буфер обмена.</BodyText>
                </Build>
                <Build step={step} appearAt={3}>
                  <BodyText>
                    <span style={{ color: 'var(--ink)' }}>
                      Отлично для сниппетов. Не масштабируется на репозиторий.
                    </span>
                  </BodyText>
                </Build>
              </Stack>
            </Stack>
          }
          right={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <HandoffDiagram step={step} />
            </div>
          }
        />
      </div>
      {/* deck spine: same footer slot on every era slide */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <EraTimeline compact current={0} />
      </div>
    </div>
  ),
};
