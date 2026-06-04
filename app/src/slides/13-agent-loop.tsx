import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

function LoopDiagram({ step }: { step: number }) {
  // step 0: model only
  // step 1: + tools
  // step 2: + environment / world
  // step 3: + loop arrows
  // step 4: + 'this loop is the agent' annotation
  const W = 580;
  const H = 500;
  const cx = W / 2;

  // positions
  const modelPos = { x: cx, y: 150 };
  const toolsPos = { x: cx - 170, y: 340 };
  const worldPos = { x: cx + 170, y: 340 };

  function Node({
    pos,
    label,
    sub,
    color,
    visible,
    radius = 60,
    delay = 0,
  }: {
    pos: { x: number; y: number };
    label: string;
    sub: string;
    color: string;
    visible: boolean;
    radius?: number;
    delay?: number;
  }) {
    return (
      <motion.g
        initial={false}
        animate={{ opacity: visible ? 1 : 0, scale: visible ? 1 : 0.92 }}
        transition={{ duration: 0.35, delay }}
      >
        <circle
          cx={pos.x}
          cy={pos.y}
          r={radius}
          fill="var(--bg-elev)"
          stroke={color}
          strokeWidth="1.5"
        />
        <text
          x={pos.x}
          y={pos.y - 4}
          textAnchor="middle"
          fontFamily="var(--display)"
          fontStyle="italic"
          fontSize="20"
          fill={color}
        >
          {label}
        </text>
        <text
          x={pos.x}
          y={pos.y + 18}
          textAnchor="middle"
          fontFamily="var(--mono)"
          fontSize="11"
          fill="var(--ink-mute)"
          letterSpacing="0.08em"
        >
          {sub}
        </text>
      </motion.g>
    );
  }

  function Arrow({
    from,
    to,
    label,
    visible,
    color = 'var(--ink-soft)',
    curve = 0,
    delay = 0,
  }: {
    from: { x: number; y: number };
    to: { x: number; y: number };
    label?: string;
    visible: boolean;
    color?: string;
    curve?: number;
    delay?: number;
  }) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const len = Math.sqrt(dx * dx + dy * dy);
    const ux = dx / len;
    const uy = dy / len;
    // shorten by node radius (60)
    const x1 = from.x + ux * 60;
    const y1 = from.y + uy * 60;
    const x2 = to.x - ux * 64;
    const y2 = to.y - uy * 64;
    const midX = (x1 + x2) / 2 + curve * -uy * 30;
    const midY = (y1 + y2) / 2 + curve * ux * 30;
    const d = `M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`;
    return (
      <motion.g
        initial={false}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, delay }}
      >
        <path d={d} fill="none" stroke={color} strokeWidth="1.2" markerEnd="url(#aarr)" />
        {label && (
          <text
            x={midX}
            y={midY - 6}
            textAnchor="middle"
            fontSize="12"
            fontFamily="var(--mono)"
            fill={color}
            letterSpacing="0.08em"
          >
            {label}
          </text>
        )}
      </motion.g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', maxWidth: 620 }}>
      <defs>
        <marker id="aarr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--ink-soft)" />
        </marker>
      </defs>

      <Node pos={modelPos} label="model" sub="LLM" color="var(--accent)" visible />
      <Node pos={toolsPos} label="tools" sub="functions" color="var(--cool)" visible={step >= 1} delay={0.05} />
      <Node pos={worldPos} label="world" sub="state · effects" color="var(--ink-soft)" visible={step >= 2} delay={0.1} />

      <Arrow from={modelPos} to={toolsPos} label="tool_use" visible={step >= 3} curve={1} delay={0.1} color="var(--accent)" />
      <Arrow from={toolsPos} to={worldPos} label="run" visible={step >= 3} delay={0.18} />
      <Arrow from={worldPos} to={toolsPos} label="effect" visible={step >= 3} curve={-1} delay={0.26} />
      <Arrow from={toolsPos} to={modelPos} label="tool_result" visible={step >= 3} curve={1} delay={0.34} color="var(--cool)" />

      {/* annotation */}
      <motion.g
        initial={false}
        animate={{ opacity: step >= 4 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <rect
          x={cx - 130}
          y={H - 60}
          width={260}
          height={36}
          rx={4}
          fill="var(--accent-soft)"
          stroke="var(--accent-line)"
        />
        <text
          x={cx}
          y={H - 38}
          textAnchor="middle"
          fontSize="13"
          fontFamily="var(--mono)"
          fill="var(--accent)"
          letterSpacing="0.1em"
        >
          this loop = the agent
        </text>
      </motion.g>
    </svg>
  );
}

export const agentLoopSlide: Slide = {
  id: 'agent-loop',
  title: 'the agent loop',
  totalSteps: 5,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>evolution · 11</Eyebrow>
          <SlideTitle size="md">An agent is a model in a loop with tools.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Start with just the model. It can talk, but it can't <em>do</em> anything.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Give it tools — functions it can call. Now it can read files, search the web, run code.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Those tools touch the real world: a file system, a database, an API, your terminal. Effects accumulate.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                The model emits a tool call. Someone runs it. The result comes back. The model decides what to do next. Loop.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                <span style={{ color: 'var(--ink)' }}>That's the whole thing.</span> Everything else — planning, memory, sub-agents — is structure layered onto this loop.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoopDiagram step={step} />
        </div>
      }
    />
  ),
};
