import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

// Hand-crafted plausible attention weights for the demo sentence.
const SENTENCE = ['The', 'cat', 'sat', 'on', 'the', 'mat', 'because', 'it', 'was', 'tired'];
// weights[i][j] = how much token i attends to token j (j <= i, causal)
const WEIGHTS: number[][] = [
  /* The     */ [1.00, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  /* cat     */ [0.18, 1.00, 0, 0, 0, 0, 0, 0, 0, 0],
  /* sat     */ [0.06, 0.62, 1.00, 0, 0, 0, 0, 0, 0, 0],
  /* on      */ [0.04, 0.18, 0.74, 1.00, 0, 0, 0, 0, 0, 0],
  /* the     */ [0.05, 0.12, 0.22, 0.55, 1.00, 0, 0, 0, 0],
  /* mat     */ [0.04, 0.10, 0.18, 0.42, 0.65, 1.00, 0, 0, 0, 0],
  /* because */ [0.03, 0.08, 0.14, 0.10, 0.06, 0.20, 1.00, 0, 0, 0],
  /* it      */ [0.04, 0.78, 0.10, 0.05, 0.04, 0.18, 0.32, 1.00, 0, 0],
  /* was     */ [0.02, 0.10, 0.18, 0.04, 0.04, 0.06, 0.10, 0.55, 1.00, 0],
  /* tired   */ [0.04, 0.70, 0.18, 0.04, 0.04, 0.05, 0.20, 0.62, 0.45, 1.00],
];

export const attentionIntuitionSlide: Slide = {
  id: 'attention-intuition',
  title: 'attention, intuition',
  totalSteps: 4,
  render: ({ step }) => <AttentionIntuition step={step} />,
};

function AttentionIntuition({ step }: { step: number }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const focusedIdx = hoverIdx !== null ? hoverIdx : step >= 1 ? 7 : null; // 'it' by default after step 1
  const showArrows = step >= 2;
  const allowHover = step >= 3;

  return (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 24 }}>
      <Stack gap={12}>
        <Eyebrow>self-attention · 07a</Eyebrow>
        <SlideTitle size="md">Every token gets to look at the ones before it.</SlideTitle>
      </Stack>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 48, alignItems: 'center' }}>
        <Stack gap={16}>
          <Build step={step} appearAt={0}>
            <BodyText>
              Take a sentence. Each token has its own little budget of attention — it spends it on the earlier tokens that matter most for what it should mean here.
            </BodyText>
          </Build>
          <Build step={step} appearAt={1}>
            <BodyText>
              For the word <span style={{ color: 'var(--accent)' }}>"it"</span>, the model has to figure out what "it" refers to. The attention pattern tells the story: most of "it"'s attention lands on <span style={{ color: 'var(--accent)' }}>"cat"</span>.
            </BodyText>
          </Build>
          <Build step={step} appearAt={2}>
            <BodyText>
              Arrows show those weights. Thicker = stronger attention. This happens in parallel for every token in the sequence, in every layer of the model.
            </BodyText>
          </Build>
          <Build step={step} appearAt={3}>
            <BodyText>
              <span style={{ color: 'var(--ink)' }}>Hover any word</span> to see what it looks at.
            </BodyText>
          </Build>
        </Stack>

        <AttentionGraph
          tokens={SENTENCE}
          weights={WEIGHTS}
          focusedIdx={focusedIdx}
          showArrows={showArrows}
          onHover={allowHover ? setHoverIdx : undefined}
        />
      </div>
    </div>
  );
}

function AttentionGraph({
  tokens,
  weights,
  focusedIdx,
  showArrows,
  onHover,
}: {
  tokens: string[];
  weights: number[][];
  focusedIdx: number | null;
  showArrows: boolean;
  onHover?: (i: number | null) => void;
}) {
  const W = 640;
  const H = 320;
  const padX = 30;
  const step = (W - padX * 2) / (tokens.length - 1);
  const positions = tokens.map((_, i) => ({ x: padX + i * step, y: H / 2 }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', maxWidth: 700, fontFamily: 'var(--sans)' }}
      onMouseLeave={() => onHover && onHover(null)}
    >
      {/* arcs from focused token to earlier tokens */}
      {showArrows && focusedIdx !== null &&
        positions.slice(0, focusedIdx).map((p, j) => {
          const w = weights[focusedIdx][j];
          if (w < 0.02) return null;
          const dest = positions[focusedIdx];
          const midX = (p.x + dest.x) / 2;
          const arcH = 60 + (focusedIdx - j) * 14;
          const d = `M ${p.x} ${p.y - 14} Q ${midX} ${p.y - arcH} ${dest.x} ${dest.y - 14}`;
          return (
            <motion.path
              key={j}
              d={d}
              fill="none"
              stroke="var(--accent)"
              strokeWidth={0.6 + w * 4}
              strokeOpacity={0.25 + w * 0.65}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.45, delay: j * 0.04 }}
            />
          );
        })}

      {/* tokens */}
      {positions.map((p, i) => {
        const isFocused = focusedIdx === i;
        const isAttended = focusedIdx !== null && i < focusedIdx && weights[focusedIdx][i] > 0.05;
        const attendedAlpha = isAttended ? weights[focusedIdx!][i] : 0;
        return (
          <g
            key={i}
            transform={`translate(${p.x}, ${p.y})`}
            style={{ cursor: onHover ? 'pointer' : 'default' }}
            onMouseEnter={() => onHover && onHover(i)}
          >
            <rect
              x={-tokens[i].length * 4 - 8}
              y={-14}
              width={tokens[i].length * 8 + 16}
              height={28}
              rx={4}
              fill={
                isFocused
                  ? 'var(--accent-soft)'
                  : isAttended
                  ? `rgba(255, 181, 71, ${0.05 + attendedAlpha * 0.25})`
                  : 'var(--bg-elev)'
              }
              stroke={isFocused ? 'var(--accent)' : isAttended ? 'var(--accent-line)' : 'var(--line)'}
              strokeWidth={isFocused ? 1.5 : 1}
            />
            <text
              y={5}
              textAnchor="middle"
              fontSize="13"
              fontFamily="var(--mono)"
              fill={isFocused ? 'var(--accent)' : isAttended ? 'var(--ink)' : 'var(--ink-soft)'}
            >
              {tokens[i]}
            </text>
            {isAttended && (
              <text
                y={-22}
                textAnchor="middle"
                fontSize="9"
                fontFamily="var(--mono)"
                fill="var(--accent)"
              >
                {weights[focusedIdx!][i].toFixed(2)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
