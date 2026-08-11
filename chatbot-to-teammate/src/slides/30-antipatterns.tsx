import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle } from '../ui/SlideTitle';
import { Stack, Row } from '../ui/Layout';

const FRAME_H = 176;

/* ---- keyframes, at module scope so a step change never restarts them ---- */
const DIE_TILT = [-5, 5, -5];
const STAMP_TIMES = [0, 0.26, 0.33, 0.6, 1];
const STAMP_Y = [0, 21, 21, 0, 0];
const STAMP_SQUASH = [1, 1, 0.86, 1, 1];
const FILL_TIMES = [0, 0.86, 0.92, 1];
const FILL_W = [0, 62, 62, 0];
const FILL_OPACITY = [0.45, 0.45, 0.45, 0];

/** The artwork sits in the frame; the joke is on the plaque underneath. */
function Frame({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        padding: 9,
        borderRadius: 4,
        background: 'var(--bg)',
      }}
    >
      <div
        style={{
          height: FRAME_H,
          border: '1px solid var(--line-soft)',
          background: 'var(--bg-elev)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Art({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 100" style={{ width: '78%', maxWidth: 200 }} aria-hidden>
      {children}
    </svg>
  );
}

/** 1. prompt-and-pray — a die, still in the air. */
function DieArt() {
  const pips = [
    [42, 34],
    [78, 34],
    [60, 52],
    [42, 70],
    [78, 70],
  ];
  return (
    <Art>
      <motion.g
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ rotate: DIE_TILT[0] }}
        animate={{ rotate: DIE_TILT }}
        transition={{ duration: 5.4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 52px' }}
      >
        <rect x={26} y={18} width={68} height={68} rx={11} fill="var(--bg)" stroke="var(--accent)" strokeWidth="1.6" />
        {pips.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={4.5} fill="var(--accent)" opacity="0.85" />
        ))}
      </motion.g>
    </Art>
  );
}

/** 2. MR на 700 строк — a diff too tall for its own frame. */
function FatDiffArt() {
  const rows = [64, 48, 72, 30, 58, 66, 41, 75, 52, 36, 69, 45, 61, 33, 70];
  return (
    <Art>
      <rect x={22} y={8} width={76} height={84} rx={4} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />
      {rows.map((w, i) => (
        <g key={i}>
          <rect x={29} y={14 + i * 5.6} width={3} height={3} rx={1} fill="var(--cool)" opacity="0.7" />
          <rect x={35} y={14.5 + i * 5.6} width={(w / 100) * 56} height={2.4} rx={1.2} fill="var(--cool)" opacity="0.3" />
        </g>
      ))}
      <rect x={22} y={78} width={76} height={14} fill="var(--bg-elev)" opacity="0.9" />
      <text x={60} y={89} textAnchor="middle" fontFamily="var(--mono)" fontSize="9" fill="var(--warn)" letterSpacing="0.06em">
        +700 …
      </text>
    </Art>
  );
}

/** 3. штамп-ревью — the stamp does the reviewing. */
function StampArt() {
  return (
    <Art>
      <rect x={22} y={62} width={76} height={28} rx={4} fill="var(--bg)" stroke="var(--line)" strokeWidth="1" />
      <text x={60} y={80} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--ink-mute)" letterSpacing="0.14em">
        LGTM
      </text>
      <motion.g
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ y: STAMP_Y[0], scaleY: STAMP_SQUASH[0] }}
        animate={{ y: STAMP_Y, scaleY: STAMP_SQUASH }}
        transition={{ duration: 3.2, times: STAMP_TIMES, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: '60px 58px' }}
      >
        <rect x={44} y={44} width={32} height={12} rx={2} fill="var(--warn)" opacity="0.85" />
        <rect x={54} y={20} width={12} height={26} rx={3} fill="none" stroke="var(--warn)" strokeWidth="1.6" />
      </motion.g>
    </Art>
  );
}

