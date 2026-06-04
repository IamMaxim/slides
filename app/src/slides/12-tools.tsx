import { motion, AnimatePresence } from 'framer-motion';
import type { Slide } from '../deck/types';
import { Build } from '../deck/Build';
import { Eyebrow, SlideTitle, BodyText } from '../ui/SlideTitle';
import { Split, Stack } from '../ui/Layout';

const SCHEMA = `{
  "name": "read_file",
  "description": "Read the contents of a file by path.",
  "input_schema": {
    "type": "object",
    "properties": {
      "path": { "type": "string" }
    },
    "required": ["path"]
  }
}`;

const TOOL_USE = `{
  "type": "tool_use",
  "name": "read_file",
  "input": { "path": "src/index.ts" }
}`;

const TOOL_RESULT = `{
  "type": "tool_result",
  "content": "import { App } from './App';\\nrender(<App />, ...)"
}`;

const CONTINUATION = `That file boots a React app. It just mounts the App component. Want me to look at App next?`;

type Block = {
  role: 'user' | 'assistant' | 'system';
  label?: string;
  content: string;
  variant: 'plain' | 'tool_use' | 'tool_result' | 'continuation';
};

function CodeBlock({ children, variant }: { children: string; variant: Block['variant'] }) {
  const palette = {
    plain: { bg: 'var(--bg-elev)', border: 'var(--line)', color: 'var(--ink-soft)' },
    tool_use: { bg: 'var(--accent-soft)', border: 'var(--accent-line)', color: 'var(--accent)' },
    tool_result: {
      bg: 'rgba(123, 214, 195, 0.10)',
      border: 'rgba(123, 214, 195, 0.4)',
      color: 'var(--cool)',
    },
    continuation: { bg: 'var(--bg-elev)', border: 'var(--line)', color: 'var(--ink)' },
  }[variant];
  return (
    <pre
      style={{
        margin: 0,
        padding: 12,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 4,
        fontFamily: 'var(--mono)',
        fontSize: 12,
        color: palette.color,
        whiteSpace: 'pre-wrap',
        overflow: 'hidden',
      }}
    >
      {children}
    </pre>
  );
}

export const toolsSlide: Slide = {
  id: 'tools',
  title: 'tools',
  totalSteps: 5,
  render: ({ step }) => <ToolsSlide step={step} />,
};

function ToolsSlide({ step }: { step: number }) {
  const blocks: { show: number; node: React.ReactNode }[] = [
    {
      show: 0,
      node: (
        <div>
          <Label role="system">tool schema declared by the harness</Label>
          <CodeBlock variant="plain">{SCHEMA}</CodeBlock>
        </div>
      ),
    },
    {
      show: 1,
      node: (
        <div>
          <Label role="user">user</Label>
          <div
            style={{
              padding: 12,
              background: 'var(--bg-elev)',
              border: '1px solid var(--line)',
              borderRadius: 4,
              fontFamily: 'var(--mono)',
              fontSize: 13,
              color: 'var(--ink-soft)',
            }}
          >
            What's in src/index.ts?
          </div>
        </div>
      ),
    },
    {
      show: 2,
      node: (
        <div>
          <Label role="assistant">assistant — emits tool_use</Label>
          <CodeBlock variant="tool_use">{TOOL_USE}</CodeBlock>
        </div>
      ),
    },
    {
      show: 3,
      node: (
        <div>
          <Label role="user">harness ran the tool — tool_result back in</Label>
          <CodeBlock variant="tool_result">{TOOL_RESULT}</CodeBlock>
        </div>
      ),
    },
    {
      show: 4,
      node: (
        <div>
          <Label role="assistant">assistant — continues with the result</Label>
          <CodeBlock variant="continuation">{CONTINUATION}</CodeBlock>
        </div>
      ),
    },
  ];

  return (
    <Split
      ratio="1fr 1.3fr"
      left={
        <Stack gap={20}>
          <Eyebrow>evolution · 10</Eyebrow>
          <SlideTitle size="md">Tools: the model writes JSON, someone else runs it.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                A <span style={{ color: 'var(--accent)' }}>tool</span> is just a name + a JSON schema describing what arguments it takes. We hand it to the model in the system prompt or via an API field.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                When the user asks for something a tool can help with, the model emits a special "tool_use" block: name + arguments, as JSON.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                The model itself doesn't run anything. It just produces text shaped like a tool call.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                The <span style={{ color: 'var(--cool)' }}>harness</span> parses the call, executes the real function in the real world, and feeds the result back into the conversation as a "tool_result" message.
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                Now the model has new information. It keeps going — answering, or calling another tool.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={10}>
          <AnimatePresence>
            {blocks
              .filter((b) => step >= b.show)
              .map((b) => (
                <motion.div
                  key={b.show}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {b.node}
                </motion.div>
              ))}
          </AnimatePresence>
        </Stack>
      }
    />
  );
}

function Label({ role, children }: { role: 'user' | 'assistant' | 'system'; children: React.ReactNode }) {
  const color =
    role === 'user' ? 'var(--cool)' : role === 'assistant' ? 'var(--accent)' : 'var(--ink-mute)';
  return (
    <div
      style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color,
        marginBottom: 6,
      }}
    >
      {children}
    </div>
  );
}
