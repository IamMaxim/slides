import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const CARD_X = 140;
const CARD_W = 300;
const CARD_H = 62;

const CARD_A_Y = 34;
const CARD_B_Y = 316;

const SKEPTIC_R = 42;
const SKEPTIC_CY = 210;
const SKEPTICS = [96, 290, 484];

/** Verdicts sit on the wire, between the finding and the skeptic that judged it. */
const PILL_W = 132;
const PILL_H = 24;
const PILL_A_Y = 126;
const PILL_B_Y = 272;

const VERDICT_A = ['✗ опровергнуто', '✗ опровергнуто', '✓ устояло'];
const VERDICT_B = ['✓ устояло', '✓ устояло', '✓ устояло'];

/** A hairline fracture, not a cartoon shatter. */
const CRACK = `M ${CARD_X + 46} ${CARD_A_Y} L ${CARD_X + 74} ${CARD_A_Y + 24} L ${CARD_X + 52} ${
  CARD_A_Y + 34
} L ${CARD_X + 96} ${CARD_A_Y + CARD_H}`;

function FindingCard({
  y,
  title,
  tag,
  color,
}: {
  y: number;
  title: string;
  tag: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={CARD_X}
        y={y}
        width={CARD_W}
        height={CARD_H}
        rx={7}
        fill="var(--bg-elev)"
        stroke={color}
        strokeWidth="1.5"
      />
      <text x={CARD_X + 20} y={y + 22} fontFamily="var(--mono)" fontSize="10" fill="var(--ink-mute)" letterSpacing="0.08em">
        {tag}
      </text>
      <text x={CARD_X + 20} y={y + 45} fontFamily="var(--mono)" fontSize="13" fill={color} letterSpacing="0.02em">
        {title}
      </text>
    </g>
  );
}

function Verdict({ cx, y, text, ok }: { cx: number; y: number; text: string; ok: boolean }) {
  const color = ok ? 'var(--cool)' : 'var(--warn)';
  return (
    <g>
      <rect
        x={cx - PILL_W / 2}
        y={y}
        width={PILL_W}
        height={PILL_H}
        rx={4}
        fill="var(--bg-elev)"
        stroke={color}
        strokeWidth="1.1"
      />
      <text
        x={cx}
        y={y + 16}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="10"
        fill={color}
        letterSpacing="0.04em"
      >
        {text}
      </text>
    </g>
  );
}

