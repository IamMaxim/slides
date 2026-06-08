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

const CONTINUATION = `Этот файл запускает React-приложение. Он просто монтирует компонент App. Посмотреть дальше сам App?`;

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
  title: 'инструменты',
  totalSteps: 5,
  render: ({ step }) => <ToolsSlide step={step} />,
};

function ToolsSlide({ step }: { step: number }) {
  const blocks: { show: number; node: React.ReactNode }[] = [
    {
      show: 0,
      node: (
        <div>
          <Label role="system">схема инструмента, объявленная harness'ом</Label>
          <CodeBlock variant="plain">{SCHEMA}</CodeBlock>
        </div>
      ),
    },
    {
      show: 1,
      node: (
        <div>
          <Label role="user">пользователь</Label>
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
            Что в src/index.ts?
          </div>
        </div>
      ),
    },
    {
      show: 2,
      node: (
        <div>
          <Label role="assistant">assistant — выдаёт tool_use</Label>
          <CodeBlock variant="tool_use">{TOOL_USE}</CodeBlock>
        </div>
      ),
    },
    {
      show: 3,
      node: (
        <div>
          <Label role="user">harness выполнил инструмент — tool_result обратно</Label>
          <CodeBlock variant="tool_result">{TOOL_RESULT}</CodeBlock>
        </div>
      ),
    },
    {
      show: 4,
      node: (
        <div>
          <Label role="assistant">assistant — продолжает с результатом</Label>
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
          <Eyebrow>эволюция · 10</Eyebrow>
          <SlideTitle size="md">Инструменты: модель пишет JSON, а выполняет кто-то другой.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                <span style={{ color: 'var(--accent)' }}>Инструмент</span> — это просто имя + JSON-схема, описывающая, какие аргументы он принимает. Мы передаём её модели в системном промпте или через поле API.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Когда пользователь просит что-то, с чем может помочь инструмент, модель выдаёт специальный блок «tool_use»: имя + аргументы в виде JSON.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Сама модель ничего не выполняет. Она лишь производит текст в форме вызова инструмента.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                <span style={{ color: 'var(--cool)' }}>Harness</span> разбирает вызов, выполняет настоящую функцию в реальном мире и подаёт результат обратно в разговор как сообщение «tool_result».
              </BodyText>
            </Build>
            <Build step={step} appearAt={4}>
              <BodyText>
                Теперь у модели есть новая информация. Она идёт дальше — отвечает или вызывает ещё один инструмент.
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
