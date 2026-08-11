import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const CARD_X = 20;
const CARD_W = 540;
const CARD_Y = 30;
const CARD_H = 390;

const ROW_X = 36;
const ROW_W = 508;
const ROW_H = 68;
const ROW_GAP = 10;
const ROW_TOP = 100;
const rowY = (i: number) => ROW_TOP + i * (ROW_H + ROW_GAP);

const NUM_X = 44;
const BOX_X = 66;
const BOX_S = 22;
const LABEL_X = 104;
/** Right edge the chips are flush to. */
const CHIP_R = 528;
const CHIP_H = 24;

const BANNER_Y = 448;
const BANNER_H = 40;

/** The four steps, in the order a Monday actually allows. `chipW` is measured
 *  for 11px mono (~6.6px per glyph) plus 20px of padding — SVG has no shrink-wrap. */
const ITEMS = [
  {
    n: '01',
    label: 'напиши CLAUDE.md',
    sub: 'что знает команда — знает и агент',
    chip: '30 минут',
    chipW: 76,
  },
  {
    n: '02',
    label: 'тесты одной командой',
    sub: 'у цикла должен быть один вход',
    chip: 'make test',
    chipW: 84,
  },
  {
    n: '03',
    label: 'три последних review-комментария',
    sub: 'правило вместо повторного ревью',
    chip: '→ lint-правила',
    chipW: 116,
  },
  {
    n: '04',
    label: 'один повторяющийся workflow',
    sub: 'шаблон вместо памяти',
    chip: '→ slash-команда',
    chipW: 124,
  },
];

/** Ambient caret in the card header: a terminal that is waiting for you.
 *  Module constants, and `initial` = the first keyframe, so a production
 *  build starts the loop instead of freezing on the last value. */
const CARET_OPACITY = [1, 1, 0, 0];
const CARET_TIMES = [0, 0.48, 0.5, 1];

function ChecklistCard({ step }: { step: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <rect
        x={CARD_X}
        y={CARD_Y}
        width={CARD_W}
        height={CARD_H}
        rx={10}
        fill="var(--bg-elev)"
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* ---- header: the day, and a cursor blinking at you ---- */}
      <text
        x={CARD_X + 22}
        y={CARD_Y + 30}
        fontFamily="var(--mono)"
        fontSize="12"
        fill="var(--accent)"
        letterSpacing="0.08em"
      >
        понедельник, 10:00
      </text>
      <motion.rect
        x={CARD_X + 176}
        y={CARD_Y + 20}
        width={7}
        height={13}
        fill="var(--accent)"
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ opacity: CARET_OPACITY[0] }}
        animate={{ opacity: CARET_OPACITY }}
        transition={{ duration: 1.1, times: CARET_TIMES, repeat: Infinity, ease: 'linear' }}
      />
      <text
        x={CARD_X + CARD_W - 22}
        y={CARD_Y + 30}
        textAnchor="end"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--ink-mute)"
        letterSpacing="0.1em"
      >
        БЕЗ БЮДЖЕТА
      </text>
      <line
        x1={CARD_X + 22}
        y1={CARD_Y + 42}
        x2={CARD_X + CARD_W - 22}
        y2={CARD_Y + 42}
        stroke="var(--line)"
        strokeWidth="1"
      />

      {ITEMS.map((it, i) => {
        const y = rowY(i);
        const cy = y + ROW_H / 2;
        const done = step >= i;
        const current = step === i;
        return (
          <g key={it.n}>
            <motion.rect
              x={ROW_X}
              y={y}
              width={ROW_W}
              height={ROW_H}
              rx={8}
              fill="var(--bg)"
              strokeWidth="1.2"
              initial={false}
              animate={{
                stroke: current ? 'var(--accent)' : 'var(--line)',
                opacity: done ? 1 : 0.4,
              }}
              transition={{ duration: 0.45 }}
            />

            <text
              x={NUM_X}
              y={cy + 4}
              fontFamily="var(--mono)"
              fontSize="11"
              fill="var(--ink-mute)"
              letterSpacing="0.06em"
            >
              {it.n}
            </text>

            {/* the box, and the tick that draws itself into it */}
            <motion.rect
              x={BOX_X}
              y={cy - BOX_S / 2}
              width={BOX_S}
              height={BOX_S}
              rx={5}
              fill="none"
              strokeWidth="1.4"
              initial={false}
              animate={{ stroke: done ? 'var(--cool)' : 'var(--ink-mute)' }}
              transition={{ duration: 0.45 }}
            />
            <motion.path
              d={`M ${BOX_X + 5} ${cy} l 5 5 l 9 -11`}
              fill="none"
              stroke="var(--cool)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={false}
              animate={{ pathLength: done ? 1 : 0, opacity: done ? 1 : 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />

            <motion.text
              x={LABEL_X}
              y={cy - 5}
              fontFamily="var(--mono)"
              fontSize="14"
              letterSpacing="0.03em"
              initial={false}
              animate={{ fill: current ? 'var(--accent)' : done ? 'var(--ink)' : 'var(--ink-mute)' }}
              transition={{ duration: 0.45 }}
            >
              {it.label}
            </motion.text>
            <motion.text
              x={LABEL_X}
              y={cy + 16}
              fontFamily="var(--mono)"
              fontSize="10"
              fill="var(--ink-mute)"
              letterSpacing="0.02em"
              initial={false}
              animate={{ opacity: done ? 1 : 0.35 }}
              transition={{ duration: 0.45 }}
            >
              {it.sub}
            </motion.text>

            <motion.g
              initial={false}
              animate={{ opacity: done ? 1 : 0, x: done ? 0 : 10 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <rect
                x={CHIP_R - it.chipW}
                y={cy - CHIP_H / 2}
                width={it.chipW}
                height={CHIP_H}
                rx={5}
                fill="var(--accent-soft)"
                stroke="var(--accent-line)"
                strokeWidth="1"
              />
              <text
                x={CHIP_R - it.chipW / 2}
                y={cy + 4}
                textAnchor="middle"
                fontFamily="var(--mono)"
                fontSize="11"
                fill="var(--accent)"
                letterSpacing="0.04em"
              >
                {it.chip}
              </text>
            </motion.g>
          </g>
        );
      })}

      {/* ---- step 4: the only homework ---- */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0, y: step >= 4 ? 0 : -8 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <rect
          x={CARD_X}
          y={BANNER_Y}
          width={CARD_W}
          height={BANNER_H}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
          strokeWidth="1"
        />
        <text
          x={W / 2}
          y={BANNER_Y + 25}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="13"
          fill="var(--accent)"
          letterSpacing="0.06em"
        >
          через месяц вернись к слайду про метрики
        </text>
      </motion.g>
    </svg>
  );
}

export const mondaySlide: Slide = {
  id: 'monday',
  title: 'утро понедельника',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>финал · 33</Eyebrow>
          <SlideTitle size="md">Утро понедельника</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText size="lg">
                <span style={{ color: 'var(--ink)' }}>
                  Не нужен грант на платформу. Нужны четыре шага.
                </span>
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Каждый шаг забирает у тебя один кусок цикла — и отдаёт его среде.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Правило простое: то, что ты объяснил дважды, объясни репозиторию.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Это обычная инженерная гигиена. Агенты просто платят за неё сразу — и штрафуют
                за её отсутствие тоже сразу.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Ни новой платформы, ни бюджета. Одно утро — и цикл начинает работать на тебя.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ChecklistCard step={step} />
        </div>
      }
    />
  ),
};