function GauntletDiagram({ step }: { step: number }) {
  const dead = step >= 2;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- step 0: a finding. Plausible, unverified. ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: dead ? 0.2 : 1 }}
        transition={{ duration: 0.6, delay: dead ? 0.9 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <FindingCard y={CARD_A_Y} title="утечка соединений в pool.ts" tag="НАХОДКА #1" color="var(--accent)" />
        <motion.line
          x1={CARD_X + 18}
          y1={CARD_A_Y + 41}
          x2={CARD_X + 214}
          y2={CARD_A_Y + 41}
          stroke="var(--warn)"
          strokeWidth="1.4"
          initial={false}
          animate={{ pathLength: dead ? 1 : 0, opacity: dead ? 1 : 0 }}
          transition={{ duration: 0.45, delay: dead ? 0.8 : 0, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          d={CRACK}
          fill="none"
          stroke="var(--warn)"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.8"
          initial={false}
          animate={{ pathLength: dead ? 1 : 0, opacity: dead ? 0.8 : 0 }}
          transition={{ duration: 0.35, delay: dead ? 0.75 : 0 }}
        />
      </motion.g>

      {/* ---- step 1: three skeptics, and the instruction that makes them work ---- */}
      {SKEPTICS.map((cx, i) => (
        <motion.line
          key={`ea${cx}`}
          x1={CARD_X + CARD_W / 2}
          y1={CARD_A_Y + CARD_H}
          x2={cx}
          y2={SKEPTIC_CY - SKEPTIC_R - 4}
          stroke="var(--line)"
          strokeWidth="1.2"
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
          transition={{ duration: 0.4, delay: step >= 1 ? i * 0.07 : 0 }}
        />
      ))}

      {SKEPTICS.map((cx, i) => (
        <motion.g
          key={`sk${cx}`}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0, scale: step >= 1 ? 1 : 0.72, y: step >= 1 ? 0 : -18 }}
          transition={{ duration: 0.48, delay: step >= 1 ? i * 0.09 : 0, ease: [0.34, 1.35, 0.64, 1] }}
          style={{ transformOrigin: `${cx}px ${SKEPTIC_CY}px` }}
        >
          <motion.circle
            cx={cx}
            cy={SKEPTIC_CY}
            r={SKEPTIC_R + 9}
            fill="none"
            stroke="var(--ink-soft)"
            strokeWidth="1"
            strokeDasharray="3 7"
            opacity="0.5"
            // ambient: initial = first keyframe, else a prod build never starts the loop
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 14 + i * 5, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: `${cx}px ${SKEPTIC_CY}px` }}
          />
          <circle cx={cx} cy={SKEPTIC_CY} r={SKEPTIC_R} fill="var(--bg-elev)" stroke="var(--ink-soft)" strokeWidth="1.5" />
          <text
            x={cx}
            y={SKEPTIC_CY - 4}
            textAnchor="middle"
            fontFamily="var(--display)"
            fontStyle="italic"
            fontSize="14"
            fill="var(--ink)"
          >
            скептик
          </text>
          <text
            x={cx}
            y={SKEPTIC_CY + 15}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="10"
            fill="var(--warn)"
            letterSpacing="0.02em"
          >
            опровергни
          </text>
        </motion.g>
      ))}

      {/* ---- step 2: the verdicts, one at a time ---- */}
      {SKEPTICS.map((cx, i) => (
        <motion.g
          key={`va${cx}`}
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0, scale: step >= 2 ? 1 : 0.9 }}
          transition={{ duration: 0.32, delay: step >= 2 ? i * 0.24 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${cx}px ${PILL_A_Y + PILL_H / 2}px` }}
        >
          <Verdict cx={cx} y={PILL_A_Y} text={VERDICT_A[i]} ok={VERDICT_A[i].startsWith('✓')} />
        </motion.g>
      ))}

      {/* ---- step 3: the same gauntlet, a different finding ---- */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        {SKEPTICS.map((cx) => (
          <line
            key={`eb${cx}`}
            x1={cx}
            y1={SKEPTIC_CY + SKEPTIC_R + 4}
            x2={CARD_X + CARD_W / 2}
            y2={CARD_B_Y}
            stroke="var(--line)"
            strokeWidth="1.2"
          />
        ))}
        <FindingCard y={CARD_B_Y} title="двойной close() в http.ts" tag="НАХОДКА #2" color="var(--cool)" />
      </motion.g>

      {SKEPTICS.map((cx, i) => (
        <motion.g
          key={`vb${cx}`}
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0, scale: step >= 3 ? 1 : 0.9 }}
          transition={{ duration: 0.32, delay: step >= 3 ? 0.2 + i * 0.22 : 0, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: `${cx}px ${PILL_B_Y + PILL_H / 2}px` }}
        >
          <Verdict cx={cx} y={PILL_B_Y} text={VERDICT_B[i]} ok />
        </motion.g>
      ))}

      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, scale: step >= 3 ? 1 : 0.8 }}
        transition={{ duration: 0.4, delay: step >= 3 ? 0.9 : 0, ease: [0.34, 1.5, 0.64, 1] }}
        style={{ transformOrigin: `${CARD_X + CARD_W - 76}px ${CARD_B_Y}px` }}
      >
        <rect
          x={CARD_X + CARD_W - 132}
          y={CARD_B_Y - 13}
          width={116}
          height={26}
          rx={13}
          fill="color-mix(in srgb, var(--cool) 22%, var(--bg-elev))"
          stroke="var(--cool)"
          strokeWidth="1.3"
        />
        <text
          x={CARD_X + CARD_W - 74}
          y={CARD_B_Y + 4}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--cool)"
          letterSpacing="0.04em"
        >
          confirmed 3/3
        </text>
      </motion.g>

      {/* ---- step 4: why any of this was worth the tokens ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : -8 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 208}
          y={412}
          width={416}
          height={62}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={438}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          правдоподобное ≠ правда
        </text>
        <text
          x={W / 2}
          y={459}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--ink-soft)"
          letterSpacing="0.04em"
        >
          проверка — это попытка опровергнуть
        </text>
      </motion.g>
    </svg>
  );
}

export const adversarialSlide: Slide = {
  id: 'adversarial',
  title: 'адверсариальная проверка',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>инженерия графов · 20</Eyebrow>
          <SlideTitle size="md">Адверсариальная проверка</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>Агент что-то нашёл. Это гипотеза, а не факт.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Три свежих контекста с одной инструкцией: опровергни.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Опровергли — находка мертва. Одного опровержения хватает.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>Устояла против всех троих — вот теперь это факт.</BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Правдоподобное ≠ правда. Правдоподобный шиткод убивается только независимой
                  попыткой его опровергнуть.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <GauntletDiagram step={step} />
        </div>
      }
    />
  ),
};
