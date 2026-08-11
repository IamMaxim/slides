import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

const W = 580;
const H = 500;

/** The chat bubble: a prompt that lives exactly as long as the conversation. */
const BUB = { x: 14, y: 92, w: 210, h: 184 };

/** The file: the same words, but committed. Card language borrowed from 02's MR. */
const CARD = { x: 268, y: 60, w: 296, h: 300 };
const CARD_HEAD_H = 36;
const CARD_L = CARD.x + 20;
const CARD_R = CARD.x + CARD.w - 20;

const BAR_H = 8;

/**
 * The money shot: eight fragments, one set of elements, two arrangements.
 * `f*` is where a fragment sits as a line of the chat prompt, `t*` is where the
 * same fragment lands as a line of the command file. Nothing is created or
 * destroyed between the two states — the prompt does not disappear and a file
 * appear, the prompt *becomes* the file.
 */
const FRAGMENTS = [
  { fx: 32, fy: 152, fw: 76, tx: CARD_L, ty: 124, tw: 164 },
  { fx: 116, fy: 152, fw: 90, tx: CARD_L, ty: 148, tw: 228 },
  { fx: 32, fy: 176, fw: 106, tx: CARD_L, ty: 172, tw: 192 },
  { fx: 150, fy: 176, fw: 56, tx: CARD_L, ty: 196, tw: 100 },
  { fx: 32, fy: 200, fw: 148, tx: CARD_L, ty: 220, tw: 244 },
  { fx: 32, fy: 224, fw: 56, tx: CARD_L, ty: 244, tw: 148 },
  { fx: 98, fy: 224, fw: 108, tx: CARD_L, ty: 268, tw: 206 },
  { fx: 32, fy: 248, fw: 86, tx: CARD_L, ty: 292, tw: 124 },
];

/**
 * Flight arcs without keyframes: x eases normally while y overshoots (or
 * undershoots) its target, so the straight line between the two slots bows into
 * a curve. Alternating the two eases sprays the fragments apart mid-flight and
 * pulls them back together on arrival — and because every value is a plain
 * target, stepping backwards plays the same arc in reverse.
 */
const ARC_DOWN: [number, number, number, number] = [0.55, -0.62, 0.42, 1.04];
const ARC_UP: [number, number, number, number] = [0.45, 1.62, 0.55, 0.96];

/** Three things a prompt in a chat window can never be. */
const BADGES = [
  { label: 'версионируется', w: 104 },
  { label: 'ревьюится', w: 72 },
  { label: 'шарится', w: 59 },
];
const BADGE_Y = 326;
const BADGE_H = 26;
const BADGE_X = (() => {
  const xs: number[] = [];
  let x = CARD_L;
  for (const b of BADGES) {
    xs.push(x);
    x += b.w + 8;
  }
  return xs;
})();

