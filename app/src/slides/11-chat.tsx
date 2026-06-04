import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const COMPLETION = `Once upon a time, there was a curious engineer who wanted to know how language models worked. They opened a notebook and started by`;

const TEMPLATED = [
  { role: 'system', text: 'You are a helpful, terse assistant.' },
  { role: 'user', text: 'What does an LLM see when I send a chat message?' },
  { role: 'assistant', text: 'A sequence of tokens, with role markers wrapped around each turn.' },
  { role: 'user', text: 'Show me an example.' },
];

function CompletionView() {
  return (
    <div
      style={{
        padding: 18,
        background: 'var(--bg-elev)',
        border: '1px solid var(--line)',
        borderRadius: 6,
        fontFamily: 'var(--mono)',
        fontSize: 14,
        lineHeight: 1.6,
        color: 'var(--ink-soft)',
        minHeight: 200,
      }}
    >
      <span>{COMPLETION}</span>
      <motion.span
        animate={{ opacity: [1, 0.1, 1] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ color: 'var(--accent)' }}
      >
        ▍
      </motion.span>
    </div>
  );
}

function TemplateView({ withRoles, multiTurn }: { withRoles: boolean; multiTurn: boolean }) {
  const turns = multiTurn ? TEMPLATED : TEMPLATED.slice(0, 2);
  return (
    <div
      style={{
        padding: 14,
        background: 'var(--bg-elev)',
        border: '1px solid var(--line)',
        borderRadius: 6,
        fontFamily: 'var(--mono)',
        fontSize: 13,
        lineHeight: 1.55,
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {turns.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: i * 0.06 }}
        >
          {withRoles && (
            <div
              style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color:
                  t.role === 'system'
                    ? 'var(--ink-mute)'
                    : t.role === 'user'
                    ? 'var(--cool)'
                    : 'var(--accent)',
                marginBottom: 4,
              }}
            >
              ⟨{t.role}⟩
            </div>
          )}
          <div style={{ color: 'var(--ink-soft)', paddingLeft: withRoles ? 4 : 0 }}>{t.text}</div>
        </motion.div>
      ))}
    </div>
  );
}

export const chatSlide: Slide = {
  id: 'chat',
  title: 'completion → chat',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.1fr"
      left={
        <Stack gap={20}>
          <Eyebrow>evolution · 09</Eyebrow>
          <SlideTitle size="md">Chat is the same loop, just dressed differently.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Originally LLMs just continued whatever text you handed them. Drop in <em>"Once upon a time"</em>, the model writes the story.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                For chat, we wrap each turn in special <span style={{ color: 'var(--accent)' }}>role markers</span> baked into the training data — system, user, assistant. The model learns to switch behavior based on which role it's currently completing.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                The "conversation" is just one long sequence of tokens with these markers in between. Each new user message extends the same sequence; the model fills in the next assistant turn.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={16}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: step >= 1 ? 'var(--ink-mute)' : 'var(--accent)',
              transition: 'color 300ms',
            }}
          >
            {step >= 1 ? 'before: raw completion' : 'raw completion'}
          </div>
          <div style={{ opacity: step >= 1 ? 0.45 : 1, transition: 'opacity 300ms' }}>
            <CompletionView />
          </div>

          <Build step={step} appearAt={1}>
            <div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  marginBottom: 10,
                }}
              >
                with chat template
              </div>
              <TemplateView withRoles multiTurn={step >= 2} />
            </div>
          </Build>
        </Stack>
      }
    />
  ),
};
