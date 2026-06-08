import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

const LIST_REQ = `// client → server
{ "method": "tools/list" }`;

const LIST_RES = `// server → client
{
  "tools": [{
    "name": "read_file",
    "description": "Read a file by path.",
    "inputSchema": {
      "type": "object",
      "properties": { "path": { "type": "string" } },
      "required": ["path"]
    }
  }]
}`;

const CALL_REQ = `// client → server
{
  "method": "tools/call",
  "params": {
    "name": "read_file",
    "arguments": { "path": "src/index.ts" }
  }
}`;

const CALL_RES = `// server → client
{
  "content": [
    { "type": "text",
      "text": "import { App } from './App'" }
  ]
}`;

type Variant = "req" | "res" | "call" | "result";

function CodeBlock({ children, variant }: { children: string; variant: Variant }) {
  const palette = {
    req: { bg: "var(--bg-elev)", border: "var(--line)", color: "var(--ink-soft)" },
    res: { bg: "var(--accent-soft)", border: "var(--accent-line)", color: "var(--accent)" },
    call: { bg: "var(--accent-soft)", border: "var(--accent-line)", color: "var(--accent)" },
    result: { bg: "rgba(123, 214, 195, 0.10)", border: "rgba(123, 214, 195, 0.4)", color: "var(--cool)" },
  }[variant];
  return (
    <pre
      style={{
        margin: 0,
        padding: 12,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        borderRadius: 4,
        fontFamily: "var(--mono)",
        fontSize: 12,
        color: palette.color,
        whiteSpace: "pre-wrap",
        overflow: "hidden",
        lineHeight: 1.5,
      }}
    >
      {children}
    </pre>
  );
}

function Caps() {
  const caps = [
    { name: "tools", sub: "функции, которые можно вызвать", color: "var(--accent)" },
    { name: "resources", sub: "данные для чтения", color: "var(--cool)" },
    { name: "prompts", sub: "заготовки-шаблоны", color: "var(--ink-soft)" },
  ];
  return (
    <Stack gap={8}>
      {caps.map((c) => (
        <div
          key={c.name}
          style={{
            display: "grid",
            gridTemplateColumns: "110px 1fr",
            gap: 12,
            alignItems: "baseline",
            padding: "8px 12px",
            borderLeft: `2px solid ${c.color}`,
            background: "var(--bg-elev)",
          }}
        >
          <span style={{ fontFamily: "var(--mono)", fontSize: 13, color: c.color }}>{c.name}</span>
          <span style={{ color: "var(--ink-soft)", fontSize: 13 }}>{c.sub}</span>
        </div>
      ))}
    </Stack>
  );
}

export const mcpShapeSlide: Slide = {
  id: "mcp-shape",
  title: "как устроен MCP",
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>mcp · 02</Eyebrow>
          <SlideTitle size="md">MCP-сервер просто отдаёт инструменты по стандартному протоколу.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Две стороны: <span style={{ color: "var(--accent)" }}>клиент</span> внутри harness'а и{" "}
                <span style={{ color: "var(--cool)" }}>сервер</span> рядом с инструментом. Общаются по JSON-RPC.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Сервер объявляет, что он умеет, тремя видами возможностей: <em>tools</em>, <em>resources</em>,{" "}
                <em>prompts</em>.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Рукопожатие: клиент спрашивает <span style={{ color: "var(--ink)" }}>tools/list</span> → сервер отдаёт
                список инструментов со схемами. Те же JSON-схемы, что и на слайде про инструменты, — просто доставлены по
                протоколу.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Дальше — знакомый цикл: модель выдаёт tool_use → harness шлёт серверу{" "}
                <span style={{ color: "var(--accent)" }}>tools/call</span> → сервер выполняет → результат возвращается как
                tool_result.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={12}>
          <Build step={step} appearAt={1}>
            <Caps />
          </Build>
          <Build step={step} appearAt={2}>
            <Stack gap={8}>
              <CodeBlock variant="req">{LIST_REQ}</CodeBlock>
              <CodeBlock variant="res">{LIST_RES}</CodeBlock>
            </Stack>
          </Build>
          <Build step={step} appearAt={3}>
            <Stack gap={8}>
              <CodeBlock variant="call">{CALL_REQ}</CodeBlock>
              <CodeBlock variant="result">{CALL_RES}</CodeBlock>
            </Stack>
          </Build>
        </Stack>
      }
    />
  ),
};
