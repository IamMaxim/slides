import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

function NetworkDiagram({ step }: { step: number }) {
  // step 0: one neuron
  // step 1: a layer (column of neurons)
  // step 2: many layers
  // step 3: caption: function approximator (handled outside)
  const layers = step >= 2 ? 5 : step >= 1 ? 3 : 1;
  const perLayer = step >= 1 ? 5 : 1;
  const cols = step >= 2 ? layers : step >= 1 ? 3 : 1;

  const colsToRender = Array.from({ length: cols }, (_, i) => i);
  const W = 640;
  const H = 380;
  const gapX = W / (cols + 1);
  const gapY = H / (perLayer + 1);

  function pos(c: number, r: number) {
    return { x: gapX * (c + 1), y: gapY * (r + 1) };
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 720 }}>
      {/* edges between layers */}
      {colsToRender.slice(0, -1).map((c) =>
        Array.from({ length: perLayer }).map((_, r1) =>
          Array.from({ length: perLayer }).map((_, r2) => {
            const a = pos(c, r1);
            const b = pos(c + 1, r2);
            return (
              <motion.line
                key={`${c}-${r1}-${r2}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--accent)"
                strokeWidth="1"
                initial={false}
                animate={{ opacity: step >= 1 ? 0.28 : 0 }}
                transition={{ duration: 0.4 }}
              />
            );
          })
        )
      )}
      {/* nodes */}
      {colsToRender.map((c) =>
        Array.from({ length: c === 0 && step < 1 ? 1 : perLayer }).map((_, r) => {
          const { x, y } = pos(c, step < 1 ? 2 : r);
          const isFirst = c === 0 && r === 2;
          const isLast = c === cols - 1 && r === 2;
          const isAccent = c === 0 && step < 1;
          return (
            <motion.circle
              key={`n-${c}-${r}`}
              initial={false}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: c * 0.04 }}
              cx={x}
              cy={y}
              r={isAccent ? 17 : 12}
              fill={isAccent ? 'var(--bg-elev)' : 'var(--bg-elev)'}
              stroke={isAccent ? 'var(--accent)' : isFirst || isLast ? 'var(--ink-soft)' : 'var(--ink-mute)'}
              strokeWidth={isAccent ? 2 : 1.4}
            />
          );
        })
      )}
      {/* layer labels */}
      {step >= 2 &&
        colsToRender.map((c) => (
          <text
            key={`lbl-${c}`}
            x={gapX * (c + 1)}
            y={H - 10}
            textAnchor="middle"
            fontSize="13"
            fontFamily="var(--mono)"
            fill={c === 0 ? 'var(--accent)' : c === cols - 1 ? 'var(--cool)' : 'var(--ink-mute)'}
            letterSpacing="0.1em"
          >
            {c === 0 ? 'INPUT' : c === cols - 1 ? 'OUTPUT' : `HIDDEN ${c}`}
          </text>
        ))}
    </svg>
  );
}

export const networkSlide: Slide = {
  id: 'network',
  title: 'the network',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>building block · 02</Eyebrow>
          <SlideTitle>Stack them, and you have a network.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={1}>
              <BodyText>
                Put many neurons side by side and you get a <span style={{ color: 'var(--accent)' }}>layer</span>.
                Every neuron in the layer sees the same inputs, but each has its own weights.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Feed one layer's outputs into the next, repeat, and you get a deep network.
                The neurons in the middle learn intermediate features no one explicitly named.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText size="lg">
                <span style={{ color: 'var(--ink)' }}>This is a function approximator.</span>{' '}
                Given enough neurons and the right weights, it can learn almost any input-to-output mapping.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NetworkDiagram step={step} />
        </div>
      }
    />
  ),
};