/** 4. театр скорости — both lines go up. Only one of them should. */
function TheaterArt() {
  return (
    <Art>
      <line x1={20} y1={86} x2={104} y2={86} stroke="var(--line)" strokeWidth="1" />
      <line x1={20} y1={14} x2={20} y2={86} stroke="var(--line)" strokeWidth="1" />
      <path d="M 20 74 L 44 66 L 66 50 L 86 34 L 102 20" fill="none" stroke="var(--cool)" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 20 82 L 44 79 L 66 70 L 86 58 L 102 44" fill="none" stroke="var(--warn)" strokeWidth="1.8" strokeLinecap="round" strokeDasharray="4 3" />
      <text x={20} y={98} fontFamily="var(--mono)" fontSize="8" fill="var(--cool)" letterSpacing="0.06em">
        LOC ↑
      </text>
      <text x={58} y={98} fontFamily="var(--mono)" fontSize="8" fill="var(--warn)" letterSpacing="0.06em">
        revert ↑
      </text>
    </Art>
  );
}

/** 5. контекст-марафон — slide 11's window, filled to the brim with debris. */
function MarathonArt() {
  return (
    <Art>
      <rect x={16} y={38} width={88} height={26} rx={4} fill="none" stroke="var(--line)" strokeWidth="1" />
      <rect x={17} y={39} width={24} height={24} rx={3} fill="var(--accent-soft)" stroke="var(--accent-line)" strokeWidth="1" />
      <motion.rect
        x={41}
        y={39}
        height={24}
        fill="var(--warn)"
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ width: FILL_W[0], opacity: FILL_OPACITY[0] }}
        animate={{ width: FILL_W, opacity: FILL_OPACITY }}
        transition={{ duration: 5, times: FILL_TIMES, repeat: Infinity, ease: 'linear' }}
      />
      <line x1={57} y1={39} x2={57} y2={63} stroke="var(--bg)" strokeWidth="1" opacity="0.8" />
      <line x1={73} y1={39} x2={73} y2={63} stroke="var(--bg)" strokeWidth="1" opacity="0.8" />
      <line x1={89} y1={39} x2={89} y2={63} stroke="var(--bg)" strokeWidth="1" opacity="0.8" />
      <text x={16} y={80} fontFamily="var(--mono)" fontSize="8" fill="var(--ink-mute)" letterSpacing="0.06em">
        контекстное окно
      </text>
    </Art>
  );
}

const PIECES: { name: string; line: string; art: ReactNode }[] = [
  { name: 'prompt-and-pray', line: 'запустил и надеешься. Надежда — не гейт.', art: <DieArt /> },
  { name: 'MR на 700 строк', line: 'его никто не прочитал. Его одобрили.', art: <FatDiffArt /> },
  { name: 'штамп-ревью', line: 'агент ревьюит агента. Оба согласны, оба не правы.', art: <StampArt /> },
  { name: 'театр скорости', line: 'LOC вверх, revert вверх. Зато график красивый.', art: <TheaterArt /> },
  { name: 'контекст-марафон', line: 'одна сессия на всё: контекст — свалка, качество — вниз.', art: <MarathonArt /> },
];

export const antipatternsSlide: Slide = {
  id: 'antipatterns',
  title: 'галерея антипаттернов',
  totalSteps: 5,
  render: ({ step }) => (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 44,
      }}
    >
      <Row gap={48} align="flex-end" justify="space-between">
        <Stack gap={0}>
          <Eyebrow>агентная команда · 30</Eyebrow>
          <SlideTitle size="md">Галерея антипаттернов</SlideTitle>
        </Stack>
        <Build step={step} appearAt={4} style={{ maxWidth: 440 }}>
          <div
            style={{
              border: '1px solid var(--accent-line)',
              background: 'var(--accent-soft)',
              borderRadius: 4,
              padding: '14px 18px',
              color: 'var(--accent)',
              fontFamily: 'var(--mono)',
              fontSize: 14,
              lineHeight: 1.45,
            }}
          >
            все пять — не проблемы модели. Это дырки в обвязке.
          </div>
        </Build>
      </Row>

      <Row gap={20} align="stretch" style={{ width: '100%' }}>
        {PIECES.map((p, i) => (
          <Build key={p.name} step={step} appearAt={i} y={14} style={{ flex: '1 1 0', minWidth: 0 }}>
            <Frame>{p.art}</Frame>
            <div style={{ padding: '14px 4px 0' }}>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  color: 'var(--accent)',
                  letterSpacing: '0.02em',
                  marginBottom: 6,
                }}
              >
                {p.name}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.45, color: 'var(--ink-soft)' }}>{p.line}</div>
            </div>
          </Build>
        ))}
      </Row>
    </div>
  ),
};
