import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

/* ---- the comment ---- */
const BUB_X = 70;
const BUB_W = 410;
const BUB_Y = 34;
const BUB_H = 64;

const COUNT_X = 496;
const COUNT_W = 52;
const COUNT_Y = 46;
const COUNT_H = 40;

/* ---- the die it goes through ---- */
const FORGE_Y = 168;
const FORGE_H = 28;
const FORGE_X = 90;
const FORGE_W = 400;

/* ---- the gate wall from slide 25, seen head-on ---- */
const WALL_Y = 352;
const WALL_H = 52;
const SLOTS = [
  { x: 36, w: 100, label: 'lint' },
  { x: 148, w: 100, label: 'типы' },
  { x: 260, w: 100, label: 'тесты' },
];
const NEW_X = 372;
const NEW_W = 180;
const NEW_CX = NEW_X + NEW_W / 2;

/** Where the freshly forged rule sits before it slots into the wall. */
const FORGED_DX = -190;
const FORGED_DY = -110;

const SPARKS = [130, 200, 270, 340, 410];

function ForgeDiagram({ step }: { step: number }) {
  const forged = step >= 1;
  const caught = step >= 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="s26-arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--warn)" />
        </marker>
        <clipPath id="s26-forge">
          <rect x={FORGE_X} y={FORGE_Y} width={FORGE_W} height={FORGE_H} />
        </clipPath>
      </defs>

      {/* ---- the same comment, for the third time ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: forged ? 0.24 : 1, y: forged ? 44 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={BUB_X}
          y={BUB_Y}
          width={BUB_W}
          height={BUB_H}
          rx={14}
          fill="var(--bg-elev)"
          stroke="var(--ink-soft)"
          strokeWidth="1.3"
        />
        <path
          d={`M ${BUB_X + 40} ${BUB_Y + BUB_H} L ${BUB_X + 28} ${BUB_Y + BUB_H + 18} L ${BUB_X + 64} ${BUB_Y + BUB_H} Z`}
          fill="var(--bg-elev)"
          stroke="var(--ink-soft)"
          strokeWidth="1.3"
        />
        <text
          x={BUB_X + BUB_W / 2}
          y={BUB_Y + 39}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="17"
          fill="var(--ink)"
        >
          „мы не используем raw SQL в хендлерах“
        </text>
      </motion.g>

      {/* ---- how many times it has been written by hand ---- */}
      <motion.g initial={false} animate={{ opacity: caught ? 0 : 1 }} transition={{ duration: 0.4 }}>
        <rect
          x={COUNT_X}
          y={COUNT_Y}
          width={COUNT_W}
          height={COUNT_H}
          rx={5}
          fill="color-mix(in srgb, var(--warn) 12%, transparent)"
          stroke="var(--warn)"
          strokeWidth="1.2"
        />
        <text
          x={COUNT_X + COUNT_W / 2}
          y={COUNT_Y + 27}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="17"
          fill="var(--warn)"
          letterSpacing="0.02em"
        >
          ×3
        </text>
      </motion.g>
      <motion.g initial={false} animate={{ opacity: caught ? 1 : 0 }} transition={{ duration: 0.4, delay: caught ? 0.25 : 0 }}>
        <rect
          x={COUNT_X}
          y={COUNT_Y}
          width={COUNT_W}
          height={COUNT_H}
          rx={5}
          fill="color-mix(in srgb, var(--cool) 14%, transparent)"
          stroke="var(--cool)"
          strokeWidth="1.2"
        />
        <text
          x={COUNT_X + COUNT_W / 2}
          y={COUNT_Y + 27}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="17"
          fill="var(--cool)"
          letterSpacing="0.02em"
        >
          ×0
        </text>
      </motion.g>
      <text
        x={COUNT_X + COUNT_W / 2}
        y={COUNT_Y + COUNT_H + 16}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--ink-mute)"
        letterSpacing="0.08em"
      >
        В РЕВЬЮ
      </text>

      {/* ---- the die: taste goes in soft, comes out square ---- */}
      <motion.g initial={false} animate={{ opacity: forged ? 1 : 0.2 }} transition={{ duration: 0.5 }}>
        <rect
          x={FORGE_X}
          y={FORGE_Y}
          width={FORGE_W}
          height={FORGE_H}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1.2"
        />
        <g clipPath="url(#s26-forge)">
          <motion.rect
            y={FORGE_Y}
            width={90}
            height={FORGE_H}
            fill="var(--accent)"
            opacity="0.35"
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ x: FORGE_X - 90 }}
            animate={{ x: [FORGE_X - 90, FORGE_X + FORGE_W] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.8, ease: 'linear' }}
          />
        </g>
        <text
          x={FORGE_X + FORGE_W + 10}
          y={FORGE_Y + 19}
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--accent)"
          letterSpacing="0.08em"
        >
          ковка
        </text>
      </motion.g>

      {/* sparks off the die */}
      <motion.g initial={false} animate={{ opacity: forged ? 1 : 0 }} transition={{ duration: 0.4 }}>
        {SPARKS.map((x, i) => (
          <motion.line
            key={x}
            x1={x}
            y1={FORGE_Y - 8}
            x2={x + 4}
            y2={FORGE_Y - 20}
            stroke="var(--accent)"
            strokeWidth="1.4"
            strokeLinecap="round"
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.9, 0], scale: [0.4, 1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, repeatDelay: 0.6, delay: i * 0.17, ease: 'easeOut' }}
            style={{ transformOrigin: `${x}px ${FORGE_Y}px` }}
          />
        ))}
      </motion.g>

      {/* ---- the wall the rule joins ---- */}
      <text x={36} y={340} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
        СТЕНА ГЕЙТОВ
      </text>
      {SLOTS.map((s) => (
        <g key={s.label}>
          <rect
            x={s.x}
            y={WALL_Y}
            width={s.w}
            height={WALL_H}
            fill="var(--bg-elev)"
            stroke="var(--cool)"
            strokeWidth="1.6"
          />
          <text
            x={s.x + s.w / 2}
            y={WALL_Y + 31}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="13"
            fill="var(--cool)"
            letterSpacing="0.04em"
          >
            {s.label}
          </text>
        </g>
      ))}
      {/* the empty socket exists from the start, so nothing shifts when it fills */}
      <rect
        x={NEW_X}
        y={WALL_Y}
        width={NEW_W}
        height={WALL_H}
        fill="none"
        stroke="var(--line)"
        strokeWidth="1.4"
        strokeDasharray="5 5"
      />

      {/* ---- the forged rule, landing in the socket ---- */}
      <motion.g
        initial={false}
        animate={{
          opacity: forged ? 1 : 0,
          x: forged ? 0 : FORGED_DX,
          y: forged ? 0 : FORGED_DY,
        }}
        transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={NEW_X}
          y={WALL_Y}
          width={NEW_W}
          height={WALL_H}
          fill="var(--bg-elev)"
          stroke="var(--cool)"
          strokeWidth="1.6"
        />
        <text
          x={NEW_CX}
          y={WALL_Y + 31}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--cool)"
          letterSpacing="0.02em"
        >
          no-raw-sql-in-handlers
        </text>
      </motion.g>

      {/* ---- step 2: the next MR meets it, and no human is involved ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: caught ? 1 : 0, y: caught ? 0 : -8 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={NEW_CX - 28}
          y={280}
          width={56}
          height={30}
          rx={4}
          fill="color-mix(in srgb, var(--warn) 12%, var(--bg-elev))"
          stroke="var(--warn)"
          strokeWidth="1.3"
        />
        <text
          x={NEW_CX}
          y={300}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--warn)"
          letterSpacing="0.04em"
        >
          MR
        </text>
        <line
          x1={NEW_CX}
          y1={314}
          x2={NEW_CX}
          y2={WALL_Y - 6}
          stroke="var(--warn)"
          strokeWidth="1.2"
          strokeDasharray="3 4"
          markerEnd="url(#s26-arr)"
        />
        <text
          x={NEW_X - 14}
          y={300}
          textAnchor="end"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--warn)"
          letterSpacing="0.04em"
        >
          ✗ поймано до человека
        </text>
        <rect
          x={NEW_X}
          y={WALL_Y}
          width={NEW_W}
          height={WALL_H}
          fill="color-mix(in srgb, var(--warn) 12%, transparent)"
        />
        <text
          x={NEW_CX}
          y={WALL_Y + WALL_H + 20}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--ink-soft)"
          letterSpacing="0.04em"
        >
          агент чинит сам
        </text>
      </motion.g>

      {/* ---- step 3: the aphorism ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 208}
          y={444}
          width={416}
          height={50}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={466}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.02em"
        >
          каждый повторяющийся комментарий ревью —
        </text>
        <text
          x={W / 2}
          y={485}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.02em"
        >
          это недописанный линтер
        </text>
      </motion.g>
    </svg>
  );
}

export const reviewToLintSlide: Slide = {
  id: 'review-to-lint',
  title: 'комментарий → линтер',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>агентная команда · 26</Eyebrow>
          <SlideTitle size="md">Комментарий → линтер</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Ты уже писал этот комментарий. Дважды.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Вкус команды компилируется в инфраструктуру.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Теперь это ловится до человека — и агент чинит сам.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Каждый повторяющийся комментарий ревью — это недописанный линтер.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ForgeDiagram step={step} />
        </div>
      }
    />
  ),
};
