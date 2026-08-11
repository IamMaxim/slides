import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

/** Two patterns, one slide: they answer the two questions you ask before you
 *  build a graph — "which way?" and "how long?". Hence the wider box. */
const W = 700;
const H = 500;

const DIVIDER_X = 356;

/* ---------------- left: the panel ---------------- */

const CAND_X = 20;
const CAND_W = 214;
const CAND_H = 56;
const CAND_Y = [40, 130, 220];
const CANDIDATES = [
  { label: 'подход A', sub: 'переписать слой', score: '6.1' },
  { label: 'подход B', sub: 'адаптер поверх', score: '8.4' },
  { label: 'подход C', sub: 'фасад + кэш', score: '5.7' },
];
const WINNER = 1;

const JUDGE_CX = 292;
const JUDGE_R = 24;

/** The graft: one good idea from a losing card, moved onto the winner. */
const CHIP_X = 36;
const CHIP_W = 190;
const CHIP_H = 22;
/** Parked under the card it came from; grafted into the gap under the winner. */
const CHIP_Y = 282;
const CHIP_DY = CAND_Y[WINNER] + CAND_H + 6 - CHIP_Y;

/* ---------------- right: the dry loop ---------------- */

const R_X = 386;
const ROUNDS = [
  { label: 'раунд 1', found: 7, total: 7 },
  { label: 'раунд 2', found: 2, total: 9 },
  { label: 'раунд 3', found: 0, total: 9 },
  { label: 'раунд 4', found: 0, total: 9 },
];
const ROUND_Y = [60, 116, 172, 228];
const BUCKET_X = 470;
const BUCKET_U = 18;
const BUCKET_H = 18;

/** The counter's naive cousin: stop at ten and the tail is simply never found. */
const TAIL_X = 396;
const TAIL_W = 268;
const TAIL_CUT = 176;