function CommandDiagram({ step }: { step: number }) {
  const filed = step >= 1;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* ---- the chat bubble, dissolving ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: filed ? 0 : 1 }}
        transition={{ duration: 0.45, delay: filed ? 0.12 : 0.5 }}
      >
        <text
          x={BUB.x}
          y={78}
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--ink-mute)"
          letterSpacing="0.08em"
        >
          промпт в чате
        </text>
        <rect
          x={BUB.x}
          y={BUB.y}
          width={BUB.w}
          height={BUB.h}
          rx={12}
          fill="var(--bg-elev)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <polygon
          points={`${BUB.x + 22},${BUB.y + BUB.h} ${BUB.x + 22},${BUB.y + BUB.h + 18} ${BUB.x + 48},${BUB.y + BUB.h}`}
          fill="var(--bg-elev)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text x={32} y={130} fontFamily="var(--mono)" fontSize="11" fill="var(--ink-soft)" letterSpacing="0.02em">
          сделай релиз: подними…
        </text>
      </motion.g>

      {/* ---- the file's slot, reserved before anything lands in it ---- */}
      <motion.rect
        x={CARD.x}
        y={CARD.y}
        width={CARD.w}
        height={CARD.h}
        rx={10}
        fill="none"
        stroke="var(--line)"
        strokeWidth="1"
        strokeDasharray="4 6"
        initial={false}
        animate={{ opacity: filed ? 0 : 0.35 }}
        transition={{ duration: 0.4 }}
      />

      {/* ---- the file, crystallizing around the arriving fragments ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: filed ? 1 : 0 }}
        transition={{ duration: 0.5, delay: filed ? 0.3 : 0 }}
      >
        <rect
          x={CARD.x}
          y={CARD.y}
          width={CARD.w}
          height={CARD.h}
          rx={10}
          fill="var(--bg-elev)"
          stroke="var(--line)"
          strokeWidth="1"
        />
      </motion.g>

      {/* ---- the eight fragments: prompt lines, then file lines ---- */}
      {FRAGMENTS.map((f, i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{ x: filed ? f.tx : f.fx, y: filed ? f.ty : f.fy }}
          transition={{
            x: { duration: 0.85, delay: i * 0.055, ease: [0.4, 0, 0.2, 1] },
            y: { duration: 0.95, delay: i * 0.055, ease: i % 2 === 0 ? ARC_DOWN : ARC_UP },
          }}
        >
          <motion.rect
            x={0}
            y={0}
            height={BAR_H}
            rx={2}
            fill="var(--ink-soft)"
            opacity={0.34}
            initial={false}
            animate={{ width: filed ? f.tw : f.fw }}
            transition={{ duration: 1, delay: i * 0.055, ease: [0.4, 0, 0.2, 1] }}
          />
        </motion.g>
      ))}

      {/* ---- the file's identity: path + version tag ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: filed ? 1 : 0 }}
        transition={{ duration: 0.4, delay: filed ? 0.75 : 0 }}
      >
        <line
          x1={CARD.x}
          y1={CARD.y + CARD_HEAD_H}
          x2={CARD.x + CARD.w}
          y2={CARD.y + CARD_HEAD_H}
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text
          x={CARD_L}
          y={CARD.y + 23}
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--ink-soft)"
          letterSpacing="0.04em"
        >
          /.claude/commands/release.md
        </text>
        {/* a git tag, because now there is something to tag */}
        <polygon
          points={`${CARD_R - 34},${CARD.y + 8} ${CARD_R},${CARD.y + 8} ${CARD_R},${CARD.y + 28} ${CARD_R - 34},${CARD.y + 28} ${CARD_R - 44},${CARD.y + 18}`}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <circle cx={CARD_R - 29} cy={CARD.y + 18} r={2.2} fill="var(--accent)" />
        <text
          x={CARD_R - 15}
          y={CARD.y + 22}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          v3
        </text>
      </motion.g>

      {/* ---- step 2: what a file gets that a chat message never did ---- */}
      {BADGES.map((b, i) => (
        <motion.g
          key={b.label}
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0, y: step >= 2 ? 0 : 6 }}
          transition={{ duration: 0.35, delay: step >= 2 ? i * 0.08 : 0, ease: [0.22, 1, 0.36, 1] }}
        >
          <rect
            x={BADGE_X[i]}
            y={BADGE_Y}
            width={b.w}
            height={BADGE_H}
            rx={4}
            fill="var(--bg-elev)"
            stroke="var(--cool)"
            strokeWidth="1"
            opacity={0.55}
          />
          <text
            x={BADGE_X[i] + b.w / 2}
            y={BADGE_Y + 17}
            textAnchor="middle"
            fontFamily="var(--mono)"
            fontSize="10"
            fill="var(--cool)"
            letterSpacing="0.04em"
          >
            {b.label}
          </text>
        </motion.g>
      ))}

      {/* ---- step 3: the aphorism ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0, y: step >= 3 ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={W / 2 - 210}
          y={424}
          width={420}
          height={44}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={451}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.04em"
        >
          команда — это функция. промпт — строка в REPL.
        </text>
      </motion.g>
    </svg>
  );
}

export const eraCommandsSlide: Slide = {
  id: 'era-commands',
  title: 'эра 5 · промпт → артефакт',
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Split
          ratio="1fr 1.2fr"
          left={
            <Stack gap={20}>
              <Eyebrow>история · 14</Eyebrow>
              <SlideTitle size="md">Эра 5: промпт → артефакт</SlideTitle>
              <Stack gap={14} style={{ marginTop: 12 }}>
                <Build step={step} appearAt={0}>
                  <BodyText>Хороший промпт умирал вместе с чатом.</BodyText>
                </Build>
                <Build step={step} appearAt={1}>
                  <BodyText>
                    Сообщество придумало: заворачивать цель в slash-команду — файл в репозитории.
                  </BodyText>
                </Build>
                <Build step={step} appearAt={2}>
                  <BodyText>Промпт-инжиниринг стал process-инжинирингом.</BodyText>
                </Build>
                <Build step={step} appearAt={3}>
                  <BodyText>
                    <span style={{ color: 'var(--ink)' }}>
                      Промпт ты набираешь заново каждый раз. Команду — вызываешь.
                    </span>
                  </BodyText>
                </Build>
              </Stack>
            </Stack>
          }
          right={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <CommandDiagram step={step} />
            </div>
          }
        />
      </div>
      {/* deck spine: same footer slot on every era slide */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <EraTimeline compact current={4} />
      </div>
    </div>
  ),
};
