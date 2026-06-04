import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Layer = {
  role: string;
  who: string;
  example: string;
  priority: number;
  color: string;
};

const LAYERS: Layer[] = [
  {
    role: 'system',
    who: 'set by the AI provider (Anthropic, OpenAI)',
    example: '"You are Claude, made by Anthropic. Be helpful and harmless..."',
    priority: 1,
    color: 'var(--ink-soft)',
  },
  {
    role: 'developer',
    who: 'set by the harness or app developer',
    example:
      '"You are Claude Code. Use TaskCreate to plan multi-step work. Always read files before editing them..."',
    priority: 2,
    color: 'var(--accent)',
  },
  {
    role: 'user',
    who: 'whoever is chatting',
    example: '"Refactor this module to remove the deprecated API."',
    priority: 3,
    color: 'var(--cool)',
  },
];

export const systemPromptsSlide: Slide = {
  id: 'system-prompts',
  title: 'system prompts',
  totalSteps: 2,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>configuration · 14</Eyebrow>
          <SlideTitle size="md">System prompts are layered instructions, in priority order.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Before the user ever types anything, the model has already read a stack of instructions: how to behave, what tools exist, what conventions to follow.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                These layers have an implicit priority. If they conflict, the model is trained to follow the higher layer first — the provider's safety policies win over your project's preferences, which win over an off-the-cuff user request.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={14}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
            }}
          >
            priority — highest at top
          </div>
          {LAYERS.map((l, i) => (
            <motion.div
              key={l.role}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.1 }}
              style={{
                position: 'relative',
                padding: '16px 18px 16px 60px',
                background: 'var(--bg-elev)',
                border: '1px solid var(--line)',
                borderLeft: `3px solid ${l.color}`,
                borderRadius: 4,
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 16,
                  top: 18,
                  fontFamily: 'var(--display)',
                  fontStyle: 'italic',
                  fontSize: 28,
                  color: l.color,
                  fontWeight: 300,
                  lineHeight: 1,
                }}
              >
                {l.priority}
              </div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: l.color,
                  marginBottom: 4,
                }}
              >
                ⟨{l.role}⟩
              </div>
              <div style={{ color: 'var(--ink-mute)', fontSize: 12, marginBottom: 8 }}>{l.who}</div>
              <div
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 13,
                  color: 'var(--ink-soft)',
                  lineHeight: 1.5,
                }}
              >
                {l.example}
              </div>
            </motion.div>
          ))}
        </Stack>
      }
    />
  ),
};