function JudgeDryDiagram({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 760 }}>
      <defs>
        <pattern id="s21-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="var(--warn)" strokeWidth="1.6" opacity="0.55" />
        </pattern>
      </defs>

      {/* the divider only means anything once there is a second half */}
      <motion.line
        x1={DIVIDER_X}
        y1={16}
        x2={DIVIDER_X}
        y2={470}
        stroke="var(--line)"
        strokeWidth="1"
        initial={false}
        animate={{ opacity: step >= 2 ? 1 : 0 }}
        transition={{ duration: 0.45 }}
      />

      {/* ================= panel of judges ================= */}
      <text x={CAND_X} y={30} fontFamily="var(--mono)" fontSize="12" fill="var(--accent)" letterSpacing="0.08em">
        панель судей
      </text>

      {/* every judge reads every candidate */}
      {CAND_Y.map((cy) => (
        <g key={cy}>
          {CAND_Y.map((jy) => (
            <line
              key={jy}
              x1={CAND_X + CAND_W}
              y1={cy + CAND_H / 2}
              x2={JUDGE_CX - JUDGE_R - 3}
              y2={jy + CAND_H / 2}
              stroke="var(--line)"
              strokeWidth="1"
              opacity="0.7"
            />
          ))}
        </g>
      ))}

      {CANDIDATES.map((c, i) => {
        const win = i === WINNER;
        return (
          <g key={c.label}>
            <rect
              x={CAND_X}
              y={CAND_Y[i]}
              width={CAND_W}
              height={CAND_H}
              rx={6}
              fill={win ? 'var(--accent-soft)' : 'var(--bg-elev)'}
              stroke={win ? 'var(--accent)' : 'var(--line)'}
              strokeWidth={win ? 1.6 : 1.1}
            />
            <text
              x={CAND_X + 16}
              y={CAND_Y[i] + 24}
              fontFamily="var(--mono)"
              fontSize="13"
              fill={win ? 'var(--accent)' : 'var(--ink)'}
              letterSpacing="0.04em"
            >
              {c.label}
            </text>
            <text x={CAND_X + 16} y={CAND_Y[i] + 42} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)">
              {c.sub}
            </text>
            <text
              x={CAND_X + CAND_W - 16}
              y={CAND_Y[i] + 36}
              textAnchor="end"
              fontFamily="var(--mono)"
              fontSize="17"
              fill={win ? 'var(--accent)' : 'var(--ink-soft)'}
            >
              {c.score}
            </text>
          </g>
        );
      })}

      {CAND_Y.map((jy, i) => (
        <g key={`judge${jy}`}>
          <motion.circle
            cx={JUDGE_CX}
            cy={jy + CAND_H / 2}
            r={JUDGE_R + 7}
            fill="none"
            stroke="var(--cool)"
            strokeWidth="1"
            strokeDasharray="3 6"
            opacity="0.5"
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${JUDGE_CX}px ${jy + CAND_H / 2}px` }}
          />
          <circle
            cx={JUDGE_CX}
            cy={jy + CAND_H / 2}
            r={JUDGE_R}
            fill="var(--bg-elev)"
            stroke="var(--cool)"
            strokeWidth="1.4"
          />
          <text
            x={JUDGE_CX}
            y={jy + CAND_H / 2 + 4}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="10"
            fill="var(--cool)"
            letterSpacing="0.02em"
          >
            судья
          </text>
        </g>
      ))}

      {/* step 1: the graft — a losing card's best idea moves onto the winner */}
      <motion.g
        initial={false}
        animate={{ y: step >= 1 ? CHIP_DY : 0 }}
        transition={{ duration: 0.6, ease: [0.34, 1.3, 0.64, 1] }}
      >
        <rect
          x={CHIP_X}
          y={CHIP_Y}
          width={CHIP_W}
          height={CHIP_H}
          rx={11}
          fill="color-mix(in srgb, var(--cool) 18%, var(--bg-elev))"
          stroke="var(--cool)"
          strokeWidth="1.1"
        />
        <text
          x={CHIP_X + CHIP_W / 2}
          y={CHIP_Y + 15}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--cool)"
          letterSpacing="0.02em"
        >
          идея из C: инвалидация по TTL
        </text>
      </motion.g>

      <motion.text
        x={CAND_X}
        y={334}
        fontFamily="var(--mono)"
        fontSize="10"
        fill="var(--accent)"
        letterSpacing="0.06em"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.4, delay: step >= 1 ? 0.4 : 0 }}
      >
        синтез: победитель + лучшее у проигравших
      </motion.text>

      {/* ================= loop until dry ================= */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <text x={R_X} y={30} fontFamily="var(--mono)" fontSize="12" fill="var(--cool)" letterSpacing="0.08em">
          цикл до сухого
        </text>

        {ROUNDS.map((r, i) => {
          const empty = r.found === 0;
          return (
            <g key={r.label}>
              <text
                x={R_X}
                y={ROUND_Y[i] + 22}
                fontFamily="var(--mono)"
                fontSize="11"
                fill={empty ? 'var(--ink-mute)' : 'var(--ink-soft)'}
                letterSpacing="0.04em"
              >
                {r.label}
              </text>
              {empty ? (
                <rect
                  x={BUCKET_X}
                  y={ROUND_Y[i] + 8}
                  width={44}
                  height={BUCKET_H}
                  rx={3}
                  fill="none"
                  stroke="var(--line)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
              ) : (
                <motion.rect
                  x={BUCKET_X}
                  y={ROUND_Y[i] + 8}
                  height={BUCKET_H}
                  rx={3}
                  fill="var(--accent)"
                  opacity={0.75 - i * 0.12}
                  initial={false}
                  animate={{ width: step >= 2 ? r.found * BUCKET_U : 0 }}
                  transition={{ duration: 0.5, delay: step >= 2 ? 0.25 + i * 0.18 : 0, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
              <text
                x={empty ? BUCKET_X + 22 : BUCKET_X + r.found * BUCKET_U + 12}
                y={ROUND_Y[i] + 22}
                textAnchor={empty ? 'middle' : 'start'}
                fontFamily="var(--mono)"
                fontSize="11"
                fill={empty ? 'var(--ink-mute)' : 'var(--ink)'}
              >
                {empty ? '0' : `+${r.found}`}
              </text>
              <text
                x={W - 16}
                y={ROUND_Y[i] + 22}
                textAnchor="end"
                fontFamily="var(--mono)"
                fontSize="11"
                fill={empty ? 'var(--ink-mute)' : 'var(--cool)'}
              >
                всего {r.total}
              </text>
            </g>
          );
        })}

        <rect
          x={R_X}
          y={286}
          width={262}
          height={32}
          rx={4}
          fill="color-mix(in srgb, var(--cool) 14%, transparent)"
          stroke="var(--cool)"
          strokeWidth="1.1"
        />
        <text
          x={R_X + 131}
          y={307}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--cool)"
          letterSpacing="0.04em"
        >
          два нуля подряд → стоп
        </text>
      </motion.g>

      {/* step 3: the counter you were tempted to use instead */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={R_X}
          y={348}
          width={294}
          height={110}
          rx={5}
          fill="color-mix(in srgb, var(--warn) 12%, transparent)"
          stroke="var(--warn)"
          strokeWidth="1"
          strokeOpacity="0.6"
        />
        <text x={TAIL_X} y={374} fontFamily="var(--mono)" fontSize="11" fill="var(--warn)" letterSpacing="0.04em">
          стоп по счётчику: «нашли 10 — хватит»
        </text>
        <rect x={TAIL_X} y={392} width={TAIL_CUT} height={16} rx={2} fill="var(--accent)" opacity="0.6" />
        <rect
          x={TAIL_X + TAIL_CUT}
          y={392}
          width={TAIL_W - TAIL_CUT}
          height={16}
          rx={2}
          fill="url(#s21-hatch)"
          stroke="var(--warn)"
          strokeWidth="0.8"
          strokeOpacity="0.5"
        />
        <line
          x1={TAIL_X + TAIL_CUT}
          y1={386}
          x2={TAIL_X + TAIL_CUT}
          y2={414}
          stroke="var(--warn)"
          strokeWidth="1.4"
        />
        <text
          x={TAIL_X + TAIL_CUT + (TAIL_W - TAIL_CUT) / 2}
          y={434}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--warn)"
          letterSpacing="0.06em"
        >
          хвост
        </text>
      </motion.g>
    </svg>
  );
}

export const judgeDrySlide: Slide = {
  id: 'judge-dry',
  title: 'панель судей и цикл до сухого',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.5fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия графов · 21</Eyebrow>
          <SlideTitle size="sm">Панель судей и цикл до сухого</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Когда пространство решений широкое — генерируй N подходов и суди.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Синтез: победитель + лучшие идеи проигравших.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Когда размер задачи неизвестен — ищи, пока два раунда подряд не вернут ноль.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Счётчик „нашли 10 — хватит“ пропускает хвост.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <JudgeDryDiagram step={step} />
        </div>
      }
    />
  ),
};
