import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Skill = {
  name: string;
  triggers: string;
  loaded: boolean;
};

const SKILLS: Skill[] = [
  { name: 'brainstorming', triggers: 'before any creative work', loaded: true },
  { name: 'debugging', triggers: 'before fixing a bug', loaded: false },
  { name: 'test-driven-dev', triggers: 'before writing implementation', loaded: false },
  { name: 'frontend-design', triggers: 'when building UI', loaded: true },
  { name: 'writing-plans', triggers: 'after a spec is ready', loaded: false },
  { name: 'verify', triggers: 'before claiming done', loaded: false },
  { name: 'huly', triggers: 'when working with huly.app', loaded: false },
  { name: 'claude-api', triggers: 'in Anthropic SDK projects', loaded: false },
];

export const skillsSlide: Slide = {
  id: 'skills',
  title: 'skills',
  totalSteps: 3,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>configuration · 15</Eyebrow>
          <SlideTitle size="md">Skills: instructions the model loads when relevant.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Telling the model everything you know up front bloats the prompt and dilutes attention. Most of those instructions are only relevant some of the time.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                A <span style={{ color: 'var(--accent)' }}>skill</span> is a small, named bundle of instructions — and sometimes extra tools or examples — paired with a description of when to use it.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                The harness keeps only the description in the prompt; the body is loaded on demand when the model decides the skill applies to the current task. Less clutter, more capability.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
              marginBottom: 12,
            }}
          >
            available skills
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {SKILLS.map((s, i) => {
              const isLoaded = step >= 2 && s.loaded;
              return (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.04 * i }}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr 80px',
                    alignItems: 'center',
                    gap: 16,
                    padding: '10px 14px',
                    background: isLoaded ? 'var(--accent-soft)' : 'var(--bg-elev)',
                    border: `1px solid ${isLoaded ? 'var(--accent-line)' : 'var(--line)'}`,
                    borderRadius: 4,
                    transition: 'background 300ms, border 300ms',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 13,
                      color: isLoaded ? 'var(--accent)' : 'var(--ink)',
                    }}
                  >
                    {s.name}
                  </span>
                  <span style={{ fontSize: 13, color: 'var(--ink-soft)' }}>{s.triggers}</span>
                  <span
                    style={{
                      fontFamily: 'var(--mono)',
                      fontSize: 10,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: isLoaded ? 'var(--accent)' : 'var(--ink-mute)',
                      textAlign: 'right',
                    }}
                  >
                    {isLoaded ? '● loaded' : step >= 1 ? '○ idle' : '○ idle'}
                  </span>
                </motion.div>
              );
            })}
          </div>
          <Build step={step} appearAt={2}>
            <div
              style={{
                marginTop: 18,
                padding: '12px 14px',
                border: '1px dashed var(--accent-line)',
                borderRadius: 4,
                background: 'rgba(255, 181, 71, 0.06)',
                fontFamily: 'var(--mono)',
                fontSize: 12,
                color: 'var(--accent)',
              }}
            >
              # task: "redesign the deck shell"
              <br />→ matches <span style={{ color: 'var(--ink)' }}>brainstorming</span>,{' '}
              <span style={{ color: 'var(--ink)' }}>frontend-design</span>. Their full bodies are loaded into context.
            </div>
          </Build>
        </div>
      }
    />
  ),
};
