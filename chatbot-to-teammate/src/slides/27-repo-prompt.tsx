import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const W = 580;
const H = 500;

const CARD_X = 20;
const CARD_W = 540;
const CARD_Y = 40;
const CARD_H = 416;

const ROW_X = 32;
const ROW_W = 516;
const ROW_H = 64;
const ROW_GAP = 8;
const ROW_TOP = 92;
const rowY = (i: number) => ROW_TOP + i * (ROW_H + ROW_GAP);

/** The species column: everything in this tree is read by both of them. */
const ICON_CX = 496;

const ROWS = [
  { label: 'CLAUDE.md', sub: 'онбординг, который читают оба вида' },
  { label: 'src/ — маленькие модули', sub: 'влезает в контекст — и в голову' },
  { label: 'конвенции > остроумие', sub: 'предсказуемое дешевле умного' },
  { label: 'тесты < 5 мин', sub: 'иначе цикл агента простаивает' },
  { label: 'песочница', sub: 'агент может сам запустить приложение' },
];

/** Human and agent, side by side, at the size of a bullet. */
function SpeciesPair({ cy, color }: { cy: number; color: string }) {
  const hx = ICON_CX - 16;
  const ax = ICON_CX + 18;
  return (
    <g>
      <circle cx={hx} cy={cy - 7} r={5.5} fill="none" stroke={color} strokeWidth="1.2" />
      <path
        d={`M ${hx - 9} ${cy + 9} A 9 9 0 0 1 ${hx + 9} ${cy + 9}`}
        fill="none"
        stroke={color}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <motion.circle
        cx={ax}
        cy={cy}
        r={11}
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeDasharray="3 5"
        opacity="0.7"
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        style={{ transformOrigin: `${ax}px ${cy}px` }}
      />
      <circle cx={ax} cy={cy} r={5.5} fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx={ax} cy={cy} r={1.8} fill={color} />
    </g>
  );
}

function RepoDiagram({ step }: { step: number }) {
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
      <text x={CARD_X + 22} y={CARD_Y + 30} fontFamily="var(--mono)" fontSize="12" fill="var(--accent)" letterSpacing="0.08em">
        репозиторий/
      </text>
      <text
        x={ICON_CX + 1}
        y={CARD_Y + 30}
        textAnchor="middle"
        fontFamily="var(--mono)"
        fontSize="9"
        fill="var(--ink-mute)"
        letterSpacing="0.1em"
      >
        ЧИТАЮТ ОБА
      </text>
      <line
        x1={CARD_X + 22}
        y1={CARD_Y + 42}
        x2={CARD_X + CARD_W - 22}
        y2={CARD_Y + 42}
        stroke="var(--line)"
        strokeWidth="1"
      />

      {/* one spine for the whole tree, ending on the last child */}
      <line
        x1={ROW_X + 12}
        y1={CARD_Y + 48}
        x2={ROW_X + 12}
        y2={rowY(ROWS.length - 1) + ROW_H / 2}
        stroke="var(--line)"
        strokeWidth="1"
      />

      {ROWS.map((r, i) => {
        const y = rowY(i);
        const cy = y + ROW_H / 2;
        const lit = step >= i;
        const current = step === i;
        const color = current ? 'var(--accent)' : lit ? 'var(--ink)' : 'var(--ink-mute)';
        return (
          <g key={r.label}>
            <line x1={ROW_X + 12} y1={cy} x2={ROW_X + 30} y2={cy} stroke="var(--line)" strokeWidth="1" />

            <motion.rect
              x={ROW_X + 30}
              y={y}
              width={ROW_W - 30}
              height={ROW_H}
              rx={6}
              fill="var(--bg)"
              strokeWidth="1.2"
              initial={false}
              animate={{
                stroke: current ? 'var(--accent)' : 'var(--line)',
                opacity: lit ? 1 : 0.4,
              }}
              transition={{ duration: 0.45 }}
            />
            <motion.text
              x={ROW_X + 52}
              y={cy - 5}
              fontFamily="var(--mono)"
              fontSize="15"
              letterSpacing="0.04em"
              initial={false}
              animate={{ fill: color }}
              transition={{ duration: 0.45 }}
            >
              {r.label}
            </motion.text>
            <motion.text
              x={ROW_X + 52}
              y={cy + 16}
              fontFamily="var(--mono)"
              fontSize="11"
              fill="var(--ink-mute)"
              letterSpacing="0.02em"
              initial={false}
              animate={{ opacity: lit ? 1 : 0.35 }}
              transition={{ duration: 0.45 }}
            >
              {r.sub}
            </motion.text>

            <motion.g
              initial={false}
              animate={{ opacity: lit ? 1 : 0, x: lit ? 0 : 14 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <SpeciesPair cy={cy} color={current ? 'var(--accent)' : 'var(--ink-soft)'} />
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}

export const repoPromptSlide: Slide = {
  id: 'repo-prompt',
  title: 'кодовая база — это промпт',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>агентная команда · 27</Eyebrow>
          <SlideTitle size="md">Кодовая база — это промпт</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>CLAUDE.md — онбординг, который читают оба вида.</BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>Маленькие модули: влезает в контекст — влезает и в голову.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>Конвенции важнее остроумия: предсказуемый код дешевле умного.</BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>Быстрые тесты: меньше пяти минут, иначе цикл агента стоит.</BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>Песочница: агент может сам запустить приложение и увидеть, что сломал.</BodyText>
            </Build>
            <Build step={step} appearAt={4} delay={0.25}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>
                  Всё это помогало и людям. Агенты просто сделали цену нечитаемости мгновенной.
                </span>
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <RepoDiagram step={step} />
        </div>
      }
    />
  ),
};
