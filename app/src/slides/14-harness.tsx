import { motion } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Stack } from '../ui/Layout';

const RESPONSIBILITIES = [
  {
    name: 'Prompt assembly',
    detail: 'Picks the right system prompt, glues in skills, formats tool schemas, includes prior turns.',
  },
  {
    name: 'Tool execution',
    detail: 'Parses tool_use blocks, validates inputs, runs the function, captures the result.',
  },
  {
    name: 'State',
    detail: 'Tracks conversation history, files read, todos, the project working directory.',
  },
  {
    name: 'Retries & errors',
    detail: 'Handles model errors, rate limits, broken tool calls — sometimes silently, sometimes by asking the model to fix it.',
  },
  {
    name: 'Permissions',
    detail: 'Asks the user before running anything destructive. Filters which tools are even available.',
  },
  {
    name: 'Context budget',
    detail: 'Watches token usage. Triggers compaction when the window fills up.',
  },
];

const LOOP_CODE = `# the harness loop, roughly

state = init()
while True:
    prompt = state.assemble_prompt()
    response = model.call(prompt, tools=state.tools)
    state.add(response)

    if response.has_tool_use():
        result = execute_tool(response.tool_use)
        state.add(result)
        continue

    return response.text  # done`;

export const harnessSlide: Slide = {
  id: 'harness',
  title: 'the harness',
  totalSteps: 2,
  render: ({ step }) => (
    <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', gap: 20 }}>
      <Stack gap={12}>
        <Eyebrow>evolution · 12</Eyebrow>
        <SlideTitle size="md">A harness is the runtime that makes the loop go.</SlideTitle>
        <BodyText>
          You can think of it as the part of the system that isn't the model. Claude Code, Cursor, the OpenAI Responses API, your own custom agent — these are all harnesses.
        </BodyText>
      </Stack>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 40, alignItems: 'start' }}>
        <div>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 12,
            }}
          >
            what the harness owns
          </div>
          <Stack gap={8}>
            {RESPONSIBILITIES.map((r, i) => (
              <motion.div
                key={r.name}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '160px 1fr',
                  gap: 16,
                  padding: '10px 14px',
                  borderLeft: '2px solid var(--accent-line)',
                  background: 'var(--bg-elev)',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--mono)',
                    fontSize: 12,
                    color: 'var(--ink)',
                  }}
                >
                  {r.name}
                </span>
                <span style={{ color: 'var(--ink-soft)', fontSize: 14 }}>{r.detail}</span>
              </motion.div>
            ))}
          </Stack>
        </div>

        <Build step={step} appearAt={1}>
          <div>
            <div
              style={{
                fontFamily: 'var(--mono)',
                fontSize: 10,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'var(--cool)',
                marginBottom: 12,
              }}
            >
              the loop, in 10 lines
            </div>
            <pre
              style={{
                margin: 0,
                padding: 18,
                background: 'var(--bg-elev)',
                border: '1px solid var(--line)',
                borderRadius: 6,
                fontFamily: 'var(--mono)',
                fontSize: 13,
                color: 'var(--ink-soft)',
                lineHeight: 1.55,
                whiteSpace: 'pre',
              }}
            >
              {LOOP_CODE}
            </pre>
            <p
              style={{
                marginTop: 16,
                color: 'var(--ink-soft)',
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              That's literally it. The harness is mostly plumbing — the intelligence lives in the model.
            </p>
          </div>
        </Build>
      </div>
    </div>
  ),
};
