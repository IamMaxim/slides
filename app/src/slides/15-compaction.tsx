import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

type Block =
  | { kind: 'turn'; role: 'user' | 'assistant' | 'tool'; weight: number; label: string }
  | { kind: 'summary'; label: string };

const TURNS: Block[] = [
  { kind: 'turn', role: 'user', weight: 1, label: 'plan the refactor' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'outline · 4 steps' },
  { kind: 'turn', role: 'tool', weight: 5, label: 'read 12 files' },
  { kind: 'turn', role: 'assistant', weight: 3, label: 'analysis' },
  { kind: 'turn', role: 'tool', weight: 6, label: 'grep usages' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'edits proposed' },
  { kind: 'turn', role: 'tool', weight: 8, label: 'edit 6 files' },
  { kind: 'turn', role: 'tool', weight: 4, label: 'run tests' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'tests pass' },
  { kind: 'turn', role: 'user', weight: 1, label: 'now docs' },
  { kind: 'turn', role: 'assistant', weight: 2, label: 'docs draft' },
];

const SUMMARY: Block = {
  kind: 'summary',
  label:
    'summary · refactor complete · 6 files edited · tests pass · docs drafted',
};

function colorFor(b: Block, dim: boolean) {
  if (b.kind === 'summary') {
    return dim ? 'rgba(123, 214, 195, 0.25)' : 'var(--cool)';
  }
  if (b.role === 'user') return dim ? 'rgba(174, 167, 152, 0.2)' : 'var(--ink-soft)';
  if (b.role === 'assistant') return dim ? 'rgba(255, 181, 71, 0.18)' : 'var(--accent)';
  return dim ? 'rgba(255, 181, 71, 0.1)' : 'rgba(255, 181, 71, 0.55)';
}

export const compactionSlide: Slide = {
  id: 'compaction',
  title: 'compaction',
  totalSteps: 4,
  render: ({ step }) => <CompactionSlide step={step} />,
};

function CompactionSlide({ step }: { step: number }) {
  const showHighlight = step >= 1;
  const showSummary = step >= 2;
  const showContinued = step >= 3;

  // Build the layout: full bar (step 0/1), highlight first half (1), replaced (2), continued (3+)
  const visibleTurns =
    step < 2
      ? TURNS
      : step === 2
      ? [SUMMARY, ...TURNS.slice(-4)]
      : [SUMMARY, ...TURNS.slice(-4), { kind: 'turn', role: 'assistant', weight: 3, label: 'next: deploy plan' } as Block];

  const totalWeight = visibleTurns.reduce(
    (s, b) => s + (b.kind === 'summary' ? 2 : b.weight),
    0
  );

  return (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>memory · 13</Eyebrow>
          <SlideTitle size="md">Context is finite. Compaction is how it scrolls.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Every conversation lives inside the model's context window — usually 200k tokens for modern models. Every turn, every tool result, the system prompt: all of it counts.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                As the conversation grows, the window fills up. Old turns get crowded out — and the model would have to forget them, hard, with no recourse.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Instead, the harness asks the model itself to <span style={{ color: 'var(--cool)' }}>summarize</span> the older portion. The summary replaces the original turns in the context.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Now the conversation keeps going. Recent turns stay verbatim; older ones live on as a compact summary the model can refer back to. Trade-off: precision lost, continuity preserved.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={20}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--ink-mute)',
            }}
          >
            context window
          </div>
          <div
            style={{
              width: '100%',
              border: '1px solid var(--line)',
              borderRadius: 6,
              overflow: 'hidden',
              background: 'var(--bg-elev)',
            }}
          >
            <div style={{ display: 'flex', height: 128, position: 'relative' }}>
              <AnimatePresence initial={false}>
                {visibleTurns.map((b, i) => {
                  const isOld = step === 1 && i < TURNS.length - 4;
                  const weight = b.kind === 'summary' ? 2 : b.weight;
                  return (
                    <motion.div
                      key={`${b.kind}-${b.label}-${i}`}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      style={{
                        flex: `${weight} ${weight} 0`,
                        minWidth: 0,
                        overflow: 'hidden',
                        background: colorFor(b, !isOld && !showHighlight && b.kind !== 'summary'),
                        borderRight: '1px solid var(--bg-elev)',
                        outline: isOld ? '1.5px solid var(--accent)' : 'none',
                        outlineOffset: -1,
                        display: 'flex',
                        alignItems: 'flex-end',
                        padding: 6,
                        position: 'relative',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--mono)',
                          fontSize: 9.5,
                          color: b.kind === 'summary' ? 'var(--bg)' : 'var(--bg)',
                          opacity: 0.9,
                          letterSpacing: '0.04em',
                          lineHeight: 1.1,
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          width: '100%',
                        }}
                      >
                        {b.kind === 'summary' ? '∑ ' + b.label : b.label}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '10px 14px',
                fontFamily: 'var(--mono)',
                fontSize: 11,
                color: 'var(--ink-mute)',
                borderTop: '1px solid var(--line)',
              }}
            >
              <span>
                {step < 2 ? `${TURNS.length} turns · ~${totalWeight * 1500} tokens used` : 'recent turns kept verbatim'}
              </span>
              <span>200k cap</span>
            </div>
          </div>

          <Stack gap={6}>
            <Build step={step} appearAt={1}>
              <Caption color="var(--accent)">
                ↑ harness flags the older block as eligible for compaction
              </Caption>
            </Build>
            <Build step={step} appearAt={2}>
              <Caption color="var(--cool)">
                ↑ summary block replaces the original turns
              </Caption>
            </Build>
            <Build step={step} appearAt={3}>
              <Caption color="var(--ink-soft)">
                ↑ conversation continues with plenty of headroom
              </Caption>
            </Build>
          </Stack>
          {/* prevent unused var warning when showContinued not directly used elsewhere */}
          {showContinued && null}
          {showSummary && null}
        </Stack>
      }
    />
  );
}

function Caption({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 11,
        color,
        letterSpacing: '0.06em',
      }}
    >
      {children}
    </span>
  );
}
