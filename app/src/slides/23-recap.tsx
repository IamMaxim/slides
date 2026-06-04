import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Eyebrow, SlideTitle } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

const TOPICS: { idx: number; n: string; t: string; sub: string }[] = [
  { idx: 1, n: '01', t: 'Neuron', sub: 'a tiny weighted-sum + activation' },
  { idx: 2, n: '02', t: 'Network', sub: 'stack them, get a function approximator' },
  { idx: 3, n: '03', t: 'Transformer block', sub: 'attention + feed-forward, with residuals' },
  { idx: 4, n: '04', t: 'LLM', sub: 'embed → N blocks → unembed → distribution' },
  { idx: 5, n: '05', t: 'Tokens', sub: 'what the model actually reads' },
  { idx: 6, n: '06', t: 'Tokenizer', sub: 'how text becomes IDs' },
  { idx: 7, n: '07', t: 'Attention', sub: 'tokens look at each other; Q · K · V' },
  { idx: 9, n: '08', t: 'Next-token loop', sub: "the model's only trick" },
  { idx: 10, n: '09', t: 'Chat', sub: 'role markers wrapped around turns' },
  { idx: 11, n: '10', t: 'Tools', sub: 'model writes JSON, harness runs it' },
  { idx: 12, n: '11', t: 'Agent loop', sub: 'model ↔ tools ↔ world' },
  { idx: 13, n: '12', t: 'Harness', sub: 'the runtime that drives the loop' },
  { idx: 14, n: '13', t: 'Compaction', sub: 'how a finite window keeps going' },
  { idx: 15, n: '14', t: 'No learning', sub: "weights are frozen — agents don't update" },
  { idx: 16, n: '15', t: 'Memory', sub: 'external files, written by tool calls' },
  { idx: 17, n: '16', t: 'Memory approaches', sub: 'notes · auto · scratchpad · RAG' },
  { idx: 18, n: '17', t: 'System prompts', sub: 'layered instructions, priority order' },
  { idx: 19, n: '18', t: 'Skills', sub: 'instructions loaded on demand' },
  { idx: 20, n: '19', t: 'Dense vs MoE', sub: 'all params, or a committee per token' },
  { idx: 21, n: '20', t: 'Model zoo', sub: 'who steers well as an agent — and why' },
];

export const recapSlide: Slide = {
  id: 'recap',
  title: 'recap',
  totalSteps: 1,
  render: () => (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', height: '100%', gap: 16 }}>
      <Stack gap={8}>
        <Eyebrow>thank you · 21</Eyebrow>
        <SlideTitle size="md">It's neurons all the way up, and a loop all the way out.</SlideTitle>
      </Stack>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
          alignContent: 'start',
        }}
      >
        {TOPICS.map((tp, i) => (
          <motion.a
            key={tp.n}
            href={`#${tp.idx}/0`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.02 }}
            style={{
              display: 'block',
              padding: '8px 13px',
              background: 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderRadius: 4,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'border 200ms, transform 200ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-line)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--line)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--accent)',
              }}
            >
              {tp.n}
            </div>
            <div
              style={{
                fontFamily: 'var(--display)',
                fontStyle: 'italic',
                fontSize: 17,
                fontWeight: 300,
                color: 'var(--ink)',
                marginTop: 2,
                lineHeight: 1.1,
              }}
            >
              {tp.t}
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--ink-mute)',
                marginTop: 2,
                lineHeight: 1.3,
              }}
            >
              {tp.sub}
            </div>
          </motion.a>
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          fontFamily: 'var(--mono)',
          fontSize: 12,
          color: 'var(--ink-mute)',
        }}
      >
        <span
          style={{
            width: 40,
            height: 1,
            background: 'var(--ink-mute)',
          }}
        />
        click any tile to jump back · press 0 for the title slide
      </div>
    </div>
  ),
};
