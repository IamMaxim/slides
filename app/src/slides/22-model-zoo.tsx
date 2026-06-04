import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

type Row = {
  name: string;
  params: string;
  arch: string;
  agent: string;
  color: string;
  anchor?: boolean;
};

const ROWS: Row[] = [
  {
    name: 'Claude Opus 4.7',
    params: 'undisclosed*',
    arch: 'inferred MoE',
    agent: 'heavy agentic RL; very steerable across long tool loops',
    color: 'var(--ink-soft)',
  },
  {
    name: 'GPT-5.5',
    params: 'undisclosed*',
    arch: 'inferred MoE',
    agent: 'heavy agentic RL; very steerable',
    color: 'var(--ink-soft)',
  },
  {
    name: 'DeepSeek V4',
    params: '1.6T / 49B',
    arch: 'MoE',
    agent: 'big active budget; strongest open agent',
    color: 'var(--ink-soft)',
  },
  {
    name: 'GLM-5.1',
    params: '744B / 40B',
    arch: 'MoE',
    agent: 'strong open coding / agent model',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Kimi K2.6',
    params: '1T / 32B',
    arch: 'MoE',
    agent: 'long-horizon agent focus',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Qwen 3.5',
    params: '397B / 17B',
    arch: 'MoE · 512 experts',
    agent: 'huge knowledge, tiny active budget; strong but jumpy, hard to steer',
    color: 'var(--accent)',
    anchor: true,
  },
  {
    name: 'Llama 4',
    params: 'MoE (open)',
    arch: 'MoE',
    agent: 'open MoE; lighter agentic RL',
    color: 'var(--ink-soft)',
  },
  {
    name: 'Gemma 4',
    params: '31B / 31B',
    arch: 'dense',
    agent: 'small but fully predictable; every parameter fires',
    color: 'var(--cool)',
    anchor: true,
  },
];

const GRID = '210px 150px 190px 1fr';

export const modelZooSlide: Slide = {
  id: 'model-zoo',
  title: 'model zoo',
  totalSteps: 1,
  render: () => (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 14 }}>
      <Stack gap={6}>
        <Eyebrow>models · 16a</Eyebrow>
        <SlideTitle size="sm">The 2026 model zoo, by what actually matters for agents.</SlideTitle>
        <BodyText size="sm">
          Almost everything at the frontier is MoE now — so "MoE vs dense" isn't the story. What separates great
          agents is active budget, routing stability, and how much agentic RL went in.
        </BodyText>
      </Stack>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 6, alignContent: 'start' }}>
        {/* header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: GRID,
            gap: 16,
            padding: '4px 14px',
            fontFamily: 'var(--mono)',
            fontSize: 9,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          <span>model</span>
          <span>total / active</span>
          <span>architecture</span>
          <span>as an agent</span>
        </div>

        {ROWS.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            style={{
              display: 'grid',
              gridTemplateColumns: GRID,
              gap: 16,
              padding: '8px 14px',
              background: r.anchor ? 'var(--accent-soft)' : 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderLeft: `3px solid ${r.anchor ? r.color : 'var(--line)'}`,
              borderRadius: 4,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  fontSize: 18,
                  color: r.color,
                  lineHeight: 1.1,
                  fontWeight: 300,
                }}
              >
                {r.name}
              </span>
              {r.anchor && (
                <span style={{ fontFamily: 'var(--mono)', fontSize: 8.5, color: 'var(--ink-mute)', letterSpacing: '0.08em' }}>
                  ◀ prev slide
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink)', letterSpacing: '0.04em' }}>
              {r.params}
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 11.5, color: 'var(--ink-soft)', letterSpacing: '0.04em' }}>
              {r.arch}
            </div>
            <div style={{ color: 'var(--ink-soft)', fontSize: 12.5, lineHeight: 1.4 }}>{r.agent}</div>
          </motion.div>
        ))}

        <div
          style={{
            marginTop: 6,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 10,
          }}
        >
          <div
            style={{
              padding: '9px 14px',
              border: '1px dashed var(--line)',
              borderRadius: 4,
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--ink-mute)',
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: 'var(--accent)' }}>why Claude &amp; GPT win as agents.</span> Not because they're
            dense — almost certainly MoE too. A larger active budget + stabilized routing + vastly more agentic RL keep
            behavior consistent across reworded prompts, injected skills, and long tool loops.
          </div>
          <div
            style={{
              padding: '9px 14px',
              border: '1px dashed var(--line)',
              borderRadius: 4,
              fontFamily: 'var(--mono)',
              fontSize: 11,
              color: 'var(--ink-mute)',
              lineHeight: 1.45,
            }}
          >
            <span style={{ color: 'var(--cool)' }}>how open models close it.</span> Bigger active budgets or
            shared/always-on experts (less roulette), router stabilization (deterministic / distribution-based routing;
            align train- &amp; inference-time routers), and far more agentic RL — not more raw parameters.
          </div>
        </div>

        <div style={{ fontFamily: 'var(--mono)', fontSize: 9, color: 'var(--ink-mute)', marginTop: 2, paddingLeft: 14 }}>
          *closed-weight internals aren't public — MoE is inferred, not confirmed.
        </div>
      </div>
    </div>
  ),
};
