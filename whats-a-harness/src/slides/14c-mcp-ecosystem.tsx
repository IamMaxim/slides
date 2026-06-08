import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

const CLIENTS = ["Claude Code", "Cursor", "свой harness"];

function FanDiagram() {
  const W = 540;
  const H = 220;
  const serverX = 110;
  const serverY = H / 2;
  const clientX = W - 110;
  const ys = [46, H / 2, H - 46];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 540 }}>
      <defs>
        <marker id="fanarr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--cool)" />
        </marker>
      </defs>

      {ys.map((y, i) => (
        <line key={i} x1={serverX + 64} y1={serverY} x2={clientX - 66} y2={y} stroke="var(--cool)" strokeWidth="1.2" strokeOpacity={0.7} markerEnd="url(#fanarr)" />
      ))}

      {/* one server */}
      <rect x={serverX - 64} y={serverY - 30} width={128} height={60} rx={5} fill="var(--accent-soft)" stroke="var(--accent-line)" strokeWidth="1.4" />
      <text x={serverX} y={serverY - 4} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--accent)" letterSpacing="0.1em">
        MCP-сервер
      </text>
      <text x={serverX} y={serverY + 14} textAnchor="middle" fontFamily="var(--mono)" fontSize="11" fill="var(--ink-mute)">
        github
      </text>

      {/* many clients */}
      {ys.map((y, i) => (
        <g key={`c${i}`}>
          <rect x={clientX - 66} y={y - 18} width={132} height={36} rx={4} fill="var(--bg-elev)" stroke="var(--line)" strokeWidth="1.2" />
          <text x={clientX} y={y + 5} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill="var(--ink)">
            {CLIENTS[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TransportSplit() {
  const cols = [
    {
      head: "локальные · stdio",
      color: "var(--accent)",
      body: "запущены на твоей машине, общение через stdin/stdout",
      egs: "файлы · git · sqlite",
    },
    {
      head: "удалённые · HTTP/SSE",
      color: "var(--cool)",
      body: "живут где-то в сети, общение по HTTP",
      egs: "Linear · Sentry · Notion",
    },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {cols.map((c) => (
        <div
          key={c.head}
          style={{
            padding: "12px 14px",
            background: "var(--bg-elev)",
            border: "1px solid var(--line)",
            borderTop: `2px solid ${c.color}`,
            borderRadius: 4,
          }}
        >
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.1em", color: c.color, marginBottom: 8 }}>
            {c.head}
          </div>
          <div style={{ color: "var(--ink-soft)", fontSize: 13, lineHeight: 1.45, marginBottom: 8 }}>{c.body}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink-mute)" }}>{c.egs}</div>
        </div>
      ))}
    </div>
  );
}

function ServerChips() {
  const servers = ["GitHub", "Postgres", "Puppeteer", "Slack", "Sentry", "Linear", "Filesystem", "Stripe"];
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {servers.map((s) => (
        <span
          key={s}
          style={{
            fontFamily: "var(--mono)",
            fontSize: 12,
            padding: "5px 10px",
            borderRadius: 4,
            background: "var(--bg-elev)",
            border: "1px solid var(--line)",
            color: "var(--ink-soft)",
          }}
        >
          {s}
        </span>
      ))}
    </div>
  );
}

export const mcpEcosystemSlide: Slide = {
  id: "mcp-ecosystem",
  title: "экосистема MCP",
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.2fr"
      left={
        <Stack gap={20}>
          <Eyebrow>mcp · 03</Eyebrow>
          <SlideTitle size="md">Пиши сервер один раз — подключай куда угодно.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Один и тот же MCP-сервер работает в Claude Code, в Cursor и в твоём собственном harness'е — переписывать
                ничего не нужно.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Серверы бывают <span style={{ color: "var(--accent)" }}>локальные</span> (stdio — файлы, git у тебя на
                машине) и <span style={{ color: "var(--cool)" }}>удалённые</span> (HTTP/SSE — Linear, Sentry по сети).
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                Сообщество уже выложило сотни готовых серверов. Подключаешь их <em>конфигом</em>, а не кодом.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                Для модели не изменилось ничего — она всё так же просто выдаёт tool_use. MCP — это{" "}
                <span style={{ color: "var(--ink)" }}>водопровод</span> на стороне harness'а.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <Stack gap={16}>
          <Build step={step} appearAt={0}>
            <FanDiagram />
          </Build>
          <Build step={step} appearAt={1}>
            <TransportSplit />
          </Build>
          <Build step={step} appearAt={2}>
            <ServerChips />
          </Build>
        </Stack>
      }
    />
  ),
};
