import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Pt = { x: number; y: number };

const W = 580;
const H = 500;

/** Three people, each with the workflow they worked out privately. */
const PEOPLE = [
  { cx: 110, cmd: '/spec' },
  { cx: 290, cmd: '/review' },
  { cx: 470, cmd: '/release' },
];

const FILE_W = 80;
const FILE_H = 32;
const FILE_Y = 82;
const FILE_BOTTOM = FILE_Y + FILE_H;

/** The repository: one box everything converges on. */
const REPO = { x: 190, y: 186, w: 200, h: 64 };
const REPO_CX = REPO.x + REPO.w / 2;
const REPO_BOTTOM = REPO.y + REPO.h;

/** What reads the memory back out: agents, and the person who just joined. */
const SINKS = [
  { x: 20, w: 94, label: 'агент', color: 'var(--cool)' },
  { x: 126, w: 94, label: 'агент', color: 'var(--cool)' },
  { x: 232, w: 94, label: 'агент', color: 'var(--cool)' },
  { x: 366, w: 190, label: 'новичок', color: 'var(--accent)' },
];
const SINK_Y = 326;
const SINK_H = 44;

const IN_LANES: { a: Pt; b: Pt }[] = PEOPLE.map((p, i) => ({
  a: { x: p.cx, y: FILE_BOTTOM },
  b: { x: REPO.x + 42 + i * 58, y: REPO.y - 4 },
}));

const OUT_LANES: { a: Pt; b: Pt }[] = SINKS.map((s) => ({
  a: { x: REPO_CX, y: REPO_BOTTOM },
  b: { x: s.x + s.w / 2, y: SINK_Y - 4 },
}));

/** Keyframe arrays built once: the same objects on every render, so the
 *  travelling dots never restart when a step changes. */
const IN_KEYS = IN_LANES.map((l) => ({ x: [l.a.x, l.b.x], y: [l.a.y, l.b.y] }));
const OUT_KEYS = OUT_LANES.map((l) => ({ x: [l.a.x, l.b.x], y: [l.a.y, l.b.y] }));
const FLOW_OPACITY = [0, 1, 1, 0];
const FLOW_TIMES = [0, 0.14, 0.8, 1];

function PersonGlyph({ cx }: { cx: number }) {
  return (
    <g>
      <circle cx={cx} cy={38} r={11} fill="none" stroke="var(--ink-soft)" strokeWidth="1.4" />
      <path
        d={`M ${cx - 19} 68 A 19 19 0 0 1 ${cx + 19} 68`}
        fill="none"
        stroke="var(--ink-soft)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </g>
  );
}

function KnowledgeDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s16-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--line)" />
        </marker>
      </defs>

      {/* ---- step 0: three people, three private workflows ---- */}
      {PEOPLE.map((p) => (
        <g key={p.cmd}>
          <PersonGlyph cx={p.cx} />
          <rect
            x={p.cx - FILE_W / 2}
            y={FILE_Y}
            width={FILE_W}
            height={FILE_H}
            rx={5}
            fill="var(--bg-elev)"
            stroke="var(--line)"
            strokeWidth="1"
          />
          <text
            x={p.cx}
            y={FILE_Y + 21}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="11"
            fill="var(--ink-soft)"
            letterSpacing="0.04em"
          >
            {p.cmd}
          </text>
        </g>
      ))}

      {/* ---- step 1: the files land in one repository ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        {IN_LANES.map((l, i) => (
          <line
            key={i}
            x1={l.a.x}
            y1={l.a.y}
            x2={l.b.x}
            y2={l.b.y}
            stroke="var(--line)"
            strokeWidth="1.2"
            markerEnd="url(#s16-arr)"
          />
        ))}
        <rect
          x={REPO.x}
          y={REPO.y}
          width={REPO.w}
          height={REPO.h}
          rx={8}
          fill="var(--bg-elev)"
          stroke="var(--accent)"
          strokeWidth="1.5"
        />
        <text
          x={REPO_CX}
          y={REPO.y + 28}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          .claude/commands/
        </text>
        <text
          x={REPO_CX}
          y={REPO.y + 48}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--ink-mute)"
          letterSpacing="0.08em"
        >
          институциональная память
        </text>
      </motion.g>

      {/* the files themselves, still arriving */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.4, delay: step >= 1 ? 0.3 : 0 }}>
        {IN_KEYS.map((k, i) => (
          <motion.g
            key={i}
            initial={false}
            animate={{ x: k.x, y: k.y, opacity: FLOW_OPACITY }}
            transition={{
              x: { duration: 2.4, repeat: Infinity, repeatDelay: 0.9, delay: i * 0.4, ease: 'linear' },
              y: { duration: 2.4, repeat: Infinity, repeatDelay: 0.9, delay: i * 0.4, ease: 'linear' },
              opacity: {
                duration: 2.4,
                times: FLOW_TIMES,
                repeat: Infinity,
                repeatDelay: 0.9,
                delay: i * 0.4,
                ease: 'linear',
              },
            }}
          >
            <rect x={-9} y={-6} width={18} height={12} rx={2} fill="var(--accent)" opacity={0.85} />
          </motion.g>
        ))}
      </motion.g>

      {/* ---- step 2: and the same file is read back out, by everyone ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        {OUT_LANES.map((l, i) => (
          <line
            key={i}
            x1={l.a.x}
            y1={l.a.y}
            x2={l.b.x}
            y2={l.b.y}
            stroke="var(--line)"
            strokeWidth="1.2"
            markerEnd="url(#s16-arr)"
          />
        ))}
        {SINKS.map((s, i) => (
          <g key={i}>
            <rect
              x={s.x}
              y={SINK_Y}
              width={s.w}
              height={SINK_H}
              rx={6}
              fill="var(--bg-elev)"
              stroke={s.color}
              strokeWidth="1.3"
            />
            <text
              x={s.x + s.w / 2}
              y={SINK_Y + 28}
              textAnchor="middle"
              fontFamily="var(--mono)"
              fontSize="13"
              fill={s.color}
              letterSpacing="0.06em"
            >
              {s.label}
            </text>
          </g>
        ))}
        <text
          x={SINKS[3].x + SINKS[3].w / 2}
          y={SINK_Y + SINK_H + 22}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--ink-mute)"
          letterSpacing="0.06em"
        >
          читает то же самое
        </text>
      </motion.g>

      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4, delay: step >= 2 ? 0.3 : 0 }}>
        {OUT_KEYS.map((k, i) => (
          <motion.g
            key={i}
            initial={false}
            animate={{ x: k.x, y: k.y, opacity: FLOW_OPACITY }}
            transition={{
              x: { duration: 2.2, repeat: Infinity, repeatDelay: 0.7, delay: i * 0.3, ease: 'linear' },
              y: { duration: 2.2, repeat: Infinity, repeatDelay: 0.7, delay: i * 0.3, ease: 'linear' },
              opacity: {
                duration: 2.2,
                times: FLOW_TIMES,
                repeat: Infinity,
                repeatDelay: 0.7,
                delay: i * 0.3,
                ease: 'linear',
              },
            }}
          >
            <circle r={4.5} fill="var(--cool)" />
          </motion.g>
        ))}
      </motion.g>

      {/* ---- step 2: the line that makes it one thing ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : -8 }}
        transition={{ duration: 0.4, delay: step >= 2 ? 0.15 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 130}
          y={430}
          width={260}
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
          letterSpacing="0.06em"
        >
          онбординг = git pull
        </text>
      </motion.g>
    </svg>
  );
}

export const teamKnowledgeSlide: Slide = {
  id: 'team-knowledge',
  title: 'команды как память команды',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>process engineering · 16</Eyebrow>
          <SlideTitle size="md">Команды как память команды</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>У каждого в голове — свой лучший workflow.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Слитые в репозиторий, они становятся институциональной памятью.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Памятью, которая исполняется. Онбординг для людей и агентов — один и тот же файл.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <KnowledgeDiagram step={step} />
        </div>
      }
    />
  ),
};
