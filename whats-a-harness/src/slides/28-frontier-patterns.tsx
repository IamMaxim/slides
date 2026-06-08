import type { Slide } from "../deck/types";
import { Build } from "../deck/Build";
import { Eyebrow, SlideTitle, BodyText } from "../ui/SlideTitle";
import { Stack } from "../ui/Layout";

const PATTERNS = [
  {
    name: "Fan-out / map-reduce",
    color: "var(--accent)",
    body: "разбей задачу на N независимых кусков, запусти параллельно, собери ответы.",
    eg: "поиск по кодовой базе · широкий обзор",
  },
  {
    name: "Супервизор ↔ воркеры",
    color: "var(--cool)",
    body: "оркестратор раздаёт подзадачи, следит за прогрессом и решает, что делать дальше.",
    eg: "Claude Code subagents · Task-инструмент",
  },
  {
    name: "Агенты-критики",
    color: "#d98a8a",
    body: "один агент делает, другой состязательно проверяет и пытается опровергнуть. Голосование снижает ложные срабатывания.",
    eg: "multi-agent review · adversarial verify",
  },
  {
    name: "Пайплайн",
    color: "var(--ink)",
    body: "задача проходит стадии — найти → проверить → синтезировать, каждая стадия свой агент.",
    eg: "workflow-оркестрация · research-харнессы",
  },
];

function PatternCard({ p }: { p: (typeof PATTERNS)[number] }) {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: "var(--bg-elev)",
        border: "1px solid var(--line)",
        borderLeft: `2px solid ${p.color}`,
        borderRadius: 4,
        height: "100%",
      }}
    >
      <div style={{ fontFamily: "var(--mono)", fontSize: 14, color: "var(--ink)", marginBottom: 8 }}>{p.name}</div>
      <div style={{ color: "var(--ink-soft)", fontSize: 14, lineHeight: 1.5, marginBottom: 12 }}>{p.body}</div>
      <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: p.color, letterSpacing: "0.04em" }}>{p.eg}</div>
    </div>
  );
}

export const frontierPatternsSlide: Slide = {
  id: "frontier-patterns",
  title: "паттерны оркестрации",
  totalSteps: 4,
  render: ({ step }) => (
    <div style={{ display: "grid", gridTemplateRows: "auto 1fr", height: "100%", gap: 22 }}>
      <Stack gap={10}>
        <Eyebrow>фронтир · 02</Eyebrow>
        <SlideTitle size="md">Паттерны: как именно агенты управляют агентами.</SlideTitle>
        <BodyText>
          Всё это уже работает в проде — не футурология, а инженерные шаблоны поверх того же цикла агента.
        </BodyText>
      </Stack>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridAutoRows: "1fr",
          gap: 16,
          alignContent: "start",
        }}
      >
        {PATTERNS.map((p, i) => (
          <Build key={p.name} step={step} appearAt={i} y={10}>
            <PatternCard p={p} />
          </Build>
        ))}
      </div>
    </div>
  ),
};
