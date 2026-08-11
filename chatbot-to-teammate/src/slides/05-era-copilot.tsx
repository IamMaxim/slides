import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';
import { EraTimeline } from '../ui/EraTimeline';

/** Abstract source lines: indent + bar width. No real code — just texture. */
const LINES: { indent: number; w: number }[] = [
  { indent: 0, w: 168 },
  { indent: 0, w: 118 },
  { indent: 16, w: 236 },
  { indent: 32, w: 190 },
  { indent: 32, w: 142 },
  { indent: 16, w: 110 }, // 5 — the caret lives here
  { indent: 32, w: 0 }, // 6 — ghost continuation
  { indent: 16, w: 132 },
  { indent: 0, w: 204 },
  { indent: 0, w: 96 },
  { indent: 16, w: 176 },
  { indent: 0, w: 128 },
];

const CARET_LINE = 5;
const GHOST_LINE = 6;
/** Lines the model is allowed to see (inclusive) — the bracketed window. */
const WINDOW_FROM = 2;
const WINDOW_TO = 8;

const CODE_X = 78;
const LINE_0_Y = 108;
const LINE_H = 26;
const lineY = (i: number) => LINE_0_Y + i * LINE_H;

function EditorDiagram({ step }: { step: number }) {
  const W = 580;
  const H = 500;
  const cx = W / 2;

  const caretX = CODE_X + LINES[CARET_LINE].indent + LINES[CARET_LINE].w + 8;
  const windowTop = lineY(WINDOW_FROM) - 17;
  const windowBottom = lineY(WINDOW_TO) + 9;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      {/* the editor */}
      <rect x={20} y={30} width={540} height={400} rx={10} fill="var(--bg-elev)" stroke="var(--line)" strokeWidth="1" />
      <text x={44} y={62} fontFamily="var(--mono)" fontSize="12" fill="var(--ink-soft)" letterSpacing="0.04em">
        checkout.ts
      </text>
      <line x1={20} y1={78} x2={560} y2={78} stroke="var(--line)" strokeWidth="1" />

      {LINES.map((l, i) => {
        const outside = i < WINDOW_FROM || i > WINDOW_TO;
        const dim = step >= 2 && outside;
        return (
          <motion.g
            key={i}
            initial={false}
            animate={{ opacity: dim ? 0.16 : 1 }}
            transition={{ duration: 0.4 }}
          >
            <text
              x={62}
              y={lineY(i) + 5}
              textAnchor="end"
              fontFamily="var(--mono)"
              fontSize="10"
              fill="var(--ink-mute)"
              opacity="0.7"
            >
              {i + 1}
            </text>
            {l.w > 0 && (
              <rect
                x={CODE_X + l.indent}
                y={lineY(i) - 3}
                width={l.w}
                height={7}
                rx={2}
                fill="var(--ink-soft)"
                opacity={i % 3 === 0 ? 0.34 : 0.22}
              />
            )}
          </motion.g>
        );
      })}

      {/* caret — ambient blink, independent of step */}
      <motion.rect
        x={caretX}
        y={lineY(CARET_LINE) - 11}
        width={2}
        height={20}
        fill="var(--accent)"
        // ambient: initial = first keyframe, else a prod build never starts the loop
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0, 0, 1] }}
        transition={{ duration: 1.1, times: [0, 0.47, 0.5, 0.97, 1], repeat: Infinity, ease: 'linear' }}
      />

      {/* step 1: the completion the model offers, and the key that accepts it */}
      <motion.g initial={false} animate={{ opacity: step >= 1 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <text
          x={caretX + 10}
          y={lineY(CARET_LINE) + 5}
          fontFamily="var(--mono)"
          fontStyle="italic"
          fontSize="13"
          fill="var(--ink-mute)"
        >
          сгенерированное продолжение…
        </text>
        <rect
          x={458}
          y={lineY(CARET_LINE) - 15}
          width={72}
          height={25}
          rx={5}
          fill="var(--bg)"
          stroke="var(--line)"
          strokeWidth="1"
        />
        <text
          x={494}
          y={lineY(CARET_LINE) + 2}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--ink-soft)"
          letterSpacing="0.1em"
        >
          tab ↹
        </text>
        <motion.rect
          x={CODE_X + LINES[GHOST_LINE].indent}
          y={lineY(GHOST_LINE) - 4}
          width={196}
          height={9}
          rx={2}
          fill="none"
          strokeWidth="1"
          strokeDasharray="3 3"
          initial={false}
          animate={{ stroke: step >= 3 ? 'var(--warn)' : 'var(--ink-mute)' }}
          transition={{ duration: 0.4 }}
        />
      </motion.g>

      {/* step 2: everything the model actually gets to look at */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.45 }}>
        <path
          d={`M 16 ${windowTop} L 6 ${windowTop} L 6 ${windowBottom} L 16 ${windowBottom}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.4"
        />
        <path
          d={`M 564 ${windowTop} L 574 ${windowTop} L 574 ${windowBottom} L 564 ${windowBottom}`}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.4"
        />
        <text
          x={cx}
          y={462}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="12"
          fill="var(--accent)"
          letterSpacing="0.1em"
        >
          что видит модель
        </text>
      </motion.g>

      {/* step 3: the bill for the speed */}
      <motion.g initial={false} animate={{ opacity: step >= 3 ? 1 : 0 }} transition={{ duration: 0.4 }}>
        <rect
          x={370}
          y={lineY(GHOST_LINE) - 11}
          width={170}
          height={25}
          rx={5}
          fill="color-mix(in srgb, var(--warn) 12%, transparent)"
          stroke="var(--warn)"
          strokeWidth="1"
        />
        <text
          x={455}
          y={lineY(GHOST_LINE) + 5}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--warn)"
          letterSpacing="0.05em"
        >
          ✓ compiles, ✗ wrong
        </text>
      </motion.g>
    </svg>
  );
}

export const eraCopilotSlide: Slide = {
  id: 'era-copilot',
  title: 'эра 2 · глаза без рук',
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Split
          ratio="1fr 1.2fr"
          left={
            <Stack gap={20}>
              <Eyebrow>история · 5</Eyebrow>
              <SlideTitle size="md">Эра 2: глаза без рук</SlideTitle>
              <Stack gap={14} style={{ marginTop: 12 }}>
                <Build step={step} appearAt={0}>
                  <BodyText>Copilot вшил модель в редактор.</BodyText>
                </Build>
                <Build step={step} appearAt={1}>
                  <BodyText>Цикл сжался до одного нажатия tab.</BodyText>
                </Build>
                <Build step={step} appearAt={2}>
                  <BodyText>
                    Модель видит окно вокруг курсора. Действовать и проверять — не может. Один выстрел.
                  </BodyText>
                </Build>
                <Build step={step} appearAt={3}>
                  <BodyText>
                    <span style={{ color: 'var(--ink)' }}>
                      Плата за скорость: правдоподобно выглядящий неправильный код.
                    </span>
                  </BodyText>
                </Build>
              </Stack>
            </Stack>
          }
          right={
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <EditorDiagram step={step} />
            </div>
          }
        />
      </div>
      {/* deck spine: same footer slot on every era slide */}
      <div style={{ display: 'flex', justifyContent: 'flex-start', paddingTop: 8 }}>
        <EraTimeline compact current={1} />
      </div>
    </div>
  ),
};
