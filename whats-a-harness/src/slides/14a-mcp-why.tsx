import { motion } from "framer-motion";
import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Split, Stack } from "../ui/Layout";

const HARNESSES = ["Claude Code", "Cursor", "свой harness"];
const TOOLS = ["GitHub", "Postgres", "Slack"];

function McpWhyDiagram({ step }: { step: number }) {
  const W = 600;
  const H = 460;
  const leftX = 96;
  const rightX = W - 96;
  const hubX = W / 2;
  const ys = [90, 230, 370];
  const hubY = 230;

  // M×N tangle endpoints (box edges)
  const fromX = leftX + 58;
  const toX = rightX - 58;

  function Box({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
    return (
      <g>
        <rect x={x - 58} y={y - 22} width={116} height={44} rx={4} fill="var(--bg-elev)" stroke={color} strokeWidth="1.3" />
        <text x={x} y={y + 5} textAnchor="middle" fontFamily="var(--mono)" fontSize="12" fill={color}>
          {label}
        </text>
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", maxWidth: 600 }}>
      <defs>
        <marker id="mcparr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
        </marker>
      </defs>

      {/* tangle: M × N direct connectors */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 0 : 1 }} transition={{ duration: 0.4 }}>
        {ys.map((hy, hi) =>
          ys.map((ty, ti) => (
            <line
              key={`${hi}-${ti}`}
              x1={fromX}
              y1={hy}
              x2={toX}
              y2={ty}
              stroke="var(--ink-soft)"
              strokeWidth="1"
              strokeOpacity={0.4}
            />
          ))
        )}
      </motion.g>

      {/* hub: routed through MCP */}
      <motion.g initial={false} animate={{ opacity: step >= 2 ? 1 : 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
        {ys.map((hy, hi) => (
          <line key={`h${hi}`} x1={fromX} y1={hy} x2={hubX - 48} y2={hubY} stroke="var(--accent)" strokeWidth="1.2" strokeOpacity={0.7} />
        ))}
        {ys.map((ty, ti) => (
          <line key={`t${ti}`} x1={hubX + 48} y1={hubY} x2={toX} y2={ty} stroke="var(--cool)" strokeWidth="1.2" strokeOpacity={0.7} markerEnd="url(#mcparr)" />
        ))}
        <rect x={hubX - 48} y={hubY - 26} width={96} height={52} rx={5} fill="var(--accent-soft)" stroke="var(--accent-line)" strokeWidth="1.4" />
        <text x={hubX} y={hubY - 2} textAnchor="middle" fontFamily="var(--mono)" fontSize="13" fill="var(--accent)" letterSpacing="0.12em">
          MCP
        </text>
        <text x={hubX} y={hubY + 15} textAnchor="middle" fontFamily="var(--mono)" fontSize="9.5" fill="var(--ink-mute)" letterSpacing="0.08em">
          один протокол
        </text>
      </motion.g>

      {/* harness boxes (left) */}
      {ys.map((y, i) => (
        <Box key={`hb${i}`} x={leftX} y={y} label={HARNESSES[i]} color="var(--ink)" />
      ))}
      {/* tool boxes (right) */}
      {ys.map((y, i) => (
        <Box key={`tb${i}`} x={rightX} y={y} label={TOOLS[i]} color="var(--ink-soft)" />
      ))}

      {/* count callout */}
      <text x={W / 2} y={H - 12} textAnchor="middle" fontFamily="var(--mono)" fontSize="12.5" letterSpacing="0.06em">
        <tspan fill="var(--ink-mute)">{step >= 2 ? "M + N коннекторов" : "M × N коннекторов"}</tspan>
      </text>
    </svg>
  );
}

export const mcpWhySlide: Slide = {
  id: "mcp-why",
  title: "зачем MCP",
  totalSteps: 4,
  render: ({ step }) => (
    <Split
      ratio="1fr 1.25fr"
      left={
        <Stack gap={20}>
          <Eyebrow>mcp · 01</Eyebrow>
          <SlideTitle size="md">MCP: один протокол вместо M×N интеграций.</SlideTitle>
          <Stack gap={14} style={{ marginTop: 12 }}>
            <Build step={step} appearAt={0}>
              <BodyText>
                Инструменты у каждого harness'а раньше подключались по-своему: свой формат, свой код-обвязка под каждый
                инструмент.
              </BodyText>
            </Build>
            <Build step={step} appearAt={1}>
              <BodyText>
                Отсюда проблема <span style={{ color: "var(--ink)" }}>M×N</span>: M харнессов × N инструментов = столько
                же кастомных интеграций. Каждый пишет коннектор к GitHub, к Postgres, к Slack заново.
              </BodyText>
            </Build>
            <Build step={step} appearAt={2}>
              <BodyText>
                <span style={{ color: "var(--accent)" }}>MCP</span> (Model Context Protocol) — открытый стандарт
                (Anthropic, 2024): один способ для любого harness'а говорить с любым tool-сервером. Пишешь сервер один раз
                — работает везде.
              </BodyText>
            </Build>
            <Build step={step} appearAt={3}>
              <BodyText>
                По сути это <em>USB-C для инструментов агента</em>. M×N превращается в M+N.
              </BodyText>
            </Build>
          </Stack>
        </Stack>
      }
      right={
        <div style={{ display: "flex", justifyContent: "center" }}>
          <McpWhyDiagram step={step} />
        </div>
      }
    />
  ),
};
