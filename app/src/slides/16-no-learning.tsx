import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

function FrozenModelDiagram({ step }: { step: number }) {
  // step 0: idle
  // step 1: lock + weights frozen highlight
  // step 2: two sessions side by side, identical model
  // step 3: arrow showing "nothing transferred"
  const W = 660;
  const H = 410;
  const AX = 120; // session A center
  const BX = 540; // session B center
  const MID = W / 2;
  const MY = 272; // model circle center-y

  function Session({
    x,
    label,
    sub,
    visible,
    delay,
  }: {
    x: number;
    label: string;
    sub: string;
    visible: boolean;
    delay: number;
  }) {
    return (
      <motion.g
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 8 }}
        transition={{ duration: 0.4, delay }}
      >
        {/* session frame */}
        <rect
          x={x - 93}
          y={128}
          width={186}
          height={252}
          rx={6}
          fill="var(--bg-elev)"
          stroke="var(--line)"
          strokeDasharray="3 3"
        />
        <text
          x={x}
          y={154}
          textAnchor="middle"
          fontSize="11"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          letterSpacing="0.18em"
        >
          {sub}
        </text>
        <text
          x={x}
          y={178}
          textAnchor="middle"
          fontSize="15"
          fontFamily="var(--mono)"
          fill="var(--ink-soft)"
          letterSpacing="0.1em"
        >
          {label}
        </text>
        {/* identical model */}
        <circle
          cx={x}
          cy={MY}
          r={48}
          fill="var(--bg-elev)"
          stroke="var(--accent)"
          strokeWidth="1.8"
        />
        <text
          x={x}
          y={MY - 2}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="19"
          fill="var(--accent)"
        >
          model
        </text>
        <text
          x={x}
          y={MY + 16}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="10"
          fill="var(--ink-mute)"
          letterSpacing="0.08em"
        >
          same weights
        </text>
        {/* lock badge */}
        <g transform={`translate(${x + 40}, ${MY - 34})`}>
          <circle r={12} fill="var(--bg)" stroke="var(--accent)" strokeWidth="1" />
          <text textAnchor="middle" y={4} fontSize="12" fontFamily="var(--mono)" fill="var(--accent)">
            ⌬
          </text>
        </g>
        {/* prompt below */}
        <rect
          x={x - 74}
          y={332}
          width={148}
          height={34}
          rx={3}
          fill="rgba(123, 214, 195, 0.08)"
          stroke="rgba(123, 214, 195, 0.3)"
        />
        <text
          x={x}
          y={354}
          textAnchor="middle"
          fontSize="12"
          fontFamily="var(--mono)"
          fill="var(--cool)"
        >
          prompt
        </text>
      </motion.g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 660 }}>
      <defs>
        <marker id="frozarr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--warn)" />
        </marker>
      </defs>

      {/* top label */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <text
          x={MID}
          y={56}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="26"
          fill="var(--accent)"
        >
          weights are frozen
        </text>
        <text
          x={MID}
          y={84}
          textAnchor="middle"
          fontSize="11.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          letterSpacing="0.14em"
        >
          TRAINED ONCE · IMMUTABLE · NEVER UPDATED BY YOUR USE
        </text>
      </motion.g>

      <Session x={AX} label="monday" sub="SESSION A" visible={step >= 2} delay={0.0} />
      <Session x={BX} label="friday" sub="SESSION B" visible={step >= 2} delay={0.15} />

      {/* arrow between with "nothing learned" annotation */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <line
          x1={AX + 96}
          y1={MY}
          x2={BX - 96}
          y2={MY}
          stroke="var(--warn)"
          strokeWidth="1.4"
          strokeDasharray="4 3"
          markerEnd="url(#frozarr)"
        />
        <text
          x={MID}
          y={MY - 16}
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--mono)"
          fill="var(--warn)"
          letterSpacing="0.08em"
        >
          nothing learned
        </text>
        <text
          x={MID}
          y={MY + 26}
          textAnchor="middle"
          fontSize="10.5"
          fontFamily="var(--mono)"
          fill="var(--ink-mute)"
          letterSpacing="0.06em"
        >
          model has no idea session A happened
        </text>
      </motion.g>
    </svg>
  );
}

export const noLearningSlide: Slide = {
  id: 'no-learning',
  title: 'agents don’t learn',
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>memory · 13a</Eyebrow>
          <SlideTitle size="md">First: agents don’t learn from you.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                <em>"Just use the agent for a while and it’ll learn your style"</em> — this comes up a lot. It’s wrong.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                The model’s <span style={{ color: 'var(--accent)' }}>weights are frozen</span> after training. Training happened once, in advance, on a cluster of GPUs. Your conversations don’t update them. Nothing you do does.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Every API call starts from the same fixed weights. Session A on Monday and session B on Friday talk to the <span style={{ color: 'var(--accent)' }}>exact same model</span>.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Inside a single session, "memory" is just the context window — the harness keeps appending to the prompt. Close the window and that prompt is gone. The model has no recollection.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <FrozenModelDiagram step={step} />
        </div>
      }
    />
  ),
};
