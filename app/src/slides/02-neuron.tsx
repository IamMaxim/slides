import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const inputs = [0.8, 0.2, 0.6, 0.9];
const weights = [0.4, -0.7, 0.9, 0.2];

function NeuronDiagram({ step }: { step: number }) {
  // step 0: blank dot
  // step 1: inputs visible
  // step 2: weights visible (on edges)
  // step 3: weighted sum (z =)
  // step 4: activation (sigma)
  // step 5: output value
  const cx = 320;
  const cy = 220;
  const r = 46;
  const inputX = 80;
  const inputYs = [80, 160, 240, 320];
  const outputX = 568;

  return (
    <svg
      viewBox="0 0 640 440"
      style={{ width: '100%', maxWidth: 720, fontFamily: 'var(--mono)' }}
    >
      <defs>
        <marker
          id="arr"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-mute)" />
        </marker>
        <marker
          id="arr-a"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* Inputs */}
      {inputYs.map((y, i) => (
        <motion.g
          key={i}
          initial={false}
          animate={{ opacity: step >= 1 ? 1 : 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
        >
          <circle cx={inputX} cy={y} r="17" fill="var(--bg-elev)" stroke="var(--ink-mute)" strokeWidth="1.3" />
          <text
            x={inputX}
            y={y + 5}
            textAnchor="middle"
            fontSize="14"
            fill="var(--ink-soft)"
          >
            x{i + 1}
          </text>
          <text
            x={inputX - 32}
            y={y + 5}
            textAnchor="end"
            fontSize="12"
            fill="var(--ink-mute)"
          >
            {inputs[i].toFixed(1)}
          </text>
        </motion.g>
      ))}

      {/* Edges + weights */}
      {inputYs.map((y, i) => {
        const visible = step >= 1;
        const showWeight = step >= 2;
        const midX = (inputX + cx) / 2;
        const midY = (y + cy) / 2;
        return (
          <motion.g
            key={`e-${i}`}
            initial={false}
            animate={{ opacity: visible ? 1 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
          >
            <line
              x1={inputX + 17}
              y1={y}
              x2={cx - r}
              y2={cy}
              stroke={showWeight ? 'var(--accent-line)' : 'var(--ink-mute)'}
              strokeWidth={showWeight ? 1.2 + Math.abs(weights[i]) * 2.4 : 1.1}
              markerEnd="url(#arr)"
              style={{ transition: 'stroke 300ms, stroke-width 300ms' }}
            />
            {showWeight && (
              <motion.text
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                x={midX}
                y={midY - 8}
                textAnchor="middle"
                fontSize="13"
                fill="var(--accent)"
              >
                w{i + 1}={weights[i].toFixed(1)}
              </motion.text>
            )}
          </motion.g>
        );
      })}

      {/* Neuron body */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="var(--bg-elev)"
        stroke="var(--accent)"
        strokeWidth="1.8"
      />
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        fontSize="14"
        fill="var(--ink-soft)"
        fontFamily="var(--display)"
        fontStyle="italic"
      >
        neuron
      </text>

      {/* z = sum */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize="13" fill="var(--ink)">
          z = Σ wᵢ xᵢ
        </text>
      </motion.g>

      {/* activation */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <text x={cx} y={cy + 32} textAnchor="middle" fontSize="15" fill="var(--accent)">
          σ(z)
        </text>
      </motion.g>

      {/* Output */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 5 ? 1 : 0 }}
        transition={{ duration: 0.35 }}
      >
        <line
          x1={cx + r}
          y1={cy}
          x2={outputX - 17}
          y2={cy}
          stroke="var(--accent)"
          strokeWidth="2.2"
          markerEnd="url(#arr-a)"
        />
        <circle cx={outputX} cy={cy} r="17" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" />
        <text x={outputX} y={cy + 5} textAnchor="middle" fontSize="14" fill="var(--accent)">
          y
        </text>
        <text x={outputX} y={cy + 40} textAnchor="middle" fontSize="12" fill="var(--ink-mute)">
          0.73
        </text>
      </motion.g>
    </svg>
  );
}

export const neuronSlide: Slide = {
  id: 'neuron',
  title: 'the neuron',
  totalSteps: 6,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>building block · 01</Eyebrow>
          <SlideTitle>A neuron is a small function.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={1}>
              <BodyText>It takes in some numbers — inputs from other neurons or from raw data.</BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                It multiplies each input by a learned <span style={{ color: 'var(--accent)' }}>weight</span> — a knob the network turns during training.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>It adds them up.</BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                It runs the sum through a non-linear <span style={{ color: 'var(--accent)' }}>activation</span> like ReLU or sigmoid. (This is what lets stacks of neurons learn non-trivial shapes.)
              </BodyText>
            </Build>
            <Build step={step} appearAt={5}>
              <BodyText>And out comes one number — which becomes the input to the next layer.</BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NeuronDiagram step={step} />
        </div>
      }
    />
  ),
};
